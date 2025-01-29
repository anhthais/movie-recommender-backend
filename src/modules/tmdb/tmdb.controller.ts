import { Controller, Get, Param, Query } from '@nestjs/common';
import { Public } from 'src/shared/decorators/public.recorator';
import { HttpClient } from 'src/shared/http/http-client/http-client';

@Controller('/tmdb')
export class TmdbController {
  constructor(private readonly httpClient: HttpClient) {}

  @Public()
  @Get('*')
  public getResourceFromTmdb(@Param('0') params, @Query() query) {
    return this.httpClient.get<any>({ url: params, params: query });
  }
}
