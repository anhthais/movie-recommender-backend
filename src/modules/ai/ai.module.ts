import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { HttpModule } from '@nestjs/axios';
import { LlmHttpConfigService } from '@/config/llm-http.config';
import { MongooseModule } from '@nestjs/mongoose';
import { MovieSchema } from '../movies/schemas/movie.schema';
import { GenreSchema } from '../movies/schemas/genre.schema';
import Rating from '../movies/entities/rating.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    HttpModule.registerAsync({
      useClass: LlmHttpConfigService,
    }),
    MongooseModule.forFeature([
      { schema: MovieSchema, name: 'movies' },
      { schema: GenreSchema, name: 'genres' },
    ]),
    TypeOrmModule.forFeature([Rating]),
  ],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
