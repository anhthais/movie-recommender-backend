import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import LikedMovie from './entities/liked-movie.entity';
import { Repository } from 'typeorm';
import { SortDirection } from '@/shared/constants/pagination.constant';
import TmdbService from '../tmdb/tmdb.service';
import WatchLater from './entities/watch-later.entity';
import Rating from './entities/rating.entity';
import Review from './entities/review.entity';
import { plainToInstance } from 'class-transformer';
import { UserMiniDto } from '../user/dto/user-mini.dto';
import { Movie } from './entities/movie.entity';
export interface MovieQueryOptions {
  page?: number;
  limit?: number;
  keywords?: string;
  sortBy?: string;
}

@Injectable()
export default class MovieService {
  constructor(
    private readonly tmdbService: TmdbService,
    @InjectRepository(LikedMovie)
    private readonly likedMovieRepo: Repository<LikedMovie>,
    @InjectRepository(WatchLater)
    private readonly watchLaterRepo: Repository<WatchLater>,
    @InjectRepository(Rating)
    private readonly ratingRepo: Repository<Rating>,
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,
    @InjectRepository(Movie)
    private readonly movieRepo: Repository<Movie>,
  ) {}

  // async findLikedMoviesByUserId(userId: number, options?: MovieQueryOptions): Promise<PaginationResponse> {
  //     const {page = 0, limit = PaginationConfig.ELEMENTS_PER_PAGE, keywords = ''} = options ?? {};

  //     const likedMovieIds = await this.likedMovieRepo.findAndCount({
  //         where: {
  //             user: {id: userId},
  //         },
  //         skip: page * limit,
  //         take: limit,
  //         order: {
  //             createdAt: SortDirection.DESC
  //         },
  //     });

  //     const data = likedMovieIds[0].map((movie) => movie.movieId);

  //     return {
  //         data,
  //         pagination: {
  //             totalPages: Math.ceil(likedMovieIds[1] / limit),
  //             totalRecords: likedMovieIds[1],
  //             currentPage: page
  //         }
  //     };
  // }

  async findLikedMoviesByUserId(userId: number) {
    const likedMovieIds = await this.likedMovieRepo.findAndCount({
      where: {
        user: { id: userId },
      },
      order: {
        createdAt: SortDirection.DESC,
      },
    });
    const data = likedMovieIds[0].map((movie) => movie.movieId);

    return data;
  }

  async addLikedMovie(userId: number, movieId: number) {
    const movie = await this.tmdbService.getMovieById(movieId);

    if (!movie) {
      throw new NotFoundException(`Not found movie`);
    }

    const likedMovie = await this.likedMovieRepo.findOneBy({
      user: { id: userId },
      movieId,
    });

    if (likedMovie) {
      throw new BadRequestException('Liked this movie before');
    }

    await this.likedMovieRepo.save({
      user: {
        id: userId,
      },
      movieId,
    });

    return movieId;
  }

  async removeLikedMovie(userId: number, movieId: number) {
    const affected = (
      await this.likedMovieRepo.delete({ user: { id: userId }, movieId })
    ).affected;
    if (affected < 1) {
      throw new NotFoundException('Not found movie');
    }

    return affected;
  }

  async findAllWatchLater(userId: number) {
    const watchList = await this.watchLaterRepo.find({
      where: {
        user: { id: userId },
      },
      order: {
        createdAt: SortDirection.DESC,
      },
    });
    const data = watchList.map((movie) => movie.movieId);
    return data;
  }

  async addMovieToWatchLater(userId: number, movieId: number) {
    const movie = await this.tmdbService.getMovieById(movieId);

    if (!movie) {
      throw new NotFoundException(`Not found movie`);
    }

    const watchLater = await this.watchLaterRepo.findOneBy({
      user: { id: userId },
      movieId,
    });

    if (watchLater) {
      throw new BadRequestException('Added this movie before');
    }

    await this.watchLaterRepo.save({
      user: {
        id: userId,
      },
      movieId,
    });

    return movieId;
  }

  async removeFromWatchLater(userId: number, movieId: number) {
    const affected = (
      await this.watchLaterRepo.delete({ user: { id: userId }, movieId })
    ).affected;
    if (affected < 1) {
      throw new NotFoundException('Not found movie');
    }

    return affected;
  }

