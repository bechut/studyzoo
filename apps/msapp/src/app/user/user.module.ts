import { MsClientModule } from '@ms-client';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';

@Module({
  imports: [MsClientModule],
  controllers: [UserController]
})
export class UserModule {}
