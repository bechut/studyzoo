import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { RPCExceptionFilter } from '@interceptor';
import { MissionModule } from './mission/mission.module';
import { MachineModule } from './machine/machine.module';

@Module({
  imports: [MissionModule, MachineModule],
  controllers: [AppController],
  providers: [AppService, { provide: APP_FILTER, useClass: RPCExceptionFilter }],
})
export class AppModule {}
