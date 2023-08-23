import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { MissionModule } from './mission/mission.module';
import { MachineModule } from './machine/machine.module';

@Module({
  imports: [MissionModule, MachineModule],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule { }
