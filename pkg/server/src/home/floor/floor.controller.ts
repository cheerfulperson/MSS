import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';

import { FloorService } from './floor.service';

@Controller('home/:homeId/floor')
export class FloorController {
  constructor(private readonly floorService: FloorService) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  async getFloors(@Param('homeId') homeId: string) {
    const floors = await this.floorService.getFloors({ homeId });
    return {
      floors,
    };
  }

  // @Get(':id')
  // getFloor(@Param(':id') id: string, @Param(':homeId') homeId: string) {
  //   console.log('id', id, homeId);
  //   // return this.floorService.getFloors({ id });
  // }

  @Get(':id/items')
  @HttpCode(HttpStatus.OK)
  async getFloorItems(@Param(':id') id: string) {
    const res = await this.floorService.getFloorItems({ floorId: id });
    return res;
  }
}
