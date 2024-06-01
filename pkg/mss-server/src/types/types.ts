import { JwtUserPayload } from "../auth/strategies/accessToken.strategy";

export enum UserType {
  GUEST = 'GUEST',
  USER = 'USER',
}

export type UserUnionType = `${UserType}`;

declare global {
  type AuthRequest = Request & {
    user: JwtUserPayload
  };
}
