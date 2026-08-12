import { Injectable, Logger } from '@nestjs/common';
import { Router, Query, Mutation, Input } from 'nestjs-trpc';
import { TRPCError } from '@trpc/server';
import { ParkCityNotFoundError, ParksService } from './parks.service.js';
import {
  createParkInputSchema,
  getParkByIdInputSchema,
  getParksInputSchema,
  parkDetailOutputSchema,
  parkListOutputSchema,
  type CreateParkInput,
  type GetParksInput,
} from './dto/park.dto.js';

@Router({ alias: 'parks' })
export class ParksRouter {
  private readonly logger = new Logger(ParksRouter.name);

  constructor(private readonly parksService: ParksService) {}

  @Query({
    input: getParksInputSchema,
    output: parkListOutputSchema,
  })
  async getParks(@Input() params: GetParksInput) {
    try {
      return await this.parksService.findAll(params);
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
    input: getParkByIdInputSchema,
    output: parkDetailOutputSchema,
  })
  async getParkById(@Input('id') id: string) {
    try {
      const park = await this.parksService.findById(id);

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
      });
    }
  }

  @Mutation({
    input: createParkInputSchema,
    output: parkDetailOutputSchema,
  })
  async createPark(@Input() data: CreateParkInput) {
    try {
      return await this.parksService.create(data);
    } catch (error) {
      if (error instanceof ParkCityNotFoundError) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message,
        });
      }

      this.logger.error('Failed to create park', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred while creating the park.',
        cause: error,
      });
    }
  }
}
