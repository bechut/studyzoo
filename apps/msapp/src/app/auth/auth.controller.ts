import { lastValueFrom } from 'rxjs';
import { LoginDto, VerifyDto } from '@validator';
import { MsClientService } from '@ms-client';
import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { Public } from '@interceptor';
import { MailerService } from '@mailer';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly msClientService: MsClientService,
        private readonly mailerService: MailerService
    ) { }

    @Public()
    @Post('login')
    async login(@Body() body: LoginDto) {
        const login$ = this.msClientService.sessionClient().send(
            { service: 'session', cmd: 'login' },
            body
        );
        const login = await lastValueFrom(login$)
            .catch(e => { throw new BadRequestException(e) });
        if (login.message) {
            const signup_otp$ = this.msClientService.sessionClient().send(
                { service: 'session', cmd: 'create-login-otp' },
                {
                    user_id: login.user_id
                }
            );
            const signup_otp = await lastValueFrom(signup_otp$);

            this.mailerService.send(
                [body.email],
                'Log In',
                { otp: signup_otp.value },
                'login'
            );
            return 'Please check your email';
        }
    }

    @Public()
    @Post('verify')
    async verifyOtp(@Body() body: VerifyDto) {
        const verify$ = this.msClientService.sessionClient().send(
            { service: 'session', cmd: 'verify-otp' },
            body
        );
        return await lastValueFrom(verify$).catch(e => { throw new BadRequestException(e) });
    }
}
