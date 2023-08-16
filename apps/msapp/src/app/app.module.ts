import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AuthGuard, ExceptionInterceptor, ResponseInterceptor } from '@interceptor';
import { JwtModule } from '@jwt';
import { MsClientModule } from '@ms-client';
import { MissionModule } from './mission/mission.module';
import { IntroModule } from './intro/intro.module';
import { ConfigModule } from '@nestjs/config';
import { SseModule } from '@sse';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    JwtModule,
    MsClientModule,
    MissionModule,
    IntroModule,
    SseModule
  ],
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
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    }
  ],
})
export class AppModule { }
