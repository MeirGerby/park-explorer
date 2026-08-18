import { Injectable } from '@nestjs/common';
import { RegionsRepository } from './regions.repository.js';
import type {
  CreateRegionInput,
  RegionDetailOutput,
  RegionOutput,
} from './dto/region.dto.js';

export class RegionNameTakenError extends Error {
  constructor(public readonly name: string) {
    super(`Region '${name}' already exists.`);
    this.name = 'RegionNameTakenError';
  }
}

@Injectable()
export class RegionsService {
  constructor(private readonly regionsRepository: RegionsRepository) {}

  async findAll(): Promise<RegionOutput[]> {
    return this.regionsRepository.findAll();
  }

  async findById(id: string): Promise<RegionDetailOutput | null> {
    return this.regionsRepository.findById(id);
  }

  async create(data: CreateRegionInput): Promise<RegionOutput> {
    return this.regionsRepository.create(data, {
      onNameTaken: () => {
        throw new RegionNameTakenError(data.name);
      },
    });
  }
}
