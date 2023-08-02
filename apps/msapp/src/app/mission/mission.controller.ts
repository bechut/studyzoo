import { Controller, Get, Query } from '@nestjs/common';
import { MsClientService } from '@ms-client';
import { lastValueFrom } from 'rxjs'; 

@Controller('mission')
export class MissionController {
    constructor(private readonly msClientService: MsClientService) { }

    @Get()
    async getAll(@Query() query: any) {
        const missions$ = this.msClientService.missionClient().send(
            { service: 'mission', cmd: 'get-all' }, 
            query
        );
        return await lastValueFrom(missions$);
    }
}
