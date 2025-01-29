import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Public } from 'src/shared/decorators/public.recorator';
import { HttpClient } from 'src/shared/http/http-client/http-client';
import { TmdbMovieDto } from 'src/shared/tmdb/dtos/tmdb-movie.dto';
import { TmdbPageResponse } from 'src/shared/tmdb/dtos/tmdb-page.dto';
import { extractPaginationFromTmdbResponse } from 'src/shared/tmdb/helpers/extract-pagination';
import MovieService from './movie.service';
import { UserDto } from '../user/dto/user.dto';
import { Auth } from '@/shared/decorators/auth.decorator';
import { Request } from 'express';

@Controller('/movies')
@Auth()
export class MovieController {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly movieService: MovieService,
  ) {}

  @Public()
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

  @Get('/liked')
  async getLikedMovies(@Req() req) {
    const user = req.user as UserDto;
    return this.movieService.findLikedMoviesByUserId(user.id);
  }

  @Post('/liked')
  @HttpCode(HttpStatus.CREATED)
  async addLikedMovie(@Req() req, @Body() body: Record<string, any>) {
    const { movieId } = body;
    const user = req.user as UserDto;

    return this.movieService.addLikedMovie(user.id, movieId);
  }

  @Delete('/liked')
  @HttpCode(HttpStatus.OK)
  async deleteLikedMovie(@Req() req, @Body() body: Record<string, any>) {
    const { movieId } = body;
    const user = req.user as UserDto;

    return this.movieService.removeLikedMovie(user.id, movieId);
  }

  @Get('/watch-later')
  async getWatchLaterList(@Req() req) {
    const user = req.user as UserDto;
    return this.movieService.findAllWatchLater(user.id);
  }

  @Post('/watch-later')
  @HttpCode(HttpStatus.CREATED)
  async addMovieToWatchLater(@Req() req, @Body() body: Record<string, any>) {
    const { movieId } = body;
    const user = req.user as UserDto;

    return this.movieService.addMovieToWatchLater(user.id, movieId);
  }

  @Delete('/watch-later')
  @HttpCode(HttpStatus.OK)
  async deleteMovieFromWatchLater(
    @Req() req,
    @Body() body: Record<string, any>,
  ) {
    const { movieId } = body;
    const user = req.user as UserDto;

    return this.movieService.removeFromWatchLater(user.id, movieId);
  }

  @Post('/:movieId/rating')
  async addMovieRating(
    @Param('movieId') movieId: number,
    @Req() req,
    @Body() body: Record<string, any>,
  ) {
    const { score } = body;
    const user = req.user as UserDto;

    return this.movieService.addRating(user.id, movieId, score);
  }

  @Delete('/:movieId/rating')
  async removeMovieRating(@Param('movieId') movieId: number, @Req() req) {
    const user = req.user as UserDto;
    return this.movieService.deleteRating(user.id, movieId);
  }

  @Get('/:movieId/rating')
  async getRatingOfMovie(@Param('movieId') movieId: number, @Req() req) {
    const user = req.user as UserDto;
    return this.movieService.getRating(user.id, movieId);
  }

  @Public()
  @Get('/:movieId/rating/average')
  async getAverageRatingOfMovie(@Param('movieId') movieId: number) {
    return this.movieService.getAverageRating(movieId);
  }

  @Get('/rating')
  async getRatings(@Req() req: Request) {
    const user = req.user as UserDto;
    return this.movieService.getRatings(user.id);
  }

  @Public()
  @Get('/:movieId/reviews')
  @HttpCode(HttpStatus.OK)
  async getReviewsByMovie(
    @Param('movieId') movieId: number,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    if (isNaN(page)) {
      page = 1;
    }

    if (isNaN(limit)) {
      limit = 10;
    }

    return this.movieService.getReviews(movieId, page, limit);
  }

  @Public()
  @Get('/:movieId/reviews/latest')
  @HttpCode(HttpStatus.OK)
  async getLatestReviewsByMovie(
    @Param('movieId') movieId: number,
    @Query('limit') limit: number,
  ) {
    if (isNaN(limit)) {
      limit = 1;
    }
    return this.movieService.getLatestReviews(movieId, limit);
  }

  @Post('/:movieId/reviews')
  @HttpCode(HttpStatus.CREATED)
  async addReviewToMovie(
    @Param('movieId') movieId: number,
    @Req() req,
    @Body() body: Record<string, any>,
  ) {
    const user = req.user as UserDto;
    const { comment } = body;

    return this.movieService.addReview(movieId, user.id, comment);
  }

  @Patch('/:movieId/reviews/:reviewId')
  @HttpCode(HttpStatus.OK)
  async editReviewOfMovie(
    @Param('movieId') movieId: number,
    @Param('reviewId') reviewId: number,
    @Req() req,
    @Body() body: Record<string, any>,
  ) {
    const user = req.user as UserDto;
    const { comment } = body;

    return this.movieService.updateReview(reviewId, movieId, user.id, comment);
  }

  @Delete('/:movieId/reviews/:reviewId')
  @HttpCode(HttpStatus.OK)
  async deleteReviewOfMovie(
    @Param('movieId') movieId: number,
    @Param('reviewId') reviewId: number,
    @Req() req,
  ) {
    const user = req.user as UserDto;
    return this.movieService.deleteReview(reviewId, movieId, user.id);
  }

  // tmdb emulated endpoints
  @Public()
  @Get('/search')
  async searchMovie(
    @Query('query') query: string,
    @Query('page') page: number,
  ) {
    if (isNaN(page)) {
      page = 1;
    }
    return this.movieService.searchMovies(query, page);
  }

  @Public()
  @Get('/popular')
  async getPopularMovies() {
    return this.movieService.getPopularMovies();
  }

  @Public()
  @Get('/trending/:mediaType/:duration')
  async getTrendingMovies(
    @Param('mediaType') mediaType: string,
    @Param('duration') duration: string,
  ) {
    return this.movieService.getTrendingMovies(mediaType, duration);
  }

  @Public()
  @Get('/now-playing')
  async getNowPlayingMovies() {
    return this.movieService.getNowPlayingMovies();
  }

  @Public()
  @Get('/discover')
  async discoverMovies(@Query() query: Record<string, string>) {
    const queryString = Object.keys(query)
      .map((key) => `${key}=${query[key]}`)
      .join('&');

    return this.movieService.discoverMovies(queryString);
  }

  @Public()
  @Get('/detail/:movieId')
  async getMovieById(@Param('movieId') movieId: number) {
    return this.movieService.getMovieById(movieId);
  }

  @Public()
  @Get('/detail/:movieId/videos')
  async getMovieVideos(@Param('movieId') movieId: number) {
    return this.movieService.getMovieVideos(movieId);
  }

  @Public()
  @Get('/detail/:movieId/keywords')
  async getMovieKeywords(@Param('movieId') movieId: number) {
    return this.movieService.getMoviekeywords(movieId);
  }

  @Public()
  @Get('/detail/:movieId/casts')
  async getMovieCasts(@Param('movieId') movieId: number) {
    return this.movieService.getMovieCasts(movieId);
  }
}
