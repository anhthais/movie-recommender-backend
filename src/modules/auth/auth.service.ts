import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import CreateUserDto from './dto/create-user.dto';
import { UserDto } from 'src/modules/user/dto/user.dto';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import LoginDto from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { MailSubjects } from '@/shared/constants/mail.constant';
import { TokenTypes } from '@/shared/constants/token-type.constant';
import {
  getActivationAccountEmailTemplate,
  getResetPasswordTemplate,
} from '@/shared/helpers/email-template';
import { InjectRepository } from '@nestjs/typeorm';
import User from '../user/entities/user.entity';
import { ILike, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

const GOOGLE_API_URL = 'https://www.googleapis.com/oauth2/v1/userinfo';
const SALTED_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    @Inject('GOOGLE_OAUTH2_CLIENT') private oAuth2Client: OAuth2Client,
    private jwtService: JwtService,
    private readonly mailerService: MailerService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async registerUser(dto: CreateUserDto) {
    const data = {
      ...dto,
      activated: false,
    };

    const user = await this.userService.save(data);

    this.sendActivateEmail(user);
    return this.generateTokenPair({ sub: user.id });
  }

  async validateGoogleLogin(token: string) {
    const ticket = await this.oAuth2Client.verifyIdToken({
      idToken: token,
      audience: process.env.OAUTH2_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    return payload;
  }

  async validateGoogleLoginViaAccessToken(token: string) {
    try {
      const response = await axios.get(GOOGLE_API_URL, {
        params: {
          access_token: token,
        },
      });

      const userData = response.data;

      const user = {
        username: userData.email,
        fullname: userData.name,
        email: userData.email,
        picture: userData.picture,
        password: uuidv4(),
        activated: true,
      };

      const savedUser = await this.userService.getUserByEmail(user.email);

      if (!savedUser) {
        return this.userService.save(user);
      }

      return this.generateTokenPair({ sub: savedUser.id });
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Invalid access token');
    }
  }

  async login(dto: LoginDto) {
    const user = await this.userService.getUserByEmail(dto.email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const passwordsMatched = await bcrypt.compare(dto.password, user.password);

    if (!passwordsMatched) {
      throw new UnauthorizedException('Credentials are not valid');
    }

    const { password, ...result } = user;

    return result;
  }

  async verifyActivateToken(token: string) {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET,
    });

    const { sub, type } = payload;

    const user = await this.userRepository.findOne({
      where: {
        id: sub,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.activated) {
      throw new BadRequestException('User is unverified');
    }

    if (type !== TokenTypes.ACCOUNT_ACTIVATION) {
      throw new BadRequestException('Invalid token');
    }

    user.activated = true;
    const savedData = this.userRepository.save(user);

    return savedData;
  }

  async generateTokenPair(payload : { sub: number | string }) {
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string, userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
  }

  async sendResetPasswordEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email: ILike(email),
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = this.jwtService.sign(
      {
        sub: user.id,
        type: TokenTypes.RESET_PASSWORD,
      },
      {
        expiresIn: '10m',
      },
    );

    this.mailerService.sendMail({
      to: user.email,
      subject: MailSubjects.ACTIVATE_ACCOUNT,
      html: getResetPasswordTemplate({
        username: user.fullname,
        resetLink: `${process.env.HOMEPAGE_URL}/reset-password?token=${token}`,
      }),
    });

    return true;
  }

  private async sendActivateEmail(user: UserDto) {
    const verifyAccountToken = this.jwtService.sign(
      {
        sub: user.id,
        type: TokenTypes.ACCOUNT_ACTIVATION,
      },
      {
        expiresIn: '10m',
      },
    );

    this.mailerService.sendMail({
      to: user.email,
      subject: MailSubjects.ACTIVATE_ACCOUNT,
      html: getActivationAccountEmailTemplate({
        username: user.fullname,
        activateLink: `${process.env.HOMEPAGE_URL}/activate-account?token=${verifyAccountToken}`,
      }),
    });
  }

  async resetPassword(resetPasswordDto: { token: string; password: string }) {
    const { token, password } = resetPasswordDto;
    const payload = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });
    const { sub, type } = payload;

    const user = await this.userRepository.findOne({
      where: {
        id: sub,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (type !== TokenTypes.RESET_PASSWORD) {
      throw new BadRequestException('Invalid token');
    }
    user.password = await bcrypt.hash(password, SALTED_ROUNDS);

    this.userRepository.save(user);
    return true;
  }
}
