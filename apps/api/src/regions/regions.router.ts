import { Injectable, Logger } from '@nestjs/common';
import { Router, Query, Mutation, Input } from 'nestjs-trpc';
import { TRPCError } from '@trpc/server';
import { RegionsService, RegionNameTakenError } from './regions.service.js';
import {
  getRegionByIdInputSchema,
  createRegionInputSchema,
  regionListOutputSchema,
  regionDetailOutputSchema,
  regionOutputSchema,
  type CreateRegionInput,
} from './dto/region.dto.js';

@Router({ alias: 'regions' })
export class RegionsRouter {
  private readonly logger = new Logger(RegionsRouter.name);

  constructor(private readonly regionsService: RegionsService) {}

  @Query({
    output: regionListOutputSchema,
  })
  async getRegions() {
    try {
      return await this.regionsService.findAll();
    } catch (error) {
      this.logger.error('Failed to fetch regions', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred while retrieving regions.',
        cause: error,
      });
    }
  }

  @Query({
    input: getRegionByIdInputSchema,
    output: regionDetailOutputSchema,
  })
  async getRegionById(@Input('id') id: string) {
    try {
      const region = await this.regionsService.findById(id);

      if (!region) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Region with ID '${id}' was not found.`,
        });
      }

      return region;
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }

      this.logger.error(`Failed to fetch region with ID ${id}`, error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An error occurred while fetching the requested region.',
        cause: error,
      });
    }
  }

  @Mutation({
    input: createRegionInputSchema,
    output: regionOutputSchema,
  })
  async createRegion(@Input() data: CreateRegionInput) {
    try {
      return await this.regionsService.create(data);
    } catch (error) {
      if (error instanceof RegionNameTakenError) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: error.message,
        });
      }

      this.logger.error('Failed to create region', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred while creating the region.',
        cause: error,
      });
    }
  }
}
