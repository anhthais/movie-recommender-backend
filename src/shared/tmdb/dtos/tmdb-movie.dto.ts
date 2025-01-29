import { Expose } from 'class-transformer';

export class TmdbMovieDto {
  adult: boolean;

  @Expose({ name: 'backdrop_path' })
  backdropPath: string;

  id: number;

  title: string;

  @Expose({ name: 'original_language' })
  originalLanguage: string;

  @Expose({ name: 'original_title' })
  originalTitle: string;

  @Expose({ name: 'overview' })
  overview: string;

  @Expose({ name: 'poster_path' })
  posterPath: string;

  @Expose({ name: 'media_type' })
  mediaType: string;

  @Expose({ name: 'genre_ids' })
  genreIds: number[];

  popularity: number;

  @Expose({ name: 'release_date' })
  releaseDate: string;

  video: boolean;

  @Expose({ name: 'vote_average' })
  voteAverage: number;

  @Expose({ name: 'vote_count' })
  voteCount: number;
}
