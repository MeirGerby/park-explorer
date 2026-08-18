import { Inject, Injectable } from '@nestjs/common';
import { eq, type Database, regions, cities } from '@park-explorer/db';
import { DRIZZLE } from '../database/database.module.js';

@Injectable()
export class RegionsRepository {
  constructor(@Inject(DRIZZLE) private readonly db: Database) {}

  async findAll() {
    return this.db.select().from(regions);
  }

  async findById(id: string) {
    const [region] = await this.db
      .select()
      .from(regions)
      .where(eq(regions.id, id))
      .limit(1);

    if (!region) {
      return null;
    }

    const regionCities = await this.db
      .select({ id: cities.id, name: cities.name })
      .from(cities)
      .where(eq(cities.regionId, id));

    return { ...region, cities: regionCities };
  }

  async create(
    data: { name: string },
    handlers: { onNameTaken: () => never },
  ) {
    const [existing] = await this.db
      .select({ id: regions.id })
      .from(regions)
      .where(eq(regions.name, data.name))
      .limit(1);

    if (existing) {
      handlers.onNameTaken();
    }

    const [region] = await this.db.insert(regions).values(data).returning();

    return region;
  }
}
