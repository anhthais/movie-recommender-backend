import { Module } from '@nestjs/common';
import { UserModule } from 'src/modules/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { OAuth2Client } from 'google-auth-library';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from '../user/entities/user.entity';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([User])],
  providers: [
    AuthService,
    {
      provide: 'GOOGLE_OAUTH2_CLIENT',
      useFactory: () => {
        return new OAuth2Client(
          process.env.OAUTH2_GOOGLE_CLIENT_ID,
          process.env.OAUTH2_GOOGLE_CLIENT_SECRET,
        );
      },
    },
    LocalStrategy,
    JwtStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
