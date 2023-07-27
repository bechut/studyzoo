import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { MsClientModule } from '@ms-client';
import { ExceptionInterceptor, ResponseInterceptor } from '@interceptor';

@Module({
  imports: [MsClientModule],
  controllers: [AppController],
  providers: [
    AppService, 
    { 
      provide: APP_INTERCEPTOR, 
      useClass: ExceptionInterceptor 
    },
    { 
      provide: APP_INTERCEPTOR, 
      useClass: ResponseInterceptor 
    }
  ],
})
export class AppModule { }
