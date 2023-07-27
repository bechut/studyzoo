import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MsClientService } from './ms-client.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'TEST_CLIENT',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => {
          return {
            transport: Transport.TCP,
            options: {
              host: configService.get<string>('TEST_MS_HOST'),
              port: configService.get<number>('TEST_MS_PORT'),
            },
          };
        },
        inject: [ConfigService],
      },
      {
        name: 'USER_CLIENT',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => {
          return {
            transport: Transport.TCP,
            options: {
              host: configService.get<string>('USER_MS_HOST'),
              port: configService.get<number>('USER_MS_PORT'),
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [],
  providers: [MsClientService],
  exports: [MsClientService],
})
export class MsClientModule {}