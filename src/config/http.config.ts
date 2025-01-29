import { HttpModuleOptions, HttpModuleOptionsFactory } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HttpConfigService implements HttpModuleOptionsFactory {
  constructor(private configService: ConfigService) {}

  createHttpOptions(): Promise<HttpModuleOptions> | HttpModuleOptions {
    return {
      timeout: 100000,
      maxRedirects: 5,
      baseURL: this.configService.get('TMDB_API_BASE_URL'),
      headers: {
        Authorization: `Bearer ${this.configService.get('TMDB_ACCESS_TOKEN')}`,
      },
    };
  }
}
