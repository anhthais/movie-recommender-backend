import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { InjectModel } from '@nestjs/mongoose';
import { IMovie } from '../movies/schemas/movie.schema';
import { IGenre } from '../movies/schemas/genre.schema';
import { Model } from 'mongoose';
import {
  NavigationResponse,
  NavigationRoute,
} from './interfaces/navigation-response.interface';
import { RetrieverResponse } from './interfaces/retriever-response.interface';
import { Repository } from 'typeorm';
import Rating from '../movies/entities/rating.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AiService {
  private readonly llmApiKey: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectModel('movies') private movieModel: Model<IMovie>,
    @InjectModel('genres') private genreModel: Model<IGenre>,
    @InjectRepository(Rating) private readonly ratingRepo: Repository<Rating>,
  ) {
    this.llmApiKey = configService.get('LLM_API_KEY');
  }

  async navigate(query: string) {
    const res = this.httpService
      .post<NavigationResponse>(
        `/navigate/?llm_api_key=${this.llmApiKey}&query=${query}`,
        {
          headers: {
            Accept: 'application/json',
          },
        },
      )
      .pipe(
        catchError((error: AxiosError) => {
          console.error(error);
          throw new InternalServerErrorException();
        }),
      );

    const { data } = await firstValueFrom(res);

    if (data.data.route === NavigationRoute.CAST_PAGE && data.data.params) {
      const movies = await this.movieModel.find({
        _id: { $in: data.data.params.movie_ids },
      });

      if (movies.length === 0) {
        data.data.route = NavigationRoute.NONE;
        data.data.params = null;
      } else {
        data.data.params = movies.map((movie: IMovie) => {
          return {
            id: movie.tmdb_id,
            name: movie.title || movie.original_title,
          };
        });
      }
    } else if (
      data.data.route === NavigationRoute.MOVIE_PAGE &&
      data.data.params
    ) {
      const movies = await this.movieModel.find({
        _id: { $in: data.data.params.movie_ids },
      });

      if (movies.length === 0) {
        data.data.route = NavigationRoute.NONE;
        data.data.params = null;
      } else {
        data.data.params = movies.map((movie: IMovie) => {
          return {
            id: movie.tmdb_id,
            name: movie.title,
          };
        });
      }
    } else if (
      data.data.route === NavigationRoute.GENRE_PAGE &&
      data.data.params
    ) {
      const genres = await this.genreModel.find({
        _id: { $in: data.data.params.genre_ids },
      });

      if (genres.length === 0) {
        data.data.route = NavigationRoute.NONE;
        data.data.params = null;
      } else {
        data.data.params = genres.map((genre: IGenre) => {
          return {
            id: genre.tmdb_id,
            name: genre.name,
          };
        });
      }
    } else if (!data.data.params) {
      data.data.route = NavigationRoute.NONE;
    }

    return data.data;
  }

  async retrieveMovies(
    collectionName: string,
    query: string,
    amount: number = 10,
    threshold: number = 0.25,
  ) {
    const params = {
      llm_api_key: this.llmApiKey,
      collection_name: collectionName,
      query,
      amount,
      threshold,
    };

    const res = this.httpService
      .get<RetrieverResponse>('/retriever/', {
        params,
        headers: {
          Accept: 'application/json',
        },
      })
      .pipe(
        catchError((error: AxiosError) => {
          console.error('Error retrieving movies:', error.message);
          throw new InternalServerErrorException('Failed to retrieve movies');
        }),
      );

    const { data } = await firstValueFrom(res);

    if (!data.data.result || data.data.result.length === 0) {
      data.data.result = [];
    } else {
      const objectIds = data.data.result;
      const movies = await this.movieModel.find({ _id: { $in: objectIds } });

      for (let i = 0; i < movies.length; i++) {
        // overwrite rating
        const ratings = await this.ratingRepo.find({
          where: { movieId: movies[i].tmdb_id },
        });

        const voteCount = ratings.length;
        const voteAverage =
          voteCount > 0
            ? ratings.reduce((acc, rating) => acc + rating.score, 0) / voteCount
            : 0;

        movies[i].vote_count = voteCount;
        movies[i].vote_average = voteAverage;
      }

      data.data.result = movies.map((movie) => ({
        id: movie.tmdb_id,
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
        vote_count: movie.vote_count,
        vote_average: movie.vote_average,
      }));
    }

    return data.data;
  }

  async rag(collectionName: string, query: string) {
    const res = this.httpService
      .post('/rag/', {
        llm_api_key: this.llmApiKey,
        collection_name: collectionName,
        query,
      })
      .pipe(
        catchError((error: AxiosError) => {
          console.error('Error retrieving movies:', error.message);
          throw new InternalServerErrorException('Failed to retrieve movies');
        }),
      );

    const { data } = await firstValueFrom(res);

    if (!data.data.result) {
      data.data.result = null;
    }

    return data.data.result;
  }
}
