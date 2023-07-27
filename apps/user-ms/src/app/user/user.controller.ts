import { CreateUserDto } from '@validator';
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
                    id: user_id,
                    first_name: data.first_name,
                    last_name: data.last_name,
                    user_id
                }
            })
        ]).catch(e => { throw new RpcException(e.message) })
        return 'User successfully created';
    }
}
