import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class RfTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.RF_SECRET_JWT,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: any) {
    const refToken = req.get('authorization').replace('Bearer', '').trim();
    return { refToken, ...payload };
  }
}
