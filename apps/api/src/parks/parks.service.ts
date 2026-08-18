import { Injectable } from '@nestjs/common';
import type {
  CreateParkInput,
  GetParksInput,
  ParkDetailOutput,
  ParkOutput,
} from './dto/park.dto.js';
import { ParksRepository } from './parks.repository.js';

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
  constructor(
    private readonly parksRepository: ParksRepository,
  ) {}

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
}