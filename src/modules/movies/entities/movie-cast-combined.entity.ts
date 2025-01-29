import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Movie } from './movie.entity';
import { Person } from '@/modules/people/entities/person.entity';

@Entity('movie_cast_combined')
export class Movies_Casts_Combined {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Movie, (movie) => movie.movie_cast, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'movie_id' })
  movie: Movie;

  @ManyToOne(() => Person, (person) => person.movie_cast, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'cast_id' })
  person: Person;

  @Column('varchar', { nullable: false })
  name: string;

  @Column('varchar', { nullable: false })
  profile_image: string;

  @Column('varchar', { nullable: false })
  character: string;
}
