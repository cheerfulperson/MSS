import { JwtUserPayload } from '../auth/strategies/accessToken.strategy';

export enum UserRoles {
  GUEST = 'guest',
  OWNER = 'user',
}

export type UserUnionRoles = `${UserRoles}`;

declare global {
  type AuthRequest = Request & {
    user: JwtUserPayload;
  };

  type RefreshAuthRequest = Request & {
    user: {
      sub: string;
      refreshToken: string;
    };
  };
}
