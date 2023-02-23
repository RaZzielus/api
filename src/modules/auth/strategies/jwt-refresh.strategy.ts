import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from '../../../common/constants';
import { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const token = request?.cookies['refreshToken'];
          if (!token) {
            return null;
          }

          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret_refresh,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const refreshToken = req?.cookies['refreshToken'].trim();

    return {
      ...payload,
      refreshToken,
    };
  }
}
