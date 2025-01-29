import { Controller, Get } from '@nestjs/common';
import { MoviesPopularService } from './movies-popular.service';
import { HttpClient } from '@/shared/http/http-client/http-client';
import { TmdbMovieDto } from '@/shared/tmdb/dtos/tmdb-movie.dto';
import { TmdbPageResponse } from '@/shared/tmdb/dtos/tmdb-page.dto';
import { extractPaginationFromTmdbResponse } from '@/shared/tmdb/helpers/extract-pagination';

@Controller('movies-popular')
export class MoviesPopularController {
  constructor(
    private readonly moviesPopularService: MoviesPopularService,
    private readonly httpClient: HttpClient,
  ) {}

  @Get('/popular')
  async getPopularMovie() {
    const res = await this.httpClient.get<TmdbPageResponse<TmdbMovieDto>>({
      url: '',
    });
    return {
      data: res.results,
      pagination: extractPaginationFromTmdbResponse(res),
    };
  }
}
