import prisma from '../../../prisma/client'
import { MessagePattern, RpcException } from '@nestjs/microservices';

import { Controller } from '@nestjs/common';
import { CreatePlayerDto, EditPlayerProfileDto, PlayerProfileDto } from '@validator';
import { v4 } from 'uuid';
import { WITH_PROFILE } from '@constants';

@Controller('player')
export class PlayerController {
    @MessagePattern({ service: 'player', cmd: 'create' })
    async createMany(data: CreatePlayerDto) {
        const players = data.players.map((player: PlayerProfileDto) => ({ ...player, user_id: data.user_id, player_id: v4() }));

        await prisma.$transaction([
            prisma.player.createMany({
                data: players.map((player: PlayerProfileDto) => ({ id: player.player_id, user_id: player.user_id })),
            }),
            prisma.profile.createMany({
                data: players.map((player: PlayerProfileDto) => ({ ...player, user_id: null, })),
            })
        ]).catch(e => { throw new RpcException(e.message) });
        return true;
    }

    @MessagePattern({ service: 'player', cmd: 'update' })
    async updatePlayer(data: EditPlayerProfileDto & { player_id: string }) {
        await prisma.profile.update({
            data: {
                first_name: data.first_name,
                last_name: data.last_name,
                gender: data.gender,
                age: data.age,
            },
            where: {
                player_id: data.player_id
            },
        });

        return await prisma.player.findUniqueOrThrow({
            where: { id: data.player_id }, select: {
                id: true,
                ...WITH_PROFILE
            }
        }).catch(e => { throw new RpcException(e.message) });
    }
}
