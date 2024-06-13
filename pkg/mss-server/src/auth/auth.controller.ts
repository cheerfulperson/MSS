import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Ip,
  Req,
  UseGuards,
} from '@nestjs/common';

import { Public } from 'decorators/public.decorator';
import { AuthService } from './auth.service';
import { LoginDto, SignUpGuestDto, SignUpUserDto } from './dto/auth.dto';
import { RefreshTokenGuard } from './guards/refreshToken.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() data: LoginDto, @Ip() ipv4: string, @Req() req: Request) {
    return this.authService.signIn({
      ...data,
      ipv4,
      userAgent: req.headers['user-agent'],
    });
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signup')
  signUp(@Body() data: SignUpUserDto, @Ip() ipv4: string, @Req() req: Request) {
    return this.authService.signUpUser({
      ...data,
      ipv4,
      userAgent: req.headers['user-agent'],
    });
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  refresh(
    @Req() req: RefreshAuthRequest,
    @Body() body: { refreshToken?: string },
    @Ip() ipv4: string,
  ) {
    return this.authService.refreshTokens(
      req.user.sub,
      body.refreshToken || req.headers.get('Authorization').split(' ')[1],
      {
        ipv4,
        userAgent: req.headers['user-agent'],
      },
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Ip() ipv4: string, @Req() req: AuthRequest) {
    return this.authService.logout({
      ipv4,
      role: req.user.role,
      userId: req.user.sub,
      userAgent: req.headers['user-agent'],
    });
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('guest/signup')
  signUpGuest(
    @Body() data: SignUpGuestDto,
    @Ip() ipv4: string,
    @Req() req: Request,
  ) {
    return this.authService.signUpGuest({
      ...data,
      ipv4,
      userAgent: req.headers['user-agent'],
    });
  }
}
