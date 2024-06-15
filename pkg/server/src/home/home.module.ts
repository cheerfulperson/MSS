import { Module } from '@nestjs/common';

import { SharedModule } from 'shared/shared.module';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { FloorModule } from './floor/floor.module';

@Module({
  imports: [SharedModule, FloorModule],
  providers: [HomeService],
  controllers: [HomeController],
  exports: [],
})
export class HomeModule {}
