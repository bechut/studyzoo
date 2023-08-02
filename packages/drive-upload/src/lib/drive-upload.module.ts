import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { DriveUploadService } from './drive-upload.service';

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [DriveUploadService],
  exports: [DriveUploadService],
})
export class DriveUploadModule {}
