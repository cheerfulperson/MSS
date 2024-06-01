if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not set in .env file');
}

export const jwtConstants = {
  secret: process.env.JWT_SECRET,
  jwtExpiration: process.env.JWT_EXPIRATION || '5m',
  jwtRefreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
};
