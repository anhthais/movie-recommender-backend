import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserMiniDto {
  @Expose()
  id: number;

  @Expose()
  fullname: string;

  @Expose()
  username: string;

  @Expose()
  picture: string;
}
