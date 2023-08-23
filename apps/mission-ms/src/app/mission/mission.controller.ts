import { v4 } from 'uuid';
import { CreateMissionDto, UpdateMissionDto, AddAssetDto, GetMissionAssetsDto } from '@validator';
import { MISSION_SELECTION, WITH_ACTIVITIES, WITH_ASSETS, WITH_BADGES } from '@constants';
import { Controller } from '@nestjs/common';
import { MsClientService } from '@ms-client';
import { MessagePattern } from '@nestjs/microservices';
import prisma from '../../../prisma/client'
import { MissionAssetType } from '@types';

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
                ...WITH_ASSETS
            },
            orderBy: {
                createdAt: "asc"
            }
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
                ...WITH_BADGES,
                ...WITH_ASSETS
            }
        });
        return mission;
    }

    @MessagePattern({ service: 'mission', cmd: 'create' })
    async create(data: CreateMissionDto) {
        const mission_id = v4();
        const transactions = [];

        transactions.push(
            prisma.mission.create({
                data: {
                    id: mission_id,
                    code: data.code,
                    title: data.title,
                    duration: +data.duration,
                    distance: data.distance,
                    description: data.description,
                }
            })
        );

        if (data.map_id) {
            transactions.push(
                prisma.missionAsset.create({
                    data: {
                        mission_id: mission_id,
                        asset_id: data.map_id,
                        type: MissionAssetType.IMAGE
                    }
                })
            );
        }

        if (data.video_id) {
            transactions.push(
                prisma.missionAsset.create({
                    data: {
                        mission_id: mission_id,
                        asset_id: data.video_id,
                        type: MissionAssetType.VIDEO
                    }
                })
            );
        }

        await prisma.$transaction(transactions);

        return 'Mission has been created';
    }

    @MessagePattern({ service: 'mission', cmd: 'update' })
    async update(data: UpdateMissionDto) {
        const transactions = [];

        await prisma.missionAsset.findFirstOrThrow({
            where: {
                type: MissionAssetType.VIDEO,
                mission_id: data.mission_id
            }
        })
            .then((asset) => {
                transactions.push(
                    prisma.missionAsset.update({
                        where: { id: asset.id, type: MissionAssetType.VIDEO },
                        data: {
                            asset_id: data.video_id || null
                        }
                    })
                );
            })
            .catch(() => {
                transactions.push(
                    prisma.missionAsset.create({
                        data: {
                            asset_id: data.video_id || null,
                            mission_id: data.mission_id,
                            type: MissionAssetType.VIDEO
                        }
                    })
                );
            });

        await prisma.missionAsset.findFirstOrThrow({
            where: {
                type: MissionAssetType.IMAGE,
                mission_id: data.mission_id
            }
        })
            .then((asset) => {
                transactions.push(
                    prisma.missionAsset.update({
                        where: { id: asset.id, type: MissionAssetType.IMAGE },
                        data: {
                            asset_id: data.map_id || null,
                        }
                    })
                );
            })
            .catch(() => {
                transactions.push(
                    prisma.missionAsset.create({
                        data: {
                            asset_id: data.map_id || null,
                            mission_id: data.mission_id,
                            type: MissionAssetType.IMAGE
                        }
                    })
                );
            });

        transactions.push(
            prisma.mission.update({
                where: {
                    id: data.mission_id
                },
                data: {
                    code: data.code,
                    title: data.title,
                    duration: +data.duration,
                    distance: data.distance,
                    description: data.description,
                }
            })
        );
        return await prisma.$transaction(transactions)
    }

    @MessagePattern({ service: 'mission', cmd: 'delete-by-id' })
    async delete(id: string) {
        console.log("id", id)
        const mission = await this.getById({ id });
        await prisma.$transaction([
            prisma.missionAsset.deleteMany({
                where: {
                    mission_id: mission.id
                }
            }),
            prisma.mission.delete({
                where: {
                    id: mission.id
                }
            })
        ]);
        return "Mission deleted"
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
    async getAsset(data: GetMissionAssetsDto) {
        const assets = await prisma.asset.findMany({
            where: {
                type: { in: data.types }
            },
            include: {
                _count: {
                    select: { Missions: true },
                },
            },
        });
        return assets;
    }
}
