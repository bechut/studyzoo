import { JwtModule } from '@jwt';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { MsClientModule } from '@ms-client';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), MsClientModule, JwtModule],
  controllers: [AuthController]
})
export class AuthModule { }
