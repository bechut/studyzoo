import { Controller } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import prisma from '../../../prisma/client'
import { MsClientService } from '@ms-client';
import { LoginDto } from '@validator';
import { lastValueFrom } from 'rxjs';
import { v4 } from 'uuid'
import { JwtService } from '@jwt';
import { compare } from 'bcrypt';

@Controller('auth')
export class AuthController {
    constructor(private readonly msClientService: MsClientService, private readonly jwtService: JwtService) { }

    @MessagePattern({ service: 'session', cmd: 'login' })
    async login(data: LoginDto) {
        const user$ = this.msClientService.userClient().send({
            service: 'user', cmd: 'get-by-email'
        }, { email: data.email });
        const user = await lastValueFrom(user$).catch(e => { throw new RpcException(e) });

        if (!(await compare(data.password, user.password))) throw new RpcException('Password does not match');
        if (!user.status) throw new RpcException('User deactivated');

        const otp_id = v4();
        await prisma.otp.create({
            data: {
                id: otp_id,
                value: otp_id.slice(0, 6),
                user_id: user.id
            }
        });
        const access_token = this.jwtService.get().sign({ value: otp_id })

        return {
            access_token,
            message: 'Login successfully'
        };
    }

    @MessagePattern({ service: 'session', cmd: 'get-otp-by-id' })
    async getOtpByValue(data: { id: string }) {
        const otp = prisma.otp.findUniqueOrThrow({ where: { id: data.id } }).catch(e => { throw new RpcException(e.message) })
        return otp;
    }
}
