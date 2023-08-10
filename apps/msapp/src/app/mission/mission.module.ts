import { Module } from '@nestjs/common';
import { MissionController } from './mission.controller';
import { MsClientModule } from '@ms-client';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express'
import { DriveUploadModule } from '@drive-upload';

@Module({
  imports: [
    ConfigModule,
    MulterModule.register({
      dest: './upload',
    }),
    DriveUploadModule, 
    MsClientModule
  ],
  controllers: [MissionController]
})
export class MissionModule { }