import {
    Controller,
    Post,
    Body,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
    Get,
    Put,
    Param
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';
import { join } from 'path';
import { cwd } from 'process';
import { DriveUploadService } from '@drive-upload';
import { ConfigService } from '@nestjs/config';
import { MsClientService } from '@ms-client';
import { lastValueFrom } from 'rxjs';

@Controller('intro')
export class IntroController {
    constructor(
        private readonly driveUploadService: DriveUploadService,
        private readonly configService: ConfigService,
        private readonly msClientService: MsClientService,
    ) { }

    @Get()
    async getAll() {
        const intros$ = this.msClientService.userClient().send(
            { service: 'intro', cmd: 'get-all' },
            {}
        );
        return await lastValueFrom(intros$).catch(async e => {
            throw new BadRequestException(e);
        });
    }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async create(@UploadedFile() file: Express.Multer.File, @Body() body: { title: string }) {
        const intro$ = this.msClientService.userClient().send(
            { service: 'intro', cmd: 'create' },
            {
                title: body.title,
            }
        );

        const intro = await lastValueFrom(intro$)
            .catch(async e => {
                throw new BadRequestException(e);
            });

        const url = await this.driveUploadService.uploadFile(
            file.filename,
            file.mimetype,
            join(cwd(), 'upload', `${file.filename}`),
            this.configService.get<string>('GG_INTRO_FOLDER_ID')
        ).catch(e => { throw new BadRequestException(e) });

        const updated$ = this.msClientService.userClient().send(
            { service: 'intro', cmd: 'update' },
            {
                id: intro.id,
                title: body.title,
                image: url.fileId,
                image_url: url.webViewLink,
            }
        );

        return await lastValueFrom(updated$)
            .catch(async e => {
                await this.driveUploadService.deleteFile(url.fileId);
                throw new BadRequestException(e);
            });
    }

    @Put(':id')
    @UseInterceptors(FileInterceptor('file'))
    async update(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: { title: string },
        @Param('id') id: string
    ) {
        const intro$ = this.msClientService.userClient().send(
            { service: 'intro', cmd: 'get-by-id' },
            {
                id,
            }
        );

        const intro = await lastValueFrom(intro$)
            .catch(async e => {
                throw new BadRequestException(e);
            });

        const url = await this.driveUploadService.uploadFile(
            file.filename,
            file.mimetype,
            join(cwd(), 'upload', `${file.filename}`),
            this.configService.get<string>('GG_INTRO_FOLDER_ID')
        ).catch(e => { throw new BadRequestException(e) });

        const updated$ = this.msClientService.userClient().send(
            { service: 'intro', cmd: 'update' },
            {
                id: id,
                title: body.title,
                image: url.fileId,
                image_url: url.webViewLink,
            }
        );

        return await lastValueFrom(updated$)
            .then(async () => {
                await this.driveUploadService.deleteFile(intro.image);
                return 'Intro has been updated successfully!'
            })
            .catch(async e => {
                await this.driveUploadService.deleteFile(url.fileId);
                throw new BadRequestException(e);
            });
    }
}
