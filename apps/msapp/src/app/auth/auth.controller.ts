import { lastValueFrom } from 'rxjs';
import { LoginDto } from '@validator';
import { MsClientService } from '@ms-client';
import { Controller, Post, Body } from '@nestjs/common';
import { Public } from '@interceptor';

@Controller('auth')
export class AuthController {
    constructor(private readonly msClientService: MsClientService) { }

    @Public()
    @Post('login')
    async login(@Body() body: LoginDto) {
        const login$ = this.msClientService.sessionClient().send({ service: 'session', cmd: 'login' }, body);
        return await lastValueFrom(login$);
    }
}
