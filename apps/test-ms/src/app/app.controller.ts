import { Controller } from '@nestjs/common';

import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import prisma from '../../prisma/client'
// import { RpcException } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @MessagePattern({ cmd: 'test' })
  async getData(data: any) {
    const test = await prisma.test.findMany();
    return 'test-ms data' + JSON.stringify(data);
  }
}
