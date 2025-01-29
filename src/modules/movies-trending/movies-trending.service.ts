import { Injectable } from '@nestjs/common';
import { TmdbMovieDto } from '@/shared/tmdb/dtos/tmdb-movie.dto';

@Injectable()
export class MoviesTrendingService {
  private movies: TmdbMovieDto[] = [];

  findAll() {
    return this.movies;
  }

  findOne(id: number) {
    return this.movies.find((movie) => movie.id === id);
  }

  create(createMovieDto: TmdbMovieDto) {
    this.movies.push(createMovieDto);
    return createMovieDto;
  }

  update(id: number, updateMovieDto: TmdbMovieDto) {
    const movieIndex = this.movies.findIndex((movie) => movie.id === id);
    if (movieIndex > -1) {
      this.movies[movieIndex] = updateMovieDto;
      return updateMovieDto;
    }
    return null;
  }

  remove(id: number) {
    const movieIndex = this.movies.findIndex((movie) => movie.id === id);
    if (movieIndex > -1) {
      const removedMovie = this.movies.splice(movieIndex, 1);
      return removedMovie[0];
    }
    return null;
  }
}
