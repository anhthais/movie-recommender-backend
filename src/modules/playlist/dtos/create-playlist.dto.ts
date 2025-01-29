import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';
import { PlayListAccessibility } from '../entities/playlist.entity';

export class CreatePlaylistDto {
  @IsString()
  @MinLength(1)
  @MaxLength(40)
  name: string;

  @MaxLength(200)
  description: string;

  @IsEnum(PlayListAccessibility)
  accessibility: PlayListAccessibility;
}

export default CreatePlaylistDto;
