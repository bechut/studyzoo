import { Controller } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import prisma from '../../../prisma/client'
import { MsClientService } from '@ms-client';
import { ChangePasswordDto, LoginDto, ResetPasswordDto, VerifyDto } from '@validator';
import { lastValueFrom } from 'rxjs';
import { v4 } from 'uuid'
import { JwtService } from '@jwt';
import { compare } from 'bcrypt';
import { OTP_TYPE } from '../../../prisma/client/session/index';
import { ConfigService } from '@nestjs/config';
import { authenticator } from 'otplib';
@Controller('auth')
export class AuthController {
    private otp_secret: string;
    constructor(
        private readonly msClientService: MsClientService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {
        this.otp_secret = this.configService.get<string>('OTP_SECRET');
    }

    private generate_otp() {
        return authenticator.generate(this.otp_secret)
    }

    private verify_otp(token: string) {
        return authenticator.verify({ token, secret: this.otp_secret })
    }

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

    @MessagePattern({ service: 'session', cmd: 'reset-password' })
    async resetPassword(data: ResetPasswordDto) {
        const user$ = this.msClientService.userClient().send({
            service: 'user', cmd: 'get-by-email'
        }, { email: data.email });
        const user = await lastValueFrom(user$).catch(e => { throw new RpcException(e) });

        if (!user.status) throw new RpcException('User deactivated');

        const otp = await this.createForgotPasswordOtp({ user_id: user.id })

        return {
            user_id: user.id,
            otp,
            message: 'Reset password successfully'
        };
    }

    @MessagePattern({ service: 'session', cmd: 'verify-otp' })
    async verifyOtp(data: VerifyDto) {
        let otp = await prisma.otp.findFirstOrThrow({
            where: {
                value: data.otp,
                type: OTP_TYPE.LOGIN,
            }
        }).catch(e => { throw new RpcException(e.message) });

        if (otp.value !== data.otp)
            throw new RpcException('Invalid OTP');

        otp = await prisma.otp.update({
            where: {
                id: otp.id
            },
            data: {
                value: this.generate_otp(),
                type: OTP_TYPE.ACCESS_TOKEN
            }
        }).catch(e => { throw new RpcException(e.message) });

        const user$ = this.msClientService.userClient().send({ service: 'user', cmd: 'get-by-id' }, { id: otp.user_id })
        const user = await lastValueFrom(user$).catch(e => { throw new RpcException(e) });

        return {
            access_token: this.jwtService.get().sign({
                otp: otp.value,
                user_id: user.id,
                updatedAt: user.updatedAt
            })
        };
    }

    @MessagePattern({ service: 'session', cmd: 'change-password' })
    async changePassword(data: ChangePasswordDto) {
        const otp = await prisma.otp.findFirstOrThrow({
            where: {
                value: data.otp,
                type: OTP_TYPE.FORGOT_PASSWORD,
            }
        }).catch(e => { throw new RpcException(e.message) });

        if (!this.verify_otp(otp.value))
            throw new RpcException('Invalid OTP');

        const user_id = otp.user_id;

        await prisma.otp.delete({
            where: {
                id: otp.id
            },
        }).catch(e => { throw new RpcException(e.message) });

        return user_id;
    }

    @MessagePattern({ service: 'session', cmd: 'get-otp-by-id' })
    async getOtpByValue(data: { id: string }) {
        const otp = prisma.otp.findUniqueOrThrow({ where: { id: data.id } }).catch(e => { throw new RpcException(e.message) })
        return otp;
    }

    @MessagePattern({ service: 'session', cmd: 'get-access-token-otp' })
    async getAccessTokenOtp(data: { value: string; user_id: string }) {
        const otp = prisma.otp.findFirstOrThrow(
            {
                where: {
                    value: data.value,
                    type: OTP_TYPE.ACCESS_TOKEN,
                }
            }
        ).catch(e => { throw new RpcException(e.message) })
        return otp;
    }

    @MessagePattern({ service: 'session', cmd: 'create-login-otp' })
    async createLoginOtp(data: { user_id: string }) {
        const otp_string = this.generate_otp();

        const otp = await prisma.otp.create({
            data: {
                type: OTP_TYPE.LOGIN,
                value: otp_string,
                user_id: data.user_id
            }
        }).catch(e => { throw new RpcException(e.message) })
        return otp;
    }

    @MessagePattern({ service: 'session', cmd: 'create-forgot-otp' })
    async createForgotPasswordOtp(data: { user_id: string }) {
        const otp_string = this.generate_otp();

        const otp = await prisma.otp.create({
            data: {
                type: OTP_TYPE.FORGOT_PASSWORD,
                value: otp_string,
                user_id: data.user_id
            }
        }).catch(e => { throw new RpcException(e.message) })
        return otp;
    }
}
