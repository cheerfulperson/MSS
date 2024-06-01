import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserUnionType } from '../../types/types';
import { jwtConstants } from '../constants';

export type JwtUserPayload = {
  /** User id */
  sub: string;
  role: UserUnionType;
  email?: string;
  fullName?: string;
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConstants.secret,
    });
  }

  validate(payload: JwtUserPayload) {
    return payload;
  }
}
