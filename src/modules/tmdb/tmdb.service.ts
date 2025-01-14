import { HttpClient } from "@/shared/http/http-client/http-client";
import { TmdbMovieDto } from "@/shared/tmdb/dtos/tmdb-movie.dto";
import { TmdbPageResponse } from "@/shared/tmdb/dtos/tmdb-page.dto";
import { FilterParams, Movie, SortOptions } from "@/shared/tmdb/types/movie.type";
import { Injectable } from "@nestjs/common";

@Injectable()
export default class TmdbService {
    constructor(
        private readonly httpClient: HttpClient,
    ) {}

    async getMovieById(movieId: number) {
        return this.httpClient.get<TmdbMovieDto>({url: `/movie/${movieId}`});
    }

    async getFullMovieById(movieId: number) {
        return this.httpClient.get<Movie>({url: `/movie/${movieId}`});
    }

    async searchMovies(query: string, page: number) {
        return this.httpClient.get<TmdbPageResponse<Movie>>({url: '/search/movie', params: {query, page}});
    }

    async getPopularMovies() {
        return this.httpClient.get<TmdbPageResponse<Movie>>({url: '/discover/movie'});
    }

    async getTrendingMovies(mediaType: string, duration: string) {
        return this.httpClient.get<TmdbPageResponse<Movie>>({url: `/trending/${mediaType}/${duration}`});
    }

    async getNowPlayingMovies() { 
        return this.httpClient.get<TmdbPageResponse<Movie>>({url: '/movie/now_playing'});
    }

    async discoverMovies(queryUrl: string) {
        return this.httpClient.get<TmdbPageResponse<Movie>>({url: '/discover/movie?' + queryUrl});
    }
};