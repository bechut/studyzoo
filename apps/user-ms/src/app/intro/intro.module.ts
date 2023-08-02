import { Module } from '@nestjs/common';
import { IntroController } from './intro.controller';

@Module({
  controllers: [IntroController]
})
export class IntroModule {}
