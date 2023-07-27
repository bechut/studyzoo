
import { Injectable } from '@nestjs/common';
import { JwtService as JS } from '@nestjs/jwt';

@Injectable()
export class JwtService {
    constructor(
        private jwtService: JS
    ) { }

    get() {
        return this.jwtService;
    }
}