import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { MsClientModule } from '@ms-client';

@Module({
  imports: [MsClientModule],
  controllers: [AuthController]
})
export class AuthModule {}
