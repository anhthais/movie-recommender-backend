import { Module } from '@nestjs/common';
import { PeopleController } from './people.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PeopleSchema } from './schemas/people.schema';
import { PeopleService } from './people.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Rating from '../movies/entities/rating.entity';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'people', schema: PeopleSchema }]),
    TypeOrmModule.forFeature([Rating]),
  ],
  controllers: [PeopleController],
  providers: [PeopleService],
})
export class PeopleModule {}
