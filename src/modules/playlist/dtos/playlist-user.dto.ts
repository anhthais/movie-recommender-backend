import { Exclude, Expose } from 'class-transformer';
import { PlayListAccessibility } from '../entities/playlist.entity';
import { UserMiniDto } from '@/modules/user/dto/user-mini.dto';

@Exclude()
export default class PlaylistUserDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  accessibility: PlayListAccessibility;

  @Expose()
  createdAt: Date;

  @Expose()
  user: UserMiniDto;

  @Expose()
  updatedAt: Date;
}
