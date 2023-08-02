import { MISSION_SELECTION, WITH_ACTIVITIES, WITH_BADGES } from '@constants';
import { Controller } from '@nestjs/common';
import { MsClientService } from '@ms-client';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import prisma from '../../../prisma/client'

@Controller('mission')
export class MissionController {
    constructor(private readonly msClientService: MsClientService) { }

    @MessagePattern({ service: 'mission', cmd: 'get-all' })
    async list() {
        const mission = await prisma.mission.findMany({ 
            select: { 
                ...MISSION_SELECTION, 
                ...WITH_ACTIVITIES, 
                ...WITH_BADGES 
            } 
        });
        return mission;
    }
}
