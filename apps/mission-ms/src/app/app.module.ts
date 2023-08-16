import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { RPCExceptionFilter, PreRPCExceptionInterceptor } from '@interceptor';
import { MissionModule } from './mission/mission.module';
import { MachineModule } from './machine/machine.module';

@Module({
  imports: [MissionModule, MachineModule],
  controllers: [AppController],
  providers: [
    AppService, 
    { provide: APP_INTERCEPTOR, useClass: PreRPCExceptionInterceptor }, 
    { provide: APP_FILTER, useClass: RPCExceptionFilter }
  ],
})
export class AppModule { }
