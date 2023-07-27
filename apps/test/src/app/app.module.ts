import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { MsClientModule } from '@ms-client';

@Module({
  imports: [MsClientModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
