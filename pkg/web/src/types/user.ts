export enum UserRoles {
  GUEST = 'guest',
  OWNER = 'user',
}

export type UserUnionRoles = `${UserRoles}`;
