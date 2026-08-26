import { Injectable } from '@nestjs/common';
import type {
  CreateParkInput,
  GetParksInput,
  ParkDetailOutput,
  ParkOutput,
  UpdateParkInput,
} from './dto/park.dto.js';
import { ParksRepository } from './parks.repository.js';

export class ParkNotFoundError extends Error {
  constructor(public readonly parkId: string) {
    super(`Park with ID '${parkId}' was not found.`);
    this.name = 'ParkNotFoundError';
  }
}

export class ParkCityNotFoundError extends Error {
  constructor(public readonly cityId: string) {
    super(`City '${cityId}' was not found.`);
    this.name = 'ParkCityNotFoundError';
  }
}

export class ParkCreatorNotFoundError extends Error {
  constructor(public readonly creatorId: string) {
    super(`User '${creatorId}' was not found.`);
    this.name = 'ParkCreatorNotFoundError';
  }
}

@Injectable()
export class ParksService {
  constructor(private readonly parksRepository: ParksRepository) {}

  async findAll(params?: GetParksInput): Promise<ParkOutput[]> {
    return this.parksRepository.findAll(params);
  }

  async findById(id: string): Promise<ParkDetailOutput | null> {
    return this.parksRepository.findById(id);
  }

  async create(data: CreateParkInput): Promise<ParkDetailOutput> {
    return this.parksRepository.create(data, {
      onCityNotFound: () => {
        throw new ParkCityNotFoundError(data.cityId);
      },
      onCreatorNotFound: () => {
        throw new ParkCreatorNotFoundError(data.creatorId);
      },
    });
  }

  async update(
    id: string,
    data: UpdateParkInput,
  ): Promise<ParkDetailOutput | null> {
    return this.parksRepository.update(id, data, {
      onParkNotFound: () => {
        throw new ParkNotFoundError(id);
      },
      onCityNotFound: () => {
        throw new ParkCityNotFoundError(data.cityId ?? '');
      },
    });
  }

  async remove(id: string): Promise<{ success: boolean }> {
    return this.parksRepository.remove(id);
  }
}
