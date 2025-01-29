import { Expose } from 'class-transformer';

export class TmdbPageResponse<T> {
  page: number;

  results: T[];

  @Expose({ name: 'total_pages' })
  totalPages: number;

  @Expose({ name: 'total_results' })
  totalResults: number;
}
