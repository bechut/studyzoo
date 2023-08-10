import { USER_SELECTION, WITH_PLAYER, WITH_PROFILE } from '@constants';
import { CreateUserDto, UpdateUserDto } from '@validator';
import { Controller } from '@nestjs/common';

import { MessagePattern, RpcException } from '@nestjs/microservices';
import prisma from '../../../prisma/client'
import { v4 } from 'uuid'
import { genSalt, hash } from 'bcrypt';

@Controller('user')
export class UserController {
    @MessagePattern({ service: 'user', cmd: 'create' })
    async create(data: CreateUserDto) {
        const user_id = v4();
        let hash_password = '';

        try {
            hash_password = await hash(data.password, await genSalt(10))
        } catch (e) {
            throw new RpcException(e.message)
        }

        await prisma.$transaction([
            prisma.user.create({
                data: {
                    id: user_id,
                    email: data.email,
                    password: hash_password,
                }
            }),
            prisma.profile.create({
                data: {
                    first_name: data.first_name,
                    last_name: data.last_name,
                    user_id
                }
            })
        ]).catch(e => { throw new RpcException(e.message) })
        return await prisma.user.findUniqueOrThrow({
            select: {
                ...USER_SELECTION, ...WITH_PROFILE
            },
            where: {
                id: user_id,
            }
        });
    }

    @MessagePattern({ service: 'user', cmd: 'get-by-email' })
    async getByEmail(data: { email: string }) {
        const user = await prisma.user.findUniqueOrThrow({
            select: {
                ...USER_SELECTION, ...WITH_PROFILE
            },
            where: {
                email: data.email,
            },
        }).catch(e => { throw new RpcException(e.message) })
        return user;
    }

    @MessagePattern({ service: 'user', cmd: 'get-by-id' })
    async getById(data: { id: string }) {
        const user = await prisma.user.findUniqueOrThrow({
            select: { ...USER_SELECTION, ...WITH_PLAYER },
            where: {
                id: data.id,
            },
        }).catch(e => { throw new RpcException(e.message) })
        return user;
    }

    @MessagePattern({ service: 'user', cmd: 'update' })
    async update(data: { id: string, payload: UpdateUserDto }) {
        await prisma.user.findUniqueOrThrow({
            select: {
                ...USER_SELECTION, ...WITH_PROFILE
            },
            where: {
                id: data.id,
            },
        }).catch(e => { throw new RpcException(e.message) });
        await prisma.profile.update({
            data: data.payload,
            where: {
                id: data.id
            }
        }).catch(e => { throw new RpcException(e.message) });
        return await prisma.user.update({
            select: {
                ...USER_SELECTION, ...WITH_PROFILE
            },
            where: {
                id: data.id,
            },
            data: {
                updatedAt: new Date(),
            }
        });
    }

    @MessagePattern({ service: 'user', cmd: 'update-password' })
    async updatePassword(data: { user_id: string, new_password: string }) {
        return await prisma.user.update({
            data: {
                password: await hash(data.new_password, await genSalt(10)),
                updatedAt: new Date()
            },
            where: {
                id: data.user_id
            }
        }).catch(e => { throw new RpcException(e.message) });
    }
}
