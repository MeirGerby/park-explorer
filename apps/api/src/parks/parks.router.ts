import { Injectable, Logger } from '@nestjs/common';
import { Router, Query, Mutation, Input } from 'nestjs-trpc';
import { TRPCError } from '@trpc/server';
import {
  ParkCityNotFoundError,
  ParkCreatorNotFoundError,
  ParkNotFoundError,
  ParksService,
} from './parks.service.js';
import {
  createParkInputSchema,
  getParkByIdInputSchema,
  getParksInputSchema,
  parkDetailOutputSchema,
  parkListOutputSchema,
  updateParkInputSchema,
  type CreateParkInput,
  type GetParksInput,
} from './dto/park.dto.js';
import z from 'zod';

export const updateParkPayloadSchema = z.object({
  id: z.uuid(),
  data: updateParkInputSchema,
});

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
      if (
        error instanceof ParkCityNotFoundError ||
        error instanceof ParkCreatorNotFoundError
      ) {
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

  @Mutation({
    input: updateParkPayloadSchema,
    output: parkDetailOutputSchema,
  })
  async updatePark(@Input() payload: z.infer<typeof updateParkPayloadSchema>) {
    try {
      return await this.parksService.update(payload.id, payload.data);
    } catch (error) {
      if (error instanceof ParkNotFoundError) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: error.message,
        });
      }

      if (error instanceof ParkCityNotFoundError) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: error.message });
      }

      this.logger.error(`Failed to update park with ID ${payload.id}`, error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred while updating the park.',
        cause: error,
      });
    }
  }

  @Mutation({
    input: getParkByIdInputSchema,
    output: z.object({ success: z.boolean() }),
  })
  async removePark(@Input('id') id: string) {
    try {
      const result = await this.parksService.remove(id);

      if (!result.success) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Park with ID '${id}' was not found or could not be deleted`,
        });
      }

      return result;
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }

      this.logger.error(`Failed to remove park with ID $id`, error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred while deleting the park.',
        cause: error,
      });
    }
  }
}
