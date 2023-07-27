import { JwtModule } from '@jwt';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { MsClientModule } from '@ms-client';

@Module({
  imports: [MsClientModule, JwtModule],
  controllers: [AuthController]
})
export class AuthModule {}
