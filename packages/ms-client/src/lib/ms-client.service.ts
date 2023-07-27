import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class MsClientService {
    constructor(
        @Inject('TEST_CLIENT')
        private readonly msTestClient: ClientProxy,
        @Inject('USER_CLIENT')
        private readonly msUserClient: ClientProxy,
    ) { }

    testClient() {
        return this.msTestClient;
    }

    userClient() {
        return this.msUserClient;
    }
}