import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE } from '../database/database.module';
import { type Database, parks, cities, regions } from '@park-explorer/db';
import { eq } from 'drizzle-orm';

@Injectable()
export class ParksService {
  constructor(@Inject(DRIZZLE) private readonly db: Database) {}

  async findAllParks() {
    return await this.db
      .select({
        id: parks.id,
        name: parks.name,
        cityName: cities.name,
        regionName: regions.name,
      })
      .from(parks)
      .innerJoin(cities, eq(parks.cityId, cities.id))
      .innerJoin(regions, eq(cities.regionId, regions.id));
  }

  async findParkById(id: string) {
    const results = await this.db
      .select({
        id: parks.id,
        name: parks.name,
        cityName: cities.name,
        regionName: regions.name,
      })
      .from(parks)
      .innerJoin(cities, eq(parks.cityId, cities.id))
      .innerJoin(regions, eq(cities.regionId, regions.id))
      .where(eq(parks.id, id))
      .limit(1);

    return results[0] ?? null;
  }
}
