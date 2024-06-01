import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { SharedModule } from '../shared/shared.module';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { AuthController } from './auth.controller';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';

@Module({
  imports: [
    SharedModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.jwtExpiration },
    }),
  ],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