  async addRating(userId: number, movieId: number, score: number) {
    const movie = await this.tmdbService.getMovieById(movieId);
    if (!movie) {
      throw new NotFoundException('movie not found');
    }

    await this.ratingRepo.delete({
      movieId,
      user: {
        id: userId,
      },
    });

    const saved = await this.ratingRepo.save({
      user: {
        id: userId,
      },
      movieId,
      score,
    });

    return {
      id: saved.id,
      movieId: saved.movieId,
      score: saved.score,
    };
  }

  async deleteRating(userId: number, movieId: number) {
    await this.ratingRepo.delete({
      movieId,
      user: {
        id: userId,
      },
    });

    return true;
  }

  async getRating(userId: number, movieId: number) {
    const data = await this.ratingRepo.findOne({
      where: {
        movieId,
        user: {
          id: userId,
        },
      },
    });

    return data
      ? {
          id: data.id,
          movieId: data.movieId,
          score: data.score,
        }
      : null;
  }

  async getAverageRating(movieId: number) {
    const ratings = await this.ratingRepo.find({ where: { movieId } });
    const voteCount = ratings.length;
    const voteAverage =
      voteCount > 0
        ? ratings.reduce((acc, rating) => acc + rating.score, 0) / voteCount
        : 0;

    return {
      vote_count: voteCount,
      vote_average: voteAverage,
    };
  }

  async getRatings(userId: number) {
    const ratings = await this.ratingRepo.find({
      where: {
        user: {
          id: userId,
        },
      },
      order: {
        updatedAt: 'DESC',
      },
    });

    return ratings.map((rating) => ({
      id: rating.id,
      movieId: rating.movieId,
      score: rating.score,
    }));
  }

