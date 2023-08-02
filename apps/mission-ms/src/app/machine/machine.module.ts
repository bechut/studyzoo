import { Module } from '@nestjs/common';
import { MachineController } from './machine.controller';

@Module({
  controllers: [MachineController]
})
export class MachineModule {}
