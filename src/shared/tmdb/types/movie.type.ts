export type Movie = {
  adult: boolean;
  backdrop_path: string;
  id: number;
  title: string;
  original_language: string;
  original_title: string;
  overview: string;
  poster_path: string;
  media_type: string;
  genre_ids: number[];
  popularity: number;
  release_date: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  tagline: string;
  genres: Genre[];
  runtime: number;
  status: string;
  budget: number;
  revenue: number;
};

export type Genre = {
  id: number;
  name: string;
};

export type FilterParams = {
  page?: number;
  sortValue?: string;
  fromDate?: string;
  toDate?: string;
  selectedGenres?: number[];
  scoreValues?: number[];
  voteValues?: number[];
};

export type MovieVideo = {
  id: number;
  results: Video[];
};

export type Video = {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: string;
  official: string;
  published_at: string;
  id: string;
};

export type MovieKeywords = {
  id: number;
  name: string;
};

export type MovieCast = {
  adult: boolean;
  id: number;
  profile_path: string;
  name: string;
  character: string;
};

export const SortOptions = {
  POPULARITY_ASC: {
    KEY: 'popularity.asc',
    NAME: 'Popularity (Low to High)',
  },
  POPULARITY_DESC: {
    KEY: 'popularity.desc',
    NAME: 'Popularity (High to Low)',
  },
  RELEASE_DATE_ASC: {
    KEY: 'primary_release_date.asc',
    NAME: 'Release Date (Old to New)',
  },
  RELEASE_DATE_DESC: {
    KEY: 'primary_release_date.desc',
    NAME: 'Release Date (New to Old)',
  },
  VOTE_AVERAGE_ASC: {
    KEY: 'vote_average.asc',
    NAME: 'Rating (Low to High)',
  },
  VOTE_AVERAGE_DESC: {
    KEY: 'vote_average.desc',
    NAME: 'Rating (High to Low)',
  },
  TITLE_ASC: {
    KEY: 'original_title.asc',
    NAME: 'Title (A-Z)',
  },
  TITLE_DESC: {
    KEY: 'original_title.desc',
    NAME: 'Title (Z-A)',
  },
};
