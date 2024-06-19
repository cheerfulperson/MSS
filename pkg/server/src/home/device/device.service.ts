import { Injectable } from '@nestjs/common';

import { PrismaService } from 'shared/prisma/prisma.service';
import { mqttBroker } from '../../adapters/mqtt-broker.adapter';

interface GetDeviceInput {
  deviceId: string;
  valueId: string;
  value: string;
}

@Injectable()
export class DeviceService {
  constructor(private readonly prisma: PrismaService) {}

  async updateDeviceValue({ valueId, value }: GetDeviceInput) {
    const updatedValue = await this.prisma.deviceValue.update({
      where: {
        id: valueId,
      },
      data: {
        value,
      },
      select: {
        value: true,
        treatLevel: true,
        DeviceValueSetup: {
          select: {
            key: true,
          },
        },
        Device: {
          select: {
            id: true,
          },
        },
      },
    });

    await mqttBroker.sendMessage({
      topic: 'clientDevicesData',
      payload: updatedValue,
    });

    return { updatedValue };
  }
}
