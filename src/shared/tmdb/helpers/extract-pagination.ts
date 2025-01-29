import { PaginationDto } from 'src/shared/dtos/pagination.dto';
import { TmdbPageResponse } from '../dtos/tmdb-page.dto';

export const extractPaginationFromTmdbResponse = (
  data: TmdbPageResponse<any>,
): PaginationDto => {
  return {
    totalPages: data.totalPages,
    currentPage: data.page,
    totalRecords: data.totalResults,
  };
};
