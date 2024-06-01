import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { jwtConstants } from './constants';
import { PrismaService } from 'shared/prisma/prisma.service';
import { JwtUserPayload } from './strategies/accessToken.strategy';

type User = {
  email?: string;
  fullName?: string;
  id: string;
  name?: string;
  refreshToken: string;
};

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async signUp() {
    return '';
  }

  async signIn() {
    // Check if user exists
    // const user = await this.usersService.findByUsername(data.username);
    // if (!user) throw new BadRequestException('User does not exist');
    // const passwordMatches = await argon2.verify(user.password, data.password);
    // if (!passwordMatches)
    //   throw new BadRequestException('Password is incorrect');
    // const tokens = await this.getTokens(user._id, user.username);
    // await this.updateRefreshToken(user._id, tokens.refreshToken);
    // return tokens;
  }

  async logout(userId: string) {
    // return this.usersService.update(userId, { refreshToken: null });
  }

  hashData(data: string) {
    return bcrypt.hash(data, jwtConstants.secret);
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: hashedRefreshToken,
      },
      select: {
        id: true,
      },
    });
  }

  async refreshTokens(userId: string, refreshToken: string) {
    let user: User | undefined = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        refreshToken: true,
      },
    });

    if (!user) {
      user = await this.prisma.guest.findFirst({
        where: {
          id: userId,
        },
        select: {
          id: true,
          name: true,
          refreshToken: true,
        },
      });
    }

    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }
    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access Denied');
    }
    const tokens = await this.getTokens({
      sub: user.id,
      role: user.email ? 'USER' : 'GUEST',
      email: user.email,
      fullName: user.fullName || user.name,
    });
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async getTokens(data: JwtUserPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(data, {
        secret: jwtConstants.secret,
        expiresIn: jwtConstants.jwtExpiration,
      }),
      this.jwtService.signAsync(data, {
        secret: jwtConstants.secret,
        expiresIn: jwtConstants.jwtRefreshExpiration,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
