import { lastValueFrom } from 'rxjs';
import { LoginDto } from '@validator';
import { MsClientService } from '@ms-client';
import { Controller, Post, Body } from '@nestjs/common';

@Controller('auth')
export class AuthController {
    constructor(private readonly msClientService: MsClientService) { }

    @Post('login')
    async login(@Body() body: LoginDto) {
        const login$ = this.msClientService.sessionClient().send({ service: 'session', cmd: 'login' }, body)
        return await lastValueFrom(login$);
    }
}
