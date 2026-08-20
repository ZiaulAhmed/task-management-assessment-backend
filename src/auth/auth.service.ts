import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { GuestLoginDto } from './dto/guest-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async guestLogin(dto: GuestLoginDto) {
    const email =
      dto.email?.toLowerCase() ??
      `guest-${Date.now()}@taskmanager.local`;

    const name = dto.name?.trim() || 'Guest User';

    let user = await this.usersService.findByEmail(email);

    if (!user) {
      user = await this.usersService.create({
        email,
        name,
        password: 'guest',
        isGuest: true,
      });
    }

    const token = this.jwtService.sign({
      sub: user._id.toString(),
      email: user.email,
      isGuest: user.isGuest,
    });

    return {
      accessToken: token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        isGuest: user.isGuest,
      },
    };
  }
}