import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { HomeService } from './home.service';
import { Public } from 'decorators/public.decorator';
import { CheckLinkDto, GetHomeDto } from './dto/home.dto';

@Controller('home')
export class HomeController {
  constructor(private home: HomeService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getHome(@Param('id') id: string) {
    const home = await this.home.getHome({ id });
    return home;
  }

  @Post('link')
  @HttpCode(HttpStatus.OK)
  async getHomeLink(@Body() data: GetHomeDto) {
    const home = await this.home.getHomeLink({ id: data.homeId });
    return home;
  }

  @Public()
  @Post('link/check')
  @HttpCode(HttpStatus.OK)
  async checkHomeLink(@Body() data: CheckLinkDto) {
    const isSuccess = await this.home.checkHomeLink(data.token);
    return {
      valid: isSuccess,
    };
  }
}