import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import CreateUserDto from './dto/create-user.dto';
import { AuthService } from './auth.service';
import { ResponseMessage } from 'src/shared/decorators/response-message.decorator';
import { Auth } from '@/shared/decorators/auth.decorator';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('User created successfully')
  async register(@Body() dto: CreateUserDto) {
    return this.authService.registerUser(dto);
  }

  @Post('google')
  @HttpCode(HttpStatus.OK)
  async googleLogin(@Body() body: { token: string }) {
    const { token } = body;
    const user =
      await this.authService.validateGoogleLoginViaAccessToken(token);
    return user;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Auth()
  async login(@Req() req) {
    return this.authService.generateTokenPair({
      sub: req.user.id,
    });
  }

  @Get('/activate-account')
  async activateAccount(@Query() query: Record<string, any>) {
    const { token } = query;
    return this.authService.verifyActivateToken(token);
  }

  @Get('/reset-password')
  async sendResetPasswordEmail(@Query() query: Record<string, any>) {
    const { email } = query;
    if (!email) {
      throw new BadRequestException('email is required');
    }

    this.authService.sendResetPasswordEmail(email);

    return {
      isSuccess: true,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('/reset-password')
  async resetPassword(@Body() resetPasswordDto: Record<string, any>) {
    const { token, password } = resetPasswordDto;

    if (!token || !password) {
      throw new BadRequestException('token or password is required');
    }

    this.authService.resetPassword({ token, password });
    return {
      success: true,
    };
  }
}
