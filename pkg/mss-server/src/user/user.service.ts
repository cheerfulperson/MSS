import { Injectable } from '@nestjs/common';

import { PrismaService } from '../shared/prisma/prisma.service';
import { UserRoles } from 'types/types';

interface GetUserInput {
  id?: string;
  email?: string;
}

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUser({ email, id }: GetUserInput) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
        email,
      },
    });
    return {
      ...user,
      role: UserRoles.OWNER,
    };
  }
  async getGuest({ id }: GetUserInput) {
    const user = await this.prisma.guest.findUnique({
      where: {
        id,
      },
    });
    return {
      ...user,
      role: UserRoles.GUEST,
    };
  }
}
