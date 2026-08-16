import { Module } from '@nestjs/common';
import { ParksRouter } from './parks.router.js';
import { ParksService } from './parks.service.js';

@Module({
  providers: [ParksRouter, ParksService],
})
export class ParksModule {}
