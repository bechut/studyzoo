import { Controller } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import prisma from '../../../prisma/client'
import { CreateIntroDto } from '@validator';

@Controller('intro')
export class IntroController {
    @MessagePattern({ service: 'intro', cmd: 'get-all' })
    async getAll() {
        return await prisma.intro.findMany();
    }

    @MessagePattern({ service: 'intro', cmd: 'get-by-id' })
    async getById(data: { id: string }) {
        return await prisma.intro.findUniqueOrThrow({ where: { id: data.id } });
    }

    @MessagePattern({ service: 'intro', cmd: 'create' })
    async create(data: CreateIntroDto) {
        return await prisma.intro.create({
            data: {
                title: data.title,
                image: '',
                image_url: '',
            }
        }).catch(e => { throw new RpcException(e) });
    }

    @MessagePattern({ service: 'intro', cmd: 'update' })
    async update(data: { id: string; image: string; image_url: string; title: string }) {
        return await prisma.intro.update({
            where: {
                id: data.id
            },
            data: {
                title: data.title,
                image: data.image,
                image_url: data.image_url,
                updatedAt: new Date()
            }
        }).catch(e => { throw new RpcException(e) });
    }
}
