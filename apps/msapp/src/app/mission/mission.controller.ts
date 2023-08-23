import { CreateMissionDto, GetMissionAssetsDto, UpdateMissionDto, UploadMissionAssetsDto } from '@validator';
import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { MsClientService } from '@ms-client';
import { lastValueFrom } from 'rxjs';
import { Public } from '@interceptor';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { DriveUploadService } from '@drive-upload';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { cwd } from 'process';
import { SseService } from '@sse';

@Controller('mission')
export class MissionController {
    constructor(
        private readonly driveUploadService: DriveUploadService,
        private readonly configService: ConfigService,
        private readonly msClientService: MsClientService,
        private readonly sseService: SseService,
    ) { }

    @Public()
    @Get()
    async getAll(@Query() query: any) {
        const missions$ = this.msClientService.missionClient().send(
            { service: 'mission', cmd: 'get-all' },
            query
        );
        const missions = await lastValueFrom(missions$);
        return missions;
    }

    @Public()
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async create(
        @Body() body: CreateMissionDto
    ) {
        const mission$ = this.msClientService.missionClient().send(
            { service: 'mission', cmd: 'create' },
            { ...body }
        );

        const mission = await lastValueFrom(mission$)
            .catch(async e => {
                throw new BadRequestException(e);
            });

        return { mission, message: 'Mission has been created' };
    }

    @Public()
    @Patch()
    @UseInterceptors(FileInterceptor('file'))
    async update(
        @Body() body: UpdateMissionDto
    ) {
        let mission$ = this.msClientService.missionClient().send(
            { service: 'mission', cmd: 'get-by-id' },
            { id: body.mission_id }
        );

        mission$ = this.msClientService.missionClient().send(
            { service: 'mission', cmd: 'update' },
            body
        )
        return { missions: await lastValueFrom(mission$), message: 'Mission has been updated' }
    }

    @Public()
    @Post('assets')
    @UseInterceptors(FilesInterceptor('files', 3))
    async UploadMissionAsset(
        @UploadedFiles() files: Array<Express.Multer.File>,
        @Body() body: UploadMissionAssetsDto,
    ) {
        if (files.length > 3) throw new BadRequestException('Only 3 files can be uploaded in time');
        const type = body.type.toLowerCase()

        files
            .filter((file: Express.Multer.File) => file.mimetype.indexOf(type) !== -1)
            .map(async (file: Express.Multer.File) => {
                const { fileId, webViewLink } = await this.driveUploadService.uploadFile(
                    file.filename,
                    file.mimetype,
                    join(cwd(), 'upload', `${file.filename}`),
                    this.configService.get<string>('GG_MISSION_FOLDER_ID'),
                    true
                );

                const mission_asset$ = this.msClientService.missionClient().send(
                    { service: 'mission', cmd: 'create-asset' },
                    {
                        name: `${file.originalname}-${file.filename}`,
                        cloudLink: webViewLink,
                        cloudId: fileId,
                        type: body.type,
                    }
                );

                const mission_asset = await lastValueFrom(mission_asset$);
                this.sseService.addEvent({ data: { mission_asset, type: body.type } });
                this.sseService.sendEvents();
            });
        return 'Upload assets successfully'
    }

    @Public()
    @Get('assets')
    async GetMissionAssets(@Query() query: GetMissionAssetsDto) {
        const mission_asset$ = this.msClientService.missionClient().send(
            { service: 'mission', cmd: 'get-assets' },
            query
        )
        return await lastValueFrom(mission_asset$);
    }

    @Public()
    @Delete(":id")
    async delete(
        @Param("id") params: { id: string }
    ) {
        const mission$ = this.msClientService.missionClient().send(
            { service: 'mission', cmd: 'delete-by-id' },
            params
        );

        return { missions: await lastValueFrom(mission$), message: 'Mission has been deleted' }
    }

    @Public()
    @Get(':id')
    async getById(@Param() params: { id: string }) {
        const missions$ = this.msClientService.missionClient().send(
            { service: 'mission', cmd: 'get-by-id' },
            params
        );
        const missions = await lastValueFrom(missions$);
        return missions;
    }
}
