/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.MISSION_MS_HOST,
        port: Number(process.env.MISSION_MS_PORT)
      }
    },
  );
  await app.listen();
  Logger.log(
    `🚀 Micro service is running on ${process.env.MISSION_MS_PORT}`
  );
}

bootstrap();
