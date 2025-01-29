import { PaginationDto } from './pagination.dto';

export class Response<T> {
  statusCode: number;
  message?: string;
  data: T;
  timestamp: Date;
  pagination?: PaginationDto;
}
