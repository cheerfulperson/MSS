import { Module } from '@nestjs/common';

import { SharedModule } from 'shared/shared.module';
import { FloorController } from './floor.controller';
import { FloorService } from './floor.service';

@Module({
  imports: [SharedModule],
  controllers: [FloorController],
  providers: [FloorService],
})
export class FloorModule {}
