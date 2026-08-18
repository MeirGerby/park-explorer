import { Module } from '@nestjs/common';
import { RegionsRouter } from './regions.router.js';
import { RegionsService } from './regions.service.js';
import { RegionsRepository } from './regions.repository.js';

@Module({
  providers: [RegionsRouter, RegionsService, RegionsRepository],
})
export class RegionsModule {}
