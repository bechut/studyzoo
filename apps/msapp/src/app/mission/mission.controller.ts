import { v4 } from 'uuid';
import { CreateMissionDto, UpdateMissionDto } from '@validator';
import { BadRequestException, Body, Controller, Get, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { MsClientService } from '@ms-client';
import { lastValueFrom } from 'rxjs';
import { Public } from '@interceptor';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { DriveUploadService } from '@drive-upload';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { cwd } from 'process';

@Controller('mission')
export class MissionController {
    constructor(
        private readonly driveUploadService: DriveUploadService,
        private readonly configService: ConfigService,
        private readonly msClientService: MsClientService,
    ) { }

    @Public()
    @Get()
    async getAll(@Query() query: any) {
        const missions$ = this.msClientService.missionClient().send(
            { service: 'mission', cmd: 'get-all' },
            query
        );
        return await lastValueFrom(missions$);
    }

    @Public()
    @Post()
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'map_file', maxCount: 1 },
        { name: 'video_file', maxCount: 1 }
    ]))
    async create(
        @UploadedFiles() files: { map_file?: Express.Multer.File[], video_file?: Express.Multer.File[] },
        @Body() body: CreateMissionDto
    ) {
        const map_file = files.map_file[0];
        const video_file = files.video_file[0];

        const mission$ = this.msClientService.missionClient().send(
            { service: 'mission', cmd: 'create' },
            { ...body }
        );

        const mission = await lastValueFrom(mission$)
            .catch(async e => {
                throw new BadRequestException(e);
            });

        this.driveUploadService.uploadFile(
            map_file.filename,
            map_file.mimetype,
            join(cwd(), 'upload', `${map_file.filename}`),
            this.configService.get<string>('GG_MISSION_FOLDER_ID'),
            false
        ).then(map => {
            this.driveUploadService.uploadFile(
                video_file.filename,
                video_file.mimetype,
                join(cwd(), 'upload', `${video_file.filename}`),
                this.configService.get<string>('GG_MISSION_FOLDER_ID'),
                false
            ).then(async video => {
                const mission$ = this.msClientService.missionClient().send(
                    { service: 'mission', cmd: 'update' },
                    {
                        mission_id: mission.id,
                        video: video.fileId,
                        videoUrl: video.webViewLink,
                        mapImage: map.fileId,
                        mapImageUrl: map.webViewLink,
                    });
                await lastValueFrom(mission$)
                    .catch(async e => {
                        throw new BadRequestException(e);
                    });
            }).catch(e => {
                throw new BadRequestException(e)
            });
        }).catch(e => {
            throw new BadRequestException(e)
        });

        return 'Mission has been created'
    }

    @Public()
    @Post()
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'map_file', maxCount: 1 },
        { name: 'video_file', maxCount: 1 }
    ]))
    async update(
        @UploadedFiles() files: { map_file?: Express.Multer.File[], video_file?: Express.Multer.File[] },
        @Body() body: UpdateMissionDto
    ) {
        const map_file = files.map_file[0];
        const video_file = files.video_file[0];

        let mission$ = this.msClientService.missionClient().send(
            { service: 'mission', cmd: 'get-by-id' },
            { id: body.mission_id }
        );

        const mission = await lastValueFrom(mission$)
            .catch(async e => {
                throw new BadRequestException(e);
            });

        let map_drive: any = {};
        let video_drive: any = {};

        let payload = {}

        if (map_file) {
            this.driveUploadService.deleteFile(mission.mapImage);
            map_drive = await this.driveUploadService.uploadFile(
                map_file.filename,
                map_file.mimetype,
                join(cwd(), 'upload', `${map_file.filename}`),
                this.configService.get<string>('GG_MISSION_FOLDER_ID'),
                false
            )
            payload = {
                ...payload,
                video: map_drive.fileId,
                videoUrl: map_drive.webViewLink
            }
        }
        if (map_file) {
            this.driveUploadService.deleteFile(mission.video);
            video_drive = await this.driveUploadService.uploadFile(
                video_file.filename,
                video_file.mimetype,
                join(cwd(), 'upload', `${video_file.filename}`),
                this.configService.get<string>('GG_MISSION_FOLDER_ID'),
                false
            )
            payload = {
                ...payload,
                mapImage: video_drive.fileId,
                mapImageUrl: video_drive.webViewLink
            }
        }

        mission$ = this.msClientService.missionClient().send(
            { service: 'mission', cmd: 'update' },
            {
                mission_id: body.mission_id,
                ...payload
            }
        )
        return { missions: await lastValueFrom(mission$), message: 'Mission has been updated' }
    }
}
