import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import LikedMovie from "./entities/liked-movie.entity";
import { In, Repository } from "typeorm";
import { PaginationConfig, SortDirection } from "@/shared/constants/pagination";
import PaginationResponse from "@/shared/types/pagination-response";
import TmdbService from "../tmdb/tmdb.service";
import WatchLater from "./entities/watch-later.entity";
import Rating from "./entities/rating.entity";
import Review from "./entities/review.entity";
import { plainToInstance } from "class-transformer";
import { UserMiniDto } from "../user/dto/user-mini.dto";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Movie } from "./entities/movie.entity";
import { IMovie } from "./schemas/movie.schema";
export interface MovieQueryOptions {
    page?: number;
    limit?: number;
    keywords?: string;
    sortBy?: string;

};

@Injectable()
export default class MovieService {
    constructor(
        private readonly tmdbService: TmdbService,
        @InjectRepository(LikedMovie) private readonly likedMovieRepo: Repository<LikedMovie>,
        @InjectRepository(WatchLater) private readonly watchLaterRepo: Repository<WatchLater>,
        @InjectRepository(Rating) private readonly ratingRepo: Repository<Rating>,
        @InjectRepository(Review) private readonly reviewRepo: Repository<Review>,
        @InjectRepository(Movie) private readonly movieRepo: Repository<Movie>,

        @InjectModel('movies') private readonly movieModel: Model<IMovie>,

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
    async getMovie(movieId: string) {
        const movie = await this.movieModel.findById(movieId).exec();
        if (!movie ) {  
            throw new Error('Movie not found');  
        }
        return movie;  
    }
    
      
    async findLikedMoviesByUserId(userId: number) {
        console.log("Check" + userId)
        const likedMovieIds = await this.likedMovieRepo.findAndCount({
            where: {
                user: {id: userId},
            },
            order: {
                createdAt: SortDirection.DESC
            },
        });
        console.log(likedMovieIds)
        const data = likedMovieIds[0].map((movie) => movie.movieId);

        return data;
    }

    async addLikedMovie(userId: number, movieId: number) {
        const movie = await this.tmdbService.getMovieById(movieId);

        if(!movie) {
            throw new NotFoundException(`Not found movie`);
        };

        const likedMovie = await this.likedMovieRepo.findOneBy({
            user: {id: userId},
            movieId
        });

        if(likedMovie) {
            throw new BadRequestException('Liked this movie before');
        }

        const savedData = await this.likedMovieRepo.save({
            user: {
                id: userId
            },
            movieId
        });

        return movieId;
    }

    async removeLikedMovie(userId: number, movieId: number) {

        const affected = (await this.likedMovieRepo.delete({user: {id: userId}, movieId})).affected;
        if(affected < 1) {
            throw new NotFoundException('Not found movie');
        }

        return affected;
    }

    async findAllWatchLater(userId: number) {
        const watchList = await this.watchLaterRepo.find({
            where: {
                user: {id: userId},
            },
            order: {
                createdAt: SortDirection.DESC
            },
        });
        const data = watchList.map((movie) => movie.movieId);
        return data;
    }

    async addMovieToWatchLater(userId: number, movieId: number) {
        const movie = await this.tmdbService.getMovieById(movieId);

        if(!movie) {
            throw new NotFoundException(`Not found movie`);
        };

        const watchLater = await this.watchLaterRepo.findOneBy({
            user: {id: userId},
            movieId
        });

        if(watchLater) {
            throw new BadRequestException('Added this movie before');
        }

        const savedData = await this.watchLaterRepo.save({
            user: {
                id: userId
            },
            movieId
        });

        return movieId;
    }

    async removeFromWatchLater(userId: number, movieId: number) {
        const affected = (await this.watchLaterRepo.delete({user: {id: userId}, movieId})).affected;
        if(affected < 1) {
            throw new NotFoundException('Not found movie');
        }

        return affected;
    }

    async addRating(userId: number, movieId: number, score: number) {
      const movie = await this.tmdbService.getMovieById(movieId);
      if(!movie) {
        throw new NotFoundException('movie not found');
      }

      await this.ratingRepo.delete({
        movieId,
        user: {
          id: userId,
        }
      })
      
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
          }
        }
      });

      return data 
        ? {
          id: data.id,
          movieId: data.movieId,
          score: data.score,
        } 
        : null;
    }

    async getRatings(userId: number) {
      const ratings = await this.ratingRepo.find({
        where: {
          user: {
            id: userId
          }
        },
        order: {
          updatedAt: 'DESC'
        }
      });

      return ratings
                .map((rating) => ({
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
      const userMini = plainToInstance(UserMiniDto, reviews.map((review) => review.user), { excludeExtraneousValues: true });

      return {
        reviews: reviews.map((review, index) => ({
          ...review,
          user: userMini[index],
        })),
        total,
        current_page: page,
        total_pages: Math.ceil(total / limit),
      }
    }

    async getLatestReviews(movieId: number, limit: number) {
      const reviews = await this.reviewRepo.find({
        where: { movie_id: movieId },
        relations: ['user'],
        order: { updated_at: 'DESC' },
        take: limit,
      });

      const total = await this.reviewRepo.count({ where: { movie_id: movieId } });
      const userMini = plainToInstance(UserMiniDto, reviews.map((review) => review.user), { excludeExtraneousValues: true });
      
      return {
        reviews: reviews.map((review, index) => ({
          ...review,
          user: userMini[index],
        })),
        total,
      }
    }

    async addReview(movieId: number, userId: number, comment: string) {
      const movie = await this.tmdbService.getMovieById(movieId);
      if(!movie) {
        throw new NotFoundException('movie not found');
      }

      const review = this.reviewRepo.create({
        user: { id: userId },
        movie_id: movieId,
        comment,
      });

      return this.reviewRepo.save(review);
    }

    async updateReview(reviewId: number, movieId: number, userId: number, comment: string) {
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

    async getMoviesWithObjectIds(objectIds: string[]) {
      const movies = await this.movieModel.find({ _id: { $in: objectIds } });

      return movies.map((movie) => ({
        id: movie.id,
        tmdb_id: movie.tmdb_id,
        backdrop_path: movie.backdrop_path,
        title: movie.title,
        original_title: movie.original_title,
        original_language: movie.original_language,
        tagline: movie.tagline,
        release_date: movie.release_date,
        budget: movie.budget,
        revenue: movie.revenue,
        runtime: movie.runtime,
        popularity: movie.popularity,
        video: movie.video,
        status: movie.status,
        poster_path: movie.poster_path,
        genre_ids: movie.genres.map((genre) => genre.id),
        genres: movie.genres.map((genre) => ({
          id: genre.id,
          name: genre.name,
        })),
        overview: movie.overview,
      }));
    }
};