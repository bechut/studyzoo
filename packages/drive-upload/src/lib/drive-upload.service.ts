import { BadGatewayException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createReadStream, rmSync } from 'fs';
import { google } from 'googleapis';
import { join } from 'path';
import { cwd } from 'process';

@Injectable()
export class DriveUploadService {
  constructor(private readonly configService: ConfigService) { }

  private getDrive() {
    const CLIENT_ID = this.configService.get<string>('GG_CLIENT_ID');
    const CLIENT_SECRET = this.configService.get<string>('GG_CLIENT_SECRET');
    const REDIRECT_URI = this.configService.get<string>('GG_REDIRECT_URI');
    const REFRESH_TOKEN = this.configService.get<string>('GG_REFRESH_TOKEN');

    const client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
    client.setCredentials({ refresh_token: REFRESH_TOKEN });

    const drive = google.drive({
      version: 'v3',
      auth: client
    })

    return drive;
  }

  async setFilePublic(fileId: string) {
    try {
      await this.getDrive().permissions.create({
        fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone'
        }
      })

      const getUrl = await this.getDrive().files.get({
        fileId,
        fields: 'webViewLink, webContentLink'
      })
      return getUrl.data;
    } catch (e) {
      throw new BadGatewayException(e)
    }
  }

  async deleteFile(fileId: string) {
    try {
      const deleteFile = await this.getDrive().files.delete({
        fileId: fileId
      })
      return deleteFile;
    } catch (e) {
      throw new BadGatewayException(e)
    }
  }

  async uploadFile(name: string, mimeType: string, path: string, parentFolderId: string, clearUpload: boolean) {
    const rootFolderId = this.configService.get<string>('GG_ROOT_FOLDER_ID') as string;
    try {
      const createFile = await this.getDrive().files.create({
        requestBody: {
          name,
          mimeType,
          parents: parentFolderId !== '' ? [parentFolderId] : [rootFolderId]
        },
        media: {
          mimeType,
          body: createReadStream(path)
        },
      })
      const fileId = createFile.data.id as string;
      const getUrl = await this.setFilePublic(fileId);
      return { ...getUrl, fileId };
    } catch (e) {
      throw new BadGatewayException(e)
    } finally {
      clearUpload && rmSync(join(cwd(), 'upload/*'), { recursive: true, force: true })
    }
  }

  async createFolder(name: string, path: string, parentFolderId: string) {
    const rootFolderId = this.configService.get<string>('GG_ROOT_FOLDER_ID') as string;
    try {
      const createFile = await this.getDrive().files.create({
        requestBody: {
          name,
          mimeType: 'application/vnd.google-apps.folder',
          parents: parentFolderId !== '' ? [parentFolderId] : [rootFolderId]
        },
      })
      const fileId = createFile.data.id as string;
      
      return { fileId };
    } catch (e) {
      throw new BadGatewayException(e)
    } 
  }
}