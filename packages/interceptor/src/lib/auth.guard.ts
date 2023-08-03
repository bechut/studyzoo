import { MsClientService } from '@ms-client';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@jwt';
import { lastValueFrom } from 'rxjs';
import moment from 'moment'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly msClientService: MsClientService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const Public = this.reflector.get<string[]>('Public', context.getHandler());
    if (Public) {
      return true;
    }
    const request: any = context.switchToHttp().getRequest();
    const bearer = request.headers.authorization?.split(' ')[1];
    try {
      this.jwtService.get().verify(bearer);
    } catch (e) {
      throw new UnauthorizedException();
    }
    const decode: any = this.jwtService.get().decode(bearer);
    const otp$ = this.msClientService.sessionClient().send(
      { service: 'session', cmd: 'get-access-token-otp' },
      { id: decode.value }
    );
    const otp = await lastValueFrom(otp$).catch(e => { throw new UnauthorizedException(e.message) });
    const user$ = this.msClientService.userClient().send({ service: 'user', cmd: 'get-by-id' }, { id: otp.user_id });
    const user = await lastValueFrom(user$).catch(e => { throw new UnauthorizedException(e.message) });
    if (!decode.updatedAt || !moment(user.updatedAt).isSame(decode.updatedAt)) 
      throw new UnauthorizedException('Your account information has been changed. Please login again')

    request.user = user;
    return true;
  }
}