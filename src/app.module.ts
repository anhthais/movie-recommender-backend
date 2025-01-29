import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseTransformInterceptor } from './shared/interceptors/response-transform.interceptor';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { HttpConfigService } from './config/http.config';
import { HttpClientModule } from './shared/http/http-client/http-client-module';
import { TmdbModule } from './modules/tmdb/tmdb.module';
import { dataSourceOptions } from './config/typeorm.config';
import PlaylistModule from './modules/playlist/playlist.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailerOptions } from './config/mailer.config';
import { MongooseModule } from '@nestjs/mongoose';
import { mongooseConfig } from './config/mongoose.config';
import { AiModule } from './modules/ai/ai.module';
import { MovieModule } from './modules/movies/movie.module';
import { PeopleModule } from './modules/people/people.module';
import { MoviesPopularModule } from './modules/movies-popular/movies-popular.module';
import { MoviesTrendingModule } from './modules/movies-trending/movies-trending.module';

@Module({
  imports: [
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
    ConfigModule.forRoot({
      envFilePath: `${process.env.NODE_ENV != 'production' ? '.env' : `.env.${process.env.NODE_ENV}`}`,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    MongooseModule.forRoot(mongooseConfig.uri),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: process.env.JWT_SECRET,
          signOptions: {
            expiresIn: '5m',
          },
        };
      },
      global: true,
    }),
    MailerModule.forRoot(mailerOptions),
    {
      ...HttpModule.registerAsync({
        useClass: HttpConfigService,
      }),
      global: true,
    },
    HttpClientModule,
    UserModule,
    AuthModule,
    TmdbModule,
    PlaylistModule,
    AiModule,
    MovieModule,
    PeopleModule,
    MoviesPopularModule,
    MoviesTrendingModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseTransformInterceptor,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // }
  ],
})
export class AppModule {}
