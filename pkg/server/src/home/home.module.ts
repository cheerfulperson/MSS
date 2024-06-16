import { Module } from '@nestjs/common';

import { SharedModule } from 'shared/shared.module';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { FloorModule } from './floor/floor.module';
import { DeviceModule } from './device/device.module';

@Module({
  imports: [DeviceModule, SharedModule, FloorModule],
  providers: [HomeService],
  controllers: [HomeController],
  exports: [],
})
export class HomeModule {}
