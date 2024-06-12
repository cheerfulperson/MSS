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
    return await this.prisma.home.findUnique({ where: { id } });
  }

  async getHomeLink({ id }: HomeCommonParams) {
    const home = await this.prisma.home.findUnique({
      where: { id },
      select: { slug: true },
    });
    if (!home) {
      throw new BadRequestException();
    }
    return this.encryptService.encrypt(JSON.stringify(home));
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
}
