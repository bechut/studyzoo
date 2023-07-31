import { Controller, Get, Req, Patch, Body, Post, BadRequestException } from '@nestjs/common';
import { MsClientService } from '@ms-client';
import { lastValueFrom } from 'rxjs';
import _ from 'lodash'
import { CreatePlayerDto, UpdateUserDto } from '@validator';

@Controller('user')
export class UserController {
    constructor(private readonly msClientService: MsClientService) { }

    @Get()
    async getOwnDetail(@Req() req: Request & { user }) {
        return _.omit(req.user, ['password']);
    }

    @Patch()
    async updateOwn(@Body() body: UpdateUserDto, @Req() req: Request & { user }) {
        const updated = this.msClientService.userClient().send(
            { service: 'user', cmd: 'update' }, 
            { id: req.user.id, payload: body }
        );
        return await lastValueFrom(updated);
    }

    @Post('add-players')
    async addPlayers(@Body() body: CreatePlayerDto, @Req() req: Request & { user }) {
        const isPlayersAdded$ = this.msClientService.userClient().send(
            { service: 'player', cmd: 'create' },
            { user_id: req.user.id, players: body.players }
        );
        await lastValueFrom(isPlayersAdded$).catch(e => { throw new BadRequestException(e) });
        const user$ = this.msClientService.userClient().send(
            { service: 'user', cmd: 'get-by-id' },
            { id: req.user.id }
        );
        return await lastValueFrom(user$);
    }
}
