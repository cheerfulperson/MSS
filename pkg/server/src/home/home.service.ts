import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { CryptoService } from 'shared/crypto/crypto.service';
import { PrismaService } from 'shared/prisma/prisma.service';

interface HomeCommonParams {
  id: string;
}

@Injectable()
export class HomeService {
  constructor(
    private encryptService: CryptoService,
    private prisma: PrismaService,
  ) {}

  async getHome({ id }: HomeCommonParams) {
    return await this.prisma.home.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        address: {
          select: {
            address1: true,
            address2: true,
            city: true,
            id: true,
            state: true,
            zip: true,
          },
        },
        secured: true,
        slug: true,
        securedAt: true,
      },
    });
  }

  async getHomeLink({ id }: HomeCommonParams) {
    const home = await this.prisma.home.findUnique({
      where: { id },
      select: { slug: true },
    });
    if (!home) {
      throw new BadRequestException();
    }
    if (!process.env.GUEST_PUBLIC_LOGIN_URL) {
      throw new Error('GUEST_PUBLIC_LOGIN_URL env is not set');
    }
    return `${process.env.GUEST_PUBLIC_LOGIN_URL}?token=${this.encryptService.encrypt(JSON.stringify(home))}`;
  }

  async checkHomeLink(token: string) {
    const home = JSON.parse(this.encryptService.decrypt(token));
    if (!home.slug) {
      throw new ForbiddenException();
    }
    const homeData = await this.prisma.home.findUnique({
      where: { slug: home.slug },
    });
    if (!homeData) {
      throw new BadRequestException();
    }
    return true;
  }

  async makeSecured({ id, secured }: { id: string; secured: boolean }) {
    return await this.prisma.home.update({
      where: { id },
      data: { secured: true, securedAt: new Date() },
      select: {
        id: true,
        secured,
      },
    });
  }
}
