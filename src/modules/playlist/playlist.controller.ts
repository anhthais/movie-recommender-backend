import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import PlaylistService from './playlist.service';
import { ResponseMessage } from '@/shared/decorators/response-message.decorator';
import CreatePlaylistDto from './dtos/create-playlist.dto';
import { UserDto } from '../user/dto/user.dto';
import { Auth } from '@/shared/decorators/auth.decorator';

@Auth()
@Controller('/playlist')
export default class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @ResponseMessage('created a playlist')
  @UsePipes(new ValidationPipe())
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async createPlaylist(@Req() req, @Body() dto: CreatePlaylistDto) {
    const user = req.user as UserDto;

    return this.playlistService.create(user.id, dto);
  }

  @Get('/')
  async getMyPlaylists(@Req() req, @Query() query) {
    const user = req.user as UserDto;

    const { movieId } = query;

    return this.playlistService.getPlaylists(user.id, { movieId });
  }

  @Delete('/:id')
  async deletePlaylist(@Req() req, @Param() param) {
    const user = req.user as UserDto;
    const { id } = param;

    return this.playlistService.deletePlaylist(user.id, id);
  }

  @Put('/:id')
  @UsePipes(new ValidationPipe())
  async updatePlaylist(
    @Req() req,
    @Param() param,
    @Body() body: CreatePlaylistDto,
  ) {
    const user = req.user as UserDto;
    const { id } = param;

    return this.playlistService.updatePlaylist(user.id, id, body);
  }

  @Post('/:id/movies')
  async addMovieToPlayList(
    @Req() req,
    @Param() param,
    @Body() body: Record<string, any>,
  ) {
    const { id } = param;
    const user = req.user as UserDto;
    const { movieId } = body;

    return this.playlistService.addMovie(user.id, id, movieId);
  }

  @Get('/:id')
  async getPlaylist(@Req() req, @Param() param) {
    const { id } = param;
    const user = req.user as UserDto;

    return this.playlistService.getPlaylist(id, user.id);
  }

  @Delete('/:id/movies')
  async deleteMovieFromPlayList(
    @Req() req,
    @Param() param,
    @Body() body: Record<string, any>,
  ) {
    const { id } = param;
    const user = req.user as UserDto;
    const { movieId } = body;

    return this.playlistService.removeMovie(user.id, id, movieId);
  }

  @Get('/:id/movies')
  async getMovies(@Req() req, @Param() param, @Query() query) {
    const { id } = param;
    const user = req.user as UserDto;

    return this.playlistService.getMovies(id, user.id, query);
  }
}
