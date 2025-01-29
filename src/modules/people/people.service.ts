import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPeople } from './schemas/people.schema';
import { InjectRepository } from '@nestjs/typeorm';
import Rating from '../movies/entities/rating.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PeopleService {
  constructor(
    @InjectModel('people') private readonly movieModel: Model<IPeople>,
    @InjectRepository(Rating) private readonly ratingRepo: Repository<Rating>,
  ) {}

  findAll() {
    return this.movieModel.find().exec();
  }

  async findOne(id: string) {
    const person = await this.movieModel.findOne({ tmdb_id: id }).exec();
    if (!person) {
      throw new Error('Person not found');
    }

    // map rating in credits with our own rating
    if (person.movie_credits.cast.length > 0) {
      for (let i = 0; i < person.movie_credits.cast.length; i++) {
        const movie = person.movie_credits.cast[i];
        const ratings = await this.ratingRepo.find({
          where: { movieId: movie.id },
        });
        const voteCount = ratings.length;
        const voteAverage =
          voteCount > 0
            ? ratings.reduce((acc, rating) => acc + rating.score, 0) / voteCount
            : 0;

        movie.vote_count = voteCount;
        movie.vote_average = voteAverage;
      }
    }

    console.log(person);
    return person;
  }
}
