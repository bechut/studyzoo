import { Controller, Get, Req, Patch, Body, Post, BadRequestException, Put, Param } from '@nestjs/common';
import { MsClientService } from '@ms-client';
import { lastValueFrom } from 'rxjs';
import _ from 'lodash'
import { CreatePlayerDto, UpdateUserDto, RegisterBinocularDto, CreateUserDto, EditPlayerProfileDto } from '@validator';
import { Public } from '@interceptor';
import { MailerService } from '@mailer';

@Controller('user')
export class UserController {
    constructor(
        private readonly msClientService: MsClientService,
        private readonly mailerService: MailerService
    ) { }

    @Get()
    async getOwnDetail(@Req() req: Request & { user }) {
        return _.omit(req.user, ['password']);
    }

    @Public()
    @Post()
    async create(@Body() body: CreateUserDto) {
        const user$ = this.msClientService.userClient().send(
            { service: 'user', cmd: 'create' },
            body
        );

        await lastValueFrom(user$).catch((e) => { throw new BadRequestException(e) })

        return 'Create user successfully';
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

    @Put('player/:player_id')
    async editPlayer(
        @Body() body: EditPlayerProfileDto, 
        @Req() req: Request & { user },
        @Param('player_id') player_id: string
    ) {
        this.isPlayerBelongToThisUser(req.user, player_id);

        const player_updated$ = this.msClientService.userClient().send(
            { service: 'player', cmd: 'update' },
            { ...body, player_id }
        );
        return await lastValueFrom(player_updated$).catch(e => { throw new BadRequestException(e) });
    }

    @Post('register-binocular')
    async registerBinocular(@Body() body: RegisterBinocularDto, @Req() req: Request & { user }) {
        if (!req.user.Players.map((player) => player.id).includes(body.player_id))
            throw new BadRequestException('Player does not belong to this user');

        const res$ = this.msClientService.missionClient().send(
            { service: 'machine', cmd: 'register' },
            body
        );
        return await lastValueFrom(res$).catch(e => { throw new BadRequestException(e) });
    }

    private isPlayerBelongToThisUser(user, player_id: string) {
        if (!user.Players.map((player) => player.id).includes(player_id))
            throw new BadRequestException('Player does not belong to this user');
        return true;
    }
}
