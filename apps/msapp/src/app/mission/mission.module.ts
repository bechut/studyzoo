import { Module } from '@nestjs/common';
import { MissionController } from './mission.controller';
import { MsClientModule } from '@ms-client';

@Module({
  imports: [MsClientModule],
  controllers: [MissionController]
})
export class MissionModule {}
