import { Exclude, Expose } from 'class-transformer';
import { PlayListAccessibility } from '../entities/playlist.entity';

@Exclude()
export default class PlaylistDto {
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
  updatedAt: Date;
}
