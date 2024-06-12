import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserUnionRoles } from '../../types/types';
import { AuthEnvs } from '../constants';

export type JwtUserPayload = {
  /** User id */
  sub: string;
  role: UserUnionRoles;
  email?: string;
  fullName?: string;
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: AuthEnvs.secret,
    });
  }

  validate(payload: JwtUserPayload) {
    return payload;
  }
}
