import { DriveUploadModule } from '@drive-upload';
import { Module } from '@nestjs/common';
import { IntroController } from './intro.controller';
import { MulterModule } from '@nestjs/platform-express'
import { ConfigModule } from '@nestjs/config';
import { MsClientModule } from '@ms-client';

@Module({
  imports: [
    ConfigModule,
    MulterModule.register({
      dest: './upload',
    }),
  DriveUploadModule,
  MsClientModule
  ],
  controllers: [IntroController]
})
export class IntroModule { }
