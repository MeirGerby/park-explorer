import { Module } from '@nestjs/common';
import { ParksRouter } from './parks.router.js';
import { ParksService } from './parks.service.js';
import { ParksRepository } from './parks.repository.js';

@Module({
  providers: [ParksRouter, ParksService, ParksRepository],
})
export class ParksModule {}
