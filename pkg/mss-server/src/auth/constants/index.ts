if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not set in .env file');
}

if (!process.env.HASH_SECRET) {
  throw new Error('HASH_SECRET env not defined or invalid');
}

export const authConstants = {
  hashSecret: process.env.HASH_SECRET,
  secret: process.env.JWT_SECRET,
  jwtExpiration: process.env.JWT_EXPIRATION || '5m',
  jwtRefreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
};