  async getReviews(movieId: number, page: number = 1, limit: number = 10) {
    const reviews = await this.reviewRepo.find({
      where: { movie_id: movieId },
      relations: ['user'],
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await this.reviewRepo.count({ where: { movie_id: movieId } });
    const userMini = plainToInstance(
      UserMiniDto,
      reviews.map((review) => review.user),
      { excludeExtraneousValues: true },
    );

    return {
      reviews: reviews.map((review, index) => ({
        ...review,
        user: userMini[index],
      })),
      total,
      current_page: page,
      total_pages: Math.ceil(total / limit),
    };
  }

  async getLatestReviews(movieId: number, limit: number) {
    const reviews = await this.reviewRepo.find({
      where: { movie_id: movieId },
      relations: ['user'],
      order: { updated_at: 'DESC' },
      take: limit,
    });

    const total = await this.reviewRepo.count({ where: { movie_id: movieId } });
    const userMini = plainToInstance(
      UserMiniDto,
      reviews.map((review) => review.user),
      { excludeExtraneousValues: true },
    );

    return {
      reviews: reviews.map((review, index) => ({
        ...review,
        user: userMini[index],
      })),
      total,
    };
  }

  async addReview(movieId: number, userId: number, comment: string) {
    const movie = await this.tmdbService.getMovieById(movieId);
    if (!movie) {
      throw new NotFoundException('movie not found');
    }

    const review = this.reviewRepo.create({
      user: { id: userId },
      movie_id: movieId,
      comment,
    });

    return this.reviewRepo.save(review);
  }

  async updateReview(
    reviewId: number,
    movieId: number,
    userId: number,
    comment: string,
  ) {
    const review = await this.reviewRepo.findOne({
      where: { id: reviewId },
      relations: ['user'],
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${reviewId} not found`);
    }

    if (review.user.id !== userId) {
      throw new NotFoundException('You can only edit your own reviews');
    }

    if (review.movie_id !== movieId) {
      throw new NotFoundException('Review not found for this movie');
    }

    review.comment = comment;
    return this.reviewRepo.save(review);
  }

  async deleteReview(reviewId: number, movieId: number, userId: number) {
    const review = await this.reviewRepo.findOne({
      where: { id: reviewId },
      relations: ['user'],
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${reviewId} not found`);
    }

    if (review.user.id !== userId) {
      throw new NotFoundException('You can only delete your own reviews');
    }

    if (review.movie_id !== movieId) {
      throw new NotFoundException('Review not found for this movie');
    }

    await this.reviewRepo.remove(review);
    return reviewId;
  }

  async getMovieById(movieId: number) {
    const movie = await this.tmdbService.getFullMovieById(movieId);
    const ratings = await this.ratingRepo.find({ where: { movieId: movieId } });

    const voteCount = ratings.length;
    const voteAverage =
      ratings.reduce((acc, rating) => acc + rating.score, 0) / voteCount;

    movie.vote_count = voteCount;
    movie.vote_average = voteAverage;

    return movie;
  }

  async searchMovies(query: string, page: number = 1) {
    const response = await this.tmdbService.searchMovies(query, page);
    const movies = response.results;
    for (let i = 0; i < movies.length; i++) {
      const ratings = await this.ratingRepo.find({
        where: { movieId: movies[i].id },
      });

      const voteCount = ratings.length;
      const voteAverage =
        voteCount > 0
          ? ratings.reduce((acc, rating) => acc + rating.score, 0) / voteCount
          : 0;

      movies[i].vote_count = voteCount;
      movies[i].vote_average = voteAverage;
    }

    return response;
  }

  async getPopularMovies() {
    const response = await this.tmdbService.getPopularMovies();
    const movies = response.results;
    for (let i = 0; i < movies.length; i++) {
      const ratings = await this.ratingRepo.find({
        where: { movieId: movies[i].id },
      });

      const voteCount = ratings.length;
      const voteAverage =
        voteCount > 0
          ? ratings.reduce((acc, rating) => acc + rating.score, 0) / voteCount
          : 0;

      movies[i].vote_count = voteCount;
      movies[i].vote_average = voteAverage;
    }

    return response;
  }

  async getTrendingMovies(mediaType: string, duration: string) {
    const response = await this.tmdbService.getTrendingMovies(
      mediaType,
      duration,
    );
    const movies = response.results;
    for (let i = 0; i < movies.length; i++) {
      const ratings = await this.ratingRepo.find({
        where: { movieId: movies[i].id },
      });

      const voteCount = ratings.length;
      const voteAverage =
        voteCount > 0
          ? ratings.reduce((acc, rating) => acc + rating.score, 0) / voteCount
          : 0;

      movies[i].vote_count = voteCount;
      movies[i].vote_average = voteAverage;
    }

    return response;
  }

  async getNowPlayingMovies() {
    const response = await this.tmdbService.getNowPlayingMovies();
    const movies = response.results;

    for (let i = 0; i < movies.length; i++) {
      const ratings = await this.ratingRepo.find({
        where: { movieId: movies[i].id },
      });

      const voteCount = ratings.length;
      const voteAverage =
        voteCount > 0
          ? ratings.reduce((acc, rating) => acc + rating.score, 0) / voteCount
          : 0;

      movies[i].vote_count = voteCount;
      movies[i].vote_average = voteAverage;
    }

    return response;
  }

  async discoverMovies(queryString: string) {
    const response = await this.tmdbService.discoverMovies(queryString);
    const movies = response.results;

    for (let i = 0; i < movies.length; i++) {
      const ratings = await this.ratingRepo.find({
        where: { movieId: movies[i].id },
      });

      const voteCount = ratings.length;
      const voteAverage =
        voteCount > 0
          ? ratings.reduce((acc, rating) => acc + rating.score, 0) / voteCount
          : 0;

      movies[i].vote_count = voteCount;
      movies[i].vote_average = voteAverage;
    }

    const filters = new URLSearchParams(queryString);
    const sortBy = filters.get('sort_by');
    const voteAverageGte = parseInt(filters.get('vote_average.gte') || '0');
    const voteAverageLte = parseInt(filters.get('vote_average.lte') || '10');
    const voteCountGte = parseInt(filters.get('vote_count.gte') || '0');
    const voteCountLte = parseInt(filters.get('vote_count.lte') || '500');

    const filteredMovies = movies.filter(
      (movie) =>
        movie.vote_average >= voteAverageGte &&
        movie.vote_average <= voteAverageLte &&
        movie.vote_count >= voteCountGte &&
        movie.vote_count <= voteCountLte,
    );

    if (sortBy === 'vote_average.asc') {
      filteredMovies.sort((a, b) => a.vote_average - b.vote_average);
    } else if (sortBy === 'vote_average.desc') {
      filteredMovies.sort((a, b) => b.vote_average - a.vote_average);
    }

    response.results = filteredMovies;

    return response;
  }

  async getMovieVideos(movieId: number) {
    return this.tmdbService.getMovieVideos(movieId);
  }

  async getMoviekeywords(movieId: number) {
    return this.tmdbService.getMovieKeywords(movieId);
  }

  async getMovieCasts(movieId: number) {
    return this.tmdbService.getMovieCasts(movieId);
  }
}
