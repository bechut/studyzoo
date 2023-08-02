import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class MsClientService {
    constructor(
        @Inject('TEST_CLIENT')
        private readonly msTestClient: ClientProxy,
        @Inject('USER_CLIENT')
        private readonly msUserClient: ClientProxy,
        @Inject('SESSION_CLIENT')
        private readonly msSessionClient: ClientProxy,
        @Inject('MISSION_CLIENT')
        private readonly msMissionClient: ClientProxy,
    ) { }

    testClient() {
        return this.msTestClient;
    }

    userClient() {
        return this.msUserClient;
    }

    sessionClient() {
        return this.msSessionClient;
    }

    missionClient() {
        return this.msMissionClient;
    }
}