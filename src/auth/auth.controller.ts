import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { GuestLoginDto } from './dto/guest-login.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('guest')
  @ApiOperation({
    summary: 'Login as guest',
  })
  async guestLogin(@Body() dto: GuestLoginDto) {
    return this.authService.guestLogin(dto);
  }
}