import { Injectable } from '@nestjs/common';

import { PrismaService } from 'shared/prisma/prisma.service';

interface GetFloorInput {
  homeId?: string;
}

interface GetFloorItemsInput {
  floorId?: string;
}

@Injectable()
export class FloorService {
  constructor(private readonly prisma: PrismaService) {}

  async getFloors({ homeId }: GetFloorInput) {
    return this.prisma.floor.findMany({
      where: {
        homeId,
      },
      select: {
        id: true,
        name: true,
      },
    });
  }
  async getFloorItems({ floorId }: GetFloorItemsInput) {
    const floorItems = await this.prisma.floorPlaneItem.findMany({
      where: {
        floorId: floorId,
      },
      select: {
        id: true,
        type: true,
        x: true,
        y: true,
        width: true,
        height: true,
        angle: true,
        Device: {
          select: {
            id: true,
            name: true,
            icon: true,
            clientId: true,
            deviceType: true,
            deviceKind: true,
            connected: true,
            Buttery: {
              select: {
                capacity: true,
              },
            },
            DeviceValues: {
              take: 1,
              orderBy: {
                createdAt: 'desc',
              },
              where: {
                DeviceValueSetup: {
                  isPrimary: true,
                },
              },
              select: {
                id: true,
                treatLevel: true,
                value: true,
                DeviceValueSetup: {
                  select: {
                    id: true,
                    key: true,
                    displayName: true,
                    measure: true,
                    valueType: true,
                    falseInfo: true,
                    trueInfo: true,
                    falseInfoColor: true,
                    trueInfoColor: true,
                  },
                },
              },
            },
            TreatLevelSetup: {
              select: {
                id: true,
                level: true,
                color: true,
                icon: true,
              },
            },
          },
        },
        Image: {
          select: {
            url: true,
          },
        },
      },
    });

    return {
      floorItems,
    };
  }
}
