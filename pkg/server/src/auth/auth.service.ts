import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';

import { AuthEnvs } from './constants';
import { PrismaService } from 'shared/prisma/prisma.service';
import { JwtUserPayload } from './strategies/accessToken.strategy';
import { UserRoles, UserUnionRoles } from '../types';
import { CryptoService } from 'shared/crypto/crypto.service';

type User = {
  email?: string;
  fullName?: string;
  id: string;
  name?: string;
};

type RefreshData = {
  ipv4: string;
  userAgent: string;
};

type GuestSignUpInput = RefreshData & {
  name: string;
  homeSlug?: string;
  password?: string;
  token?: string;
};

type UserSignUpInput = {
  name: string;
  email: string;
  password: string;
} & RefreshData;

type UserSignInInput = {
  email: string;
  password: string;
} & RefreshData;

type UpdateRefreshToken = {
  userId: string;
  refreshToken?: string | null;
  role: UserUnionRoles;
} & ({ oldRefreshToken: string } | RefreshData);

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private cryptoService: CryptoService,
    private prisma: PrismaService,
  ) {}

  async signUpGuest({
    ipv4,
    name,
    userAgent,
    homeSlug,
    token,
  }: GuestSignUpInput) {
    if (!homeSlug && !token) {
      throw new BadRequestException('Invalid token or home slug');
    }
    let slug = homeSlug;

    if (!slug) {
      try {
        slug = JSON.parse(this.cryptoService.decrypt(token)).homeSlug;
      } catch (error) {
        throw new BadRequestException('Invalid token');
      }
    }
    const home = await this.prisma.home.findFirst({
      where: {
        slug: homeSlug,
      },
      select: {
        id: true,
      },
    });

    if (!home) {
      throw new BadRequestException('Home does not exist');
    }

    let guest = await this.prisma.guest.findFirst({
      where: {
        RefreshToken: {
          ipv4,
          userAgent,
        },
      },
      select: {
        id: true,
        fullName: true,
      },
    });

    if (!guest) {
      guest = await this.prisma.guest.create({
        data: {
          fullName: name,
          Homes: {
            connect: {
              id: home.id,
            },
          },
        },
        select: {
          id: true,
          fullName: true,
        },
      });
    } else {
      guest = await this.prisma.guest.update({
        where: {
          id: guest.id,
        },
        data: {
          Homes: {
            connect: {
              id: home.id,
            },
          },
        },
        select: {
          id: true,
          fullName: true,
        },
      });
    }

    const tokens = await this.getTokens({
      sub: guest.id,
      role: UserRoles.GUEST,
      email: null,
      fullName: guest.fullName,
    });
    await this.updateRefreshToken({
      refreshToken: tokens.refreshToken,
      role: UserRoles.GUEST,
      userId: guest.id,
      ipv4,
      userAgent,
    });
    return {
      ...tokens,
      role: UserRoles.GUEST,
    };
  }

  async signUpUser({
    email,
    name,
    password,
    ipv4,
    userAgent,
  }: UserSignUpInput) {
    const hashedPassword = this.hashData(password);

    const userExists = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (userExists) throw new BadRequestException('User already exists');

    const user = await this.prisma.user.create({
      data: {
        email,
        fullName: name,
        password: hashedPassword,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
      },
    });
    const tokens = await this.getTokens({
      sub: user.id,
      role: UserRoles.OWNER,
      email: user.email,
      fullName: user.fullName,
    });
    await this.updateRefreshToken({
      refreshToken: tokens.refreshToken,
      role: UserRoles.OWNER,
      userId: user.id,
      ipv4,
      userAgent,
    });
    return {
      ...tokens,
      role: UserRoles.OWNER,
    };
  }

  async signIn({ email, password, ipv4, userAgent }: UserSignInInput) {
    const user = await this.prisma.user.findFirst({
      where: { email },
      select: { password: true, id: true, fullName: true },
    });
    if (!user) throw new BadRequestException('User does not exist');
    const passwordMatches = this.compareHash(password, user.password);
    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect');
    const tokens = await this.getTokens({
      role: UserRoles.OWNER,
      email,
      fullName: user.fullName,
      sub: user.id,
    });
    await this.updateRefreshToken({
      ipv4,
      refreshToken: tokens.refreshToken,
      role: UserRoles.OWNER,
      userAgent,
      userId: user.id,
    });
    return {
      ...tokens,
      role: UserRoles.OWNER,
    };
  }

  async logout(data: {
    userId: string;
    role: UserUnionRoles;
    ipv4: string;
    userAgent: string;
  }) {
    if (data.role === UserRoles.GUEST) {
      const guest = await this.prisma.guest.findFirst({
        where: { id: data.userId },
      });
      if (!guest) {
        throw new ForbiddenException('User does not exist');
      }
      return await this.prisma.guest.delete({
        where: {
          id: data.userId,
        },
      });
    }
    await this.updateRefreshToken({ ...data, refreshToken: null });
  }

  compareHash(data: string, hash: string) {
    return this.hashData(data) === hash;
  }

  hashData(data: string) {
    return crypto
      .createHmac('md5', AuthEnvs.hashSecret)
      .update(data)
      .digest('hex');
  }

  hashRefreshToken(data: string) {
    return data.split('.')[2];
  }

  async updateRefreshToken({
    refreshToken,
    role,
    userId,
    ...otherData
  }: UpdateRefreshToken) {
    const tokenUnique =
      'oldRefreshToken' in otherData
        ? {
            token: this.hashRefreshToken(otherData.oldRefreshToken),
          }
        : {
            ipv4_userAgent: {
              ipv4: otherData.ipv4,
              userAgent: otherData.userAgent,
            },
          };

    if (!refreshToken) {
      return await this.prisma.refreshToken.delete({
        where: tokenUnique,
        select: {
          userId: true,
        },
      });
    }
    const hashedRefreshToken = this.hashRefreshToken(refreshToken);

    if (role === UserRoles.GUEST && !('oldRefreshToken' in otherData)) {
      await this.prisma.guest.update({
        where: {
          id: userId,
        },
        data: {
          RefreshToken: {
            upsert: {
              create: {
                token: hashedRefreshToken,
                ipv4: otherData.ipv4,
                userAgent: otherData.userAgent,
              },
              update: {
                token: hashedRefreshToken,
              },
            },
          },
        },
        select: {
          id: true,
        },
      });
    }
    if (role === UserRoles.OWNER) {
      await this.prisma.refreshToken.upsert({
        where: tokenUnique,
        update: {
          token: hashedRefreshToken,
        },
        create: {
          token: hashedRefreshToken,
          ...tokenUnique.ipv4_userAgent,
          User: {
            connect: {
              id: userId,
            },
          },
        },
        select: {
          userId: true,
        },
      });
    }
  }

  async refreshTokens(
    userId: string,
    refreshToken: string,
    { ipv4, userAgent }: RefreshData,
  ) {
    let user: User | undefined = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
      },
    });

    if (!user) {
      user = await this.prisma.guest.findFirst({
        where: {
          id: userId,
        },
        select: {
          id: true,
          fullName: true,
        },
      });
    }

    if (!user) {
      throw new ForbiddenException('User does not exist');
    }

    const token = this.hashRefreshToken(refreshToken);

    const oldRefreshData = await this.prisma.refreshToken.findFirst({
      where: {
        token,
      },
      select: {
        token: true,
      },
    });

    if (!oldRefreshData) {
      throw new ForbiddenException('Token does not exist');
    }

    const role = user.email ? UserRoles.OWNER : UserRoles.GUEST;
    const tokens = await this.getTokens({
      sub: user.id,
      role,
      email: user.email,
      fullName: user.fullName || user.name,
    });
    await this.updateRefreshToken({
      refreshToken: tokens.refreshToken,
      role,
      userId: user.id,
      oldRefreshToken: refreshToken,
      ipv4,
      userAgent,
    });
    return tokens;
  }

  async getTokens(data: JwtUserPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(data, {
        secret: AuthEnvs.secret,
        expiresIn: AuthEnvs.jwtExpiration,
      }),
      this.jwtService.signAsync(data, {
        secret: AuthEnvs.secret,
        expiresIn: AuthEnvs.jwtRefreshExpiration,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
