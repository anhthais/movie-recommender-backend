import { Controller, Get, Query } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('/navigate')
  async getAiNavigation(@Query('query') query: string) {
    return this.aiService.navigate(query);
  }

  @Get('/retriever')
  async getRetriever(
    @Query('collection_name') collectionName: string,
    @Query('query') query: string,
    @Query('amount') amount: number = 10,
    @Query('threshold') threshold: number = 0.25,
  ) {
    return this.aiService.retrieveMovies(
      collectionName,
      query,
      amount,
      threshold,
    );
  }

  @Get('/rag')
  async getRag(
    @Query('collection_name') collectionName: string,
    @Query('query') query: string,
  ) {
    return this.aiService.rag(collectionName, query);
  }
}
