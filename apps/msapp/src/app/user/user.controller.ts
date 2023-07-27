import { Controller, Get, Param } from '@nestjs/common';
import { MsClientService } from '@ms-client';
import { lastValueFrom } from 'rxjs';
import _ from 'lodash'

@Controller('user')
export class UserController {
    constructor(private readonly msClientService: MsClientService) { }

    @Get(':id')
    async login(@Param('id') id: string) {
        const user$ = this.msClientService.userClient().send({ service: 'user', cmd: 'get-by-id' }, { id });
        const user = await lastValueFrom(user$)
        return _.omit(user, ['password']);
    }

}
