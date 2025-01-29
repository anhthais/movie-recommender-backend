import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MoviesTrendingService } from './movies-trending.service';
import { HttpClient } from '@/shared/http/http-client/http-client';
import { TmdbMovieDto } from '@/shared/tmdb/dtos/tmdb-movie.dto';
import { TmdbPageResponse } from '@/shared/tmdb/dtos/tmdb-page.dto';
import { extractPaginationFromTmdbResponse } from '@/shared/tmdb/helpers/extract-pagination';

@Controller('movies-trending')
export class MoviesTrendingController {
  constructor(
    private readonly moviesTrendingService: MoviesTrendingService,
    private readonly httpClient: HttpClient,
  ) {}

  @Get('/trending')
  async getTrendingMovie() {
    const res = await this.httpClient.get<TmdbPageResponse<TmdbMovieDto>>({
      url: '',
    });
    return {
      data: res.results,
      pagination: extractPaginationFromTmdbResponse(res),
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moviesTrendingService.findOne(+id);
  }

  @Post()
  create(@Body() createMovieDto: TmdbMovieDto) {
    return this.moviesTrendingService.create(createMovieDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMovieDto: TmdbMovieDto) {
    return this.moviesTrendingService.update(+id, updateMovieDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.moviesTrendingService.remove(+id);
  }
}
