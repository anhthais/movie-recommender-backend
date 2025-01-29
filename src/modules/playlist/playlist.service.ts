import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Playlist, { PlayListAccessibility } from './entities/playlist.entity';
import { Repository } from 'typeorm';
import CreatePlaylistDto from './dtos/create-playlist.dto';
import {
  PaginationConfig,
  SortDirection,
} from '@/shared/constants/pagination.constant';
import PlaylistDto from './dtos/playlist.dto';
import { plainToInstance } from 'class-transformer';
import TmdbService from '../tmdb/tmdb.service';
import PlaylistItem from './entities/playlist-item.entity';
import PlaylistUserDto from './dtos/playlist-user.dto';

export type PlaylistQueryOption = {
  movieId?: number;
};

export type MovieQueryOptions = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDir?: SortDirection;
};

@Injectable()
export default class PlaylistService {
  constructor(
    @InjectRepository(Playlist)
    private readonly playlistRepo: Repository<Playlist>,
    private readonly tmdbService: TmdbService,
    @InjectRepository(PlaylistItem)
    private readonly playlistItemRepo: Repository<PlaylistItem>,
  ) {}

  async create(userId: number, dto: CreatePlaylistDto) {
    const savedData = await this.playlistRepo.save({
      ...dto,
      user: {
        id: userId,
      },
    });

    return plainToInstance(PlaylistDto, savedData);
  }

  async getPlaylists(userId: number, option?: PlaylistQueryOption) {
    const { movieId } = option ?? {};

    const data = await this.playlistRepo.find({
      where: {
        user: { id: userId },
        ...(movieId
          ? {
              items: {
                movieId: movieId,
              },
            }
          : {}),
      },
      order: {
        updatedAt: SortDirection.DESC,
      },
    });

    return plainToInstance(PlaylistDto, data);
  }

  async addMovie(userId: number, playlistId: number, movieId: number) {
    const playlist = await this.playlistRepo.findOne({
      where: {
        id: playlistId,
        user: { id: userId },
      },
      relations: ['items'],
    });

    if (!playlist) {
      throw new NotFoundException();
    }

    const idx = playlist.items.findIndex((item) => item.movieId === movieId);
    if (idx !== -1) {
      throw new BadRequestException('This movie added before');
    }

    const movie = await this.tmdbService.getMovieById(movieId);

    if (!movie) {
      throw new NotFoundException('not found movie');
    }

    const data = await this.playlistItemRepo.save({
      movieId,
      playlist: {
        id: playlistId,
      },
    });

    return {
      movieId,
      playlistId: playlistId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  async removeMovie(userId: number, playlistId: number, movieId: number) {
    const item = await this.playlistItemRepo.findOne({
      where: {
        movieId: movieId,
        playlist: {
          id: playlistId,
          user: {
            id: userId,
          },
        },
      },
    });

    if (!item) {
      throw new NotFoundException('Not found playlist item');
    }

    await this.playlistItemRepo.delete({
      id: item.id,
    });

    return playlistId;
  }

  async getMovies(
    playlistId: number,
    userId?: number,
    options?: MovieQueryOptions,
  ) {
    const {
      page = 0,
      limit = PaginationConfig.ELEMENTS_PER_PAGE,
      sortDir = SortDirection.DESC,
      sortBy = 'updatedAt',
    } = options ?? {};

    const playlist = await this.playlistRepo.findOne({
      where: {
        id: playlistId,
      },
      relations: ['user'],
    });

    if (!playlist) {
      throw new NotFoundException('Not found playlist');
    }

    if (
      playlist.accessibility === PlayListAccessibility.PRIVATE &&
      userId !== playlist.user.id
    ) {
      throw new NotFoundException('Not found exception');
    }

    const items = await this.playlistItemRepo.findAndCount({
      where: {
        playlist: {
          id: playlistId,
        },
      },
      order: {
        [sortBy]: sortDir,
      },
      skip: page * limit,
      take: limit,
    });

    return {
      data: items[0].map((item) => item.movieId),
      pagination: {
        totalPages: Math.ceil(items[1] / limit),
        totalRecords: items[1],
        currentPage: page,
      },
    };
  }

  async deletePlaylist(userId: number, playlistId) {
    const check = await this.playlistRepo.count({
      where: {
        user: {
          id: userId,
        },
        id: playlistId,
      },
    });

    if (check < 1) {
      throw new NotFoundException('not found playlist');
    }

    await this.playlistRepo.delete({
      id: playlistId,
    });
    return playlistId;
  }

  async updatePlaylist(
    userId: number,
    playlistId: number,
    dto: CreatePlaylistDto,
  ) {
    const savedData = await this.playlistRepo.findOne({
      where: {
        user: {
          id: userId,
        },
        id: playlistId,
      },
    });

    if (!savedData) {
      throw new NotFoundException('not found playlist');
    }

    const data = {
      ...savedData,
      ...dto,
    };

    const res = await this.playlistRepo.save(data);

    return plainToInstance(PlaylistDto, res);
  }

  async getPlaylist(playlistId: number, userId?: number) {
    const playlist = await this.playlistRepo.findOne({
      where: {
        id: playlistId,
      },
      relations: ['user'],
    });

    if (!playlist) {
      throw new NotFoundException('not found playlist');
    }

    if (
      playlist.accessibility != PlayListAccessibility.PUBLIC &&
      playlist.user.id !== userId
    ) {
      throw new NotFoundException('not found playlist');
    }

    return plainToInstance(PlaylistUserDto, playlist);
  }
}
