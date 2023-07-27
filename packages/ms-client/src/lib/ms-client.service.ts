import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class MsClientService {
    constructor(
        @Inject('TEST_CLIENT')
        private readonly msTestClient: ClientProxy,
    ) { }

    testClient() {
        return this.msTestClient; 
    }
}