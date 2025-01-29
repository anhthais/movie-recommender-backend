import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieController } from './movie.controller';
import MovieService from './movie.service';

import LikedMovie from './entities/liked-movie.entity';
import WatchLater from './entities/watch-later.entity';
import Rating from './entities/rating.entity';
import Review from './entities/review.entity';
import { Movie } from './entities/movie.entity';

import { TmdbModule } from '../tmdb/tmdb.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LikedMovie, WatchLater, Rating, Review, Movie]),
    TmdbModule,
  ],
  controllers: [MovieController],
  providers: [MovieService],
})
export class MovieModule {}
