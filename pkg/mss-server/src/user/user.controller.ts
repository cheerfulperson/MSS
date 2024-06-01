import { Body, Controller, Get, Req } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly customerService: UserService) {}

  @Get('hello')
  getHello(@Req() req: AuthRequest): string {
    return 'Hello World!';
  }
}
