import { Controller, Get, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { Auth } from '@/shared/decorators/auth.decorator';

@Controller('/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/me')
  @Auth()
  async getMe(@Req() req: any) {
    const user = req.user as UserDto;

    return user;
  }
}
