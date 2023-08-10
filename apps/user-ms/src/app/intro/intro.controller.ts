import { Controller } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import prisma from '../../../prisma/client'
import { CreateIntroDto, GetIntroDto } from '@validator';

@Controller('intro')
export class IntroController {
    @MessagePattern({ service: 'intro', cmd: 'get-all' })
    async getAll(query: GetIntroDto) {
        return await prisma.intro.findMany({ 
            where: query, 
            orderBy: { order: 'asc' } 
        }).catch(e => { throw new RpcException(e) });;
    }

    @MessagePattern({ service: 'intro', cmd: 'get-by-id' })
    async getById(data: { id: string }) {
        return await prisma.intro.findUniqueOrThrow({ where: { id: data.id } })
            .catch(e => { throw new RpcException(e) });
    }

    @MessagePattern({ service: 'intro', cmd: 'create' })
    async create(data: CreateIntroDto) {
        return await prisma.intro.create({
            data: {
                title: data.title,
                type: data.type,
                order: +data.order,
                image: '',
                image_url: '',
            }
        }).catch(e => { throw new RpcException(e) });
    }

    @MessagePattern({ service: 'intro', cmd: 'update' })
    async update(data: CreateIntroDto & { image: string; image_url: string; id: string }) {
        return await prisma.intro.update({
            where: {
                id: data.id
            },
            data: {
                title: data.title,
                image: data.image,
                type: data.type,
                order: +data.order,
                image_url: data.image_url,
                updatedAt: new Date()
            }
        }).catch(e => { throw new RpcException(e) });
    }
}
