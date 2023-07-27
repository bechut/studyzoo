import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule as JM } from '@nestjs/jwt';
import { JwtService } from './jwt.service'

@Module({
  imports: [JM.registerAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => ({
      secret: configService.get<string>('JWT_SECRET') || '123123123',
      signOptions: { expiresIn: '1d' }
    }),
    inject: [ConfigService]
  })],
  controllers: [],
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule { }
