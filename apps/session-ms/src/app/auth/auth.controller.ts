import { Controller } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import prisma from '../../../prisma/client'
import { MsClientService } from '@ms-client';
import { LoginDto, VerifyDto } from '@validator';
import { lastValueFrom } from 'rxjs';
import { v4 } from 'uuid'
import { JwtService } from '@jwt';
import { compare } from 'bcrypt';
import { OTP_TYPE } from '../../../prisma/client/session/index';
import { ConfigService } from '@nestjs/config';
import { totp } from 'otplib';
@Controller('auth')
export class AuthController {
    constructor(
        private readonly msClientService: MsClientService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    @MessagePattern({ service: 'session', cmd: 'login' })
    async login(data: LoginDto) {
        const user$ = this.msClientService.userClient().send({
            service: 'user', cmd: 'get-by-email'
        }, { email: data.email });
        const user = await lastValueFrom(user$).catch(e => { throw new RpcException(e) });

        if (!(await compare(data.password, user.password))) throw new RpcException('Password does not match');
        if (!user.status) throw new RpcException('User deactivated');

        return {
            user_id: user.id,
            message: 'Login successfully'
        };
    }

    @MessagePattern({ service: 'session', cmd: 'verify-otp' })
    async verifyOtp(data: VerifyDto) {
        let otp = await prisma.otp.findFirstOrThrow({
            where: {
                value: data.otp,
                type: OTP_TYPE.LOGIN,
                user_id: data.user_id
            }
        }).catch(e => { throw new RpcException(e.message) });

        const otp_secret = this.configService.get<string>('OTP_SECRET')

        if (totp.check(data.otp, otp_secret))
            throw new RpcException('Invalid OTP');

        otp = await prisma.otp.update({
            where: {
                id: otp.id
            },
            data: {
                value: totp.generate(otp_secret),
                type: OTP_TYPE.ACCESS_TOKEN
            }
        }).catch(e => { throw new RpcException(e.message) });

        return {
            access_token: this.jwtService.get().sign({
                otp: otp.value,
                user_id: data.user_id
            })
        };
    }

    @MessagePattern({ service: 'session', cmd: 'get-otp-by-id' })
    async getOtpByValue(data: { id: string }) {
        const otp = prisma.otp.findUniqueOrThrow({ where: { id: data.id } }).catch(e => { throw new RpcException(e.message) })
        return otp;
    }

    @MessagePattern({ service: 'session', cmd: 'create-login-otp' })
    async createLoginOtp(data: { user_id: string }) {
        const otp_string = totp.generate(this.configService.get<string>('OTP_SECRET'));

        const otp = await prisma.otp.create({
            data: {
                type: OTP_TYPE.LOGIN,
                value: otp_string,
                user_id: data.user_id
            }
        }).catch(e => { throw new RpcException(e.message) })
        return otp;
    }
}
