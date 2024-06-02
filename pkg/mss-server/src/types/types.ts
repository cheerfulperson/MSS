import { JwtUserPayload } from '../auth/strategies/accessToken.strategy';

export enum UserType {
  GUEST = 'GUEST',
  USER = 'USER',
}

export type UserUnionType = `${UserType}`;

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
