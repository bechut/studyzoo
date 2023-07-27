import { MsClientModule } from '@ms-client';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';

@Module({
  imports: [MsClientModule],
  controllers: [AuthController]
})
export class AuthModule {}
