import { MailerModule } from '@mailer';
import { MsClientModule } from '@ms-client';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';

@Module({
  imports: [MsClientModule, MailerModule],
  controllers: [UserController]
})
export class UserModule {}
