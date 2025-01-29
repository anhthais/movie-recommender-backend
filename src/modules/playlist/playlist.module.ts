import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Playlist from './entities/playlist.entity';
import PlaylistController from './playlist.controller';
import PlaylistService from './playlist.service';
import { TmdbModule } from '../tmdb/tmdb.module';
import PlaylistItem from './entities/playlist-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Playlist, PlaylistItem]), TmdbModule],
  controllers: [PlaylistController],
  providers: [PlaylistService],
})
export default class PlaylistModule {}
