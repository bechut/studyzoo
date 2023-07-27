import { Controller } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import prisma from '../../../prisma/client'
import { MsClientService } from '@ms-client';
import { LoginDto } from '@validator';
import { lastValueFrom } from 'rxjs';
import { v4 } from 'uuid'

@Controller('auth')
export class AuthController {
    constructor(private readonly msClientService: MsClientService) { }

    @MessagePattern({ service: 'session', cmd: 'login' })
    async login(data: LoginDto) {
        const user$ = this.msClientService.userClient().send({
            service: 'user', cmd: 'get-by-email'
        }, data.email);
        const user = await lastValueFrom(user$).catch(e => { throw new RpcException(e) });

        const otp_id = v4();
        await prisma.otp.create({
            data: {
                id: otp_id,
                value: otp_id.slice(0, 5),
                user_id: user.id
            }
        });

        return data;
    }
}
