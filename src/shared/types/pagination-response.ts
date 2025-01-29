import { PaginationDto } from '../dtos/pagination.dto';

export default interface PaginationResponse {
  data: any;
  pagination: PaginationDto;
}
