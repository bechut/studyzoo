import { MsClientModule } from '@ms-client';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { MailerModule } from '@mailer';

@Module({
  imports: [MsClientModule, MailerModule],
  controllers: [AuthController]
})
export class AuthModule {}
