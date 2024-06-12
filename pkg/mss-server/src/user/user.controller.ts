import { Controller, Get, Req } from '@nestjs/common';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  getUserProfile(@Req() req: AuthRequest) {
    if (req.user.role === 'guest') {
      return this.userService.getGuest({ id: req.user.sub });
    }
    return this.userService.getUser({ id: req.user.sub });
  }
}
