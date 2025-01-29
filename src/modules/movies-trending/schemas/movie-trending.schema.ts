import { Schema, Document } from 'mongoose';
import mongoose from 'mongoose';

export interface IGenre {
  id: number;
  name: string;
}

export interface ICast {
  id: number;
  adult: boolean;
  gender: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
}

export interface ICrewPerson {
  id: number;
  adult: boolean;
  gender: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  credit_id: string;
  department: string;
  job: string;
}

export interface ICredits {
  id: number;
  cast: ICast[];
  crew: ICrewPerson[];
}

export interface IMovieTrending extends Document {
  tmdb_id: number;
  adult: boolean;
  backdrop_path: string;
  budget: number;
  categories: string[];
  genres: IGenre[];
  homepage: string;
  original_title: string;
  original_language: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  revenue: number;
  runtime: number;
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  credits: ICredits;
}

export const MovieTrendingSchema = new Schema<IMovieTrending>(
  {
    tmdb_id: { type: Number, required: true },
    adult: { type: Boolean, required: true },
    backdrop_path: { type: String, required: true },
    budget: { type: Number, required: true },
    categories: { type: [String], required: true },
    genres: [
      {
        id: { type: Number, required: true },
        name: { type: String, required: true },
      },
    ],
    homepage: { type: String, required: false },
    original_title: { type: String, required: true },
    original_language: { type: String, required: true },
    overview: { type: String, required: true },
    popularity: { type: Number, required: true },
    poster_path: { type: String, required: true },
    release_date: { type: String, required: true },
    revenue: { type: Number, required: true },
    runtime: { type: Number, required: true },
    status: { type: String, required: true },
    tagline: { type: String, required: false },
    title: { type: String, required: true },
    video: { type: Boolean, required: true },
    vote_average: { type: Number, required: true },
    vote_count: { type: Number, required: true },
    credits: {
      id: { type: Number, required: true },
      cast: [
        {
          id: { type: Number, required: true },
          adult: { type: Boolean, required: true },
          gender: { type: Number, required: true },
          known_for_department: { type: String, required: true },
          name: { type: String, required: true },
          original_name: { type: String, required: true },
          popularity: { type: Number, required: true },
          profile_path: { type: String, required: false },
          cast_id: { type: Number, required: true },
          character: { type: String, required: true },
          credit_id: { type: String, required: true },
          order: { type: Number, required: true },
        },
      ],
      crew: [
        {
          id: { type: Number, required: true },
          adult: { type: Boolean, required: true },
          gender: { type: Number, required: true },
          known_for_department: { type: String, required: true },
          name: { type: String, required: true },
          original_name: { type: String, required: true },
          popularity: { type: Number, required: true },
          profile_path: { type: String, required: false },
          credit_id: { type: String, required: true },
          department: { type: String, required: true },
          job: { type: String, required: true },
        },
      ],
    },
  },
  { collection: 'movies' },
);

export const MovieTrendingModel = mongoose.model<IMovieTrending>(
  'MovieTrending',
  MovieTrendingSchema,
);
