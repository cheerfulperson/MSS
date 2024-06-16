import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { DeviceService } from './device.service';
import { UpdateDeviceValueDto } from './dto/device.dto';

@Controller('home/device')
export class DeviceController {
  constructor(private readonly floorService: DeviceService) {}

  @Post('update')
  @HttpCode(HttpStatus.OK)
  async updateDeviceValue(@Body() body: UpdateDeviceValueDto) {
    const data = await this.floorService.updateDeviceValue({
      deviceId: body.deviceId,
      valueId: body.deviceValueId,
      value: body.value.toString(),
    });
    return data;
  }
}
