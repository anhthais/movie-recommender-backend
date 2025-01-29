import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Movies_Casts_Combined } from './movie-cast-combined.entity';
@Entity('movie')
export class Movie {
  @PrimaryColumn('varchar', { length: 24 })
  id: string;

  @Column('int', { nullable: false })
  tmdb_id: number;

  @Column('text', { nullable: true })
  backdrop_path: string;

  @Column('varchar', { length: 255, nullable: true })
  title: string;

  @Column('varchar', { length: 255, nullable: true })
  original_title: string;

  @Column('varchar', { length: 255, nullable: true })
  original_language: string;

  @Column('text', { nullable: true })
  tagline: string;

  @Column('date', { nullable: true })
  release_date: string;

  @Column('float', { default: 0 })
  budget: number;

  @Column('float', { default: 0 })
  revenue: number;

  @Column('int', { nullable: true })
  runtime: number;

  @Column('float', { nullable: true })
  popularity: number;

  @Column('boolean', { default: false })
  video: boolean;

  @Column('varchar', { length: 50, nullable: true })
  status: string;

  @Column('text', { nullable: true })
  poster_path: string;

  @Column('int', { array: true, nullable: true })
  genre_ids: number[];

  @Column('varchar', { array: true, nullable: true })
  trailers: string[];

  @Column('text', { nullable: true })
  overview: string;

  @Column('varchar', { nullable: true })
  keywords: string[];

  @OneToMany(() => Movies_Casts_Combined, (movie_cast) => movie_cast.movie)
  movie_cast: Movies_Casts_Combined[];
}
