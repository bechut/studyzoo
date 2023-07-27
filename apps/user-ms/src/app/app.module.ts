import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';

import { RPCExceptionFilter } from '@interceptor';


@Module({
  imports: [UserModule],
  controllers: [AppController],
  providers: [AppService, { provide: APP_FILTER, useClass: RPCExceptionFilter }],
})
export class AppModule {}
