import { CreateMissionDto, UpdateMissionDto, AddAssetDto, UploadMissionAssetsDto } from '@validator';
import { MISSION_SELECTION, WITH_ACTIVITIES, WITH_BADGES } from '@constants';
import { Controller } from '@nestjs/common';
import { MsClientService } from '@ms-client';
import { MessagePattern } from '@nestjs/microservices';
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
                ...WITH_BADGES,
            },
        });
        return mission;
    }

    @MessagePattern({ service: 'mission', cmd: 'get-by-id' })
    async getById(data: { id: string }) {
        const mission = await prisma.mission.findUniqueOrThrow({
            where: {
                id: data.id
            },
            select: {
                ...MISSION_SELECTION,
                ...WITH_ACTIVITIES,
                ...WITH_BADGES
            }
        });
        return mission;
    }

    @MessagePattern({ service: 'mission', cmd: 'create' })
    async create(data: CreateMissionDto) {
        const mission = await prisma.mission.create({
            data: {
                code: data.code,
                title: data.title,
                duration: +data.duration,
                distance: data.distance,
                description: data.description,
            }
        });
        return mission;
    }

    @MessagePattern({ service: 'mission', cmd: 'update' })
    async update(data: UpdateMissionDto) {
        const mission = await prisma.mission.update({
            where: {
                id: data.mission_id
            },
            data: {
                code: data.code,
                title: data.title,
                duration: data.duration,
                distance: data.distance,
                description: data.description,
                lastModified: new Date()
            }
        });
        return mission;
    }

    @MessagePattern({ service: 'mission', cmd: 'create-asset' })
    async createAsset(data: AddAssetDto) {
        const mission = await prisma.asset.create({
            data: {
                name: data.name,
                cloudId: data.cloudId,
                cloudLink: data.cloudLink,
                type: data.type,
            }
        });
        return mission;
    }

    @MessagePattern({ service: 'mission', cmd: 'get-assets' })
    async getAsset(data: UploadMissionAssetsDto) {
        const assets = await prisma.asset.findMany({
            where: {
                type: data.type
            }
        });
        return assets;
    }
}
