import { Module } from '@nestjs/common';

import { SharedModule } from 'shared/shared.module';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';

@Module({
  imports: [SharedModule],
  providers: [HomeService],
  controllers: [HomeController],
})
export class HomeModule {}
