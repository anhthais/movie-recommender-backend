export enum NavigationRoute {
  SEARCH_PAGE = 'SEARCH_PAGE',
  CAST_PAGE = 'CAST_PAGE',
  MOVIE_PAGE = 'MOVIE_PAGE',
  GENRE_PAGE = 'GENRE_PAGE',
  NONE = 'NONE',
}

export interface NavigationResponse {
  status: number;
  data: {
    route: NavigationRoute;
    params: any;
    metadata: any;
    is_success: boolean;
  };
}
