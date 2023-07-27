import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ExceptionInterceptor, ResponseInterceptor } from '@interceptor';

@Module({
  imports: [AuthModule, UserModule],
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
export class AppModule {}
