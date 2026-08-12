import { Injectable, Logger } from '@nestjs/common';
import { Router, Query, Input } from 'nestjs-trpc';
import { ParksService } from './parks.service';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { parkListOutputSchema, parkOutputSchema } from './dto/park.dto';

@Router({ alias: 'parks' })
export class ParksRouter {
  private readonly logger = new Logger(ParksRouter.name);

  constructor(private readonly parksService: ParksService) {}

  @Query({
    output: parkListOutputSchema,
  })
  async getParks() {
    try {
      return await this.parksService.findAllParks();
    } catch (error) {
      this.logger.error('Failed to fetch parks', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred while retrieving parks.',
        cause: error,
      });
    }
  }

  @Query({
    input: z.object({ id: z.uuid() }),
    output: parkOutputSchema,
  })
  async getParkById(@Input('id') id: string) {
    try {
      const park = await this.parksService.findParkById(id);

      if (!park) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Park with ID '${id}' was not found.`,
        });
      }

      return park;
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }

      this.logger.error(`Failed to fetch park with ID ${id}`, error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An error occurred while fetching the requested park.',
        cause: error,
      })
    }
  }
}
