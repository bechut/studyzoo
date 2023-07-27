import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';

import { MsClientService } from '@ms-client';
import { lastValueFrom } from 'rxjs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly msClientService: MsClientService) { }

  @Get()
  async getData() {
    const test$ = this.msClientService.testClient().send({ cmd: 'test' }, { a: 1 });
    return await lastValueFrom(test$);
  }
}
