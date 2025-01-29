import mongoose, { Schema, Document } from 'mongoose';

export interface IGenre extends Document {
  name: string;
  tmdb_id: number;
}

export const GenreSchema = new Schema<IGenre>(
  {
    name: { type: String, required: true },
    tmdb_id: { type: Number, required: true },
  },
  { collection: 'movie_genres' },
);

export const GenreModel = mongoose.model<IGenre>('Genre', GenreSchema);
