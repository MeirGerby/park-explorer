import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE } from '../database/database.module.js';
import {
  and,
  eq,
  type Database,
  parks,
  cities,
  regions,
  parkImages,
  users,
} from '@park-explorer/db';
import type {
  CreateParkInput,
  GetParksInput,
  ParkDetailOutput,
  ParkOutput,
} from './dto/park.dto.js';

const parkSelection = {
  id: parks.id,
  name: parks.name,
  description: parks.description,
  openedAt: parks.openedAt,
  location: parks.location,
  polygon: parks.polygon,
  cityName: cities.name,
  regionName: regions.name,
};

@Injectable()
export class ParksRepository {
  constructor(@Inject(DRIZZLE) private readonly db: Database) {}

  async findAll(params?: GetParksInput): Promise<ParkOutput[]> {
    const filters = [
      params?.cityId ? eq(parks.cityId, params.cityId) : undefined,
      params?.regionId ? eq(regions.id, params.regionId) : undefined,
    ].filter(
      (filter): filter is NonNullable<typeof filter> =>
        filter !== undefined,
    );

    return this.db
      .select(parkSelection)
      .from(parks)
      .innerJoin(cities, eq(parks.cityId, cities.id))
      .innerJoin(regions, eq(cities.regionId, regions.id))
      .where(filters.length > 0 ? and(...filters) : undefined);
  }

  async findById(id: string): Promise<ParkDetailOutput | null> {
    const [park] = await this.db
      .select(parkSelection)
      .from(parks)
      .innerJoin(cities, eq(parks.cityId, cities.id))
      .innerJoin(regions, eq(cities.regionId, regions.id))
      .where(eq(parks.id, id))
      .limit(1);

    if (!park) {
      return null;
    }

    const images = await this.db
      .select({
        id: parkImages.id,
        url: parkImages.url,
        caption: parkImages.caption,
      })
      .from(parkImages)
      .where(eq(parkImages.parkId, id));

    return {
      ...park,
      images,
    };
  }

  async create(
    data: CreateParkInput,
    handlers: {
      onCityNotFound: () => never;
      onCreatorNotFound: () => never;
    },
  ): Promise<ParkDetailOutput> {
    return this.db.transaction(async (tx) => {
      const [location] = await tx
        .select({
          cityName: cities.name,
          regionName: regions.name,
        })
        .from(cities)
        .innerJoin(regions, eq(cities.regionId, regions.id))
        .where(eq(cities.id, data.cityId))
        .limit(1);

      if (!location) {
        handlers.onCityNotFound();
      }

      const [creator] = await tx
        .select({ id: users.id })
        .from(users)
        .where(eq(users.id, data.creatorId))
        .limit(1);

      if (!creator) {
        handlers.onCreatorNotFound();
      }

      const [park] = await tx
        .insert(parks)
        .values({
          name: data.name,
          description: data.description,
          geometry: data.geometry,
          creatorId: data.creatorId,
          cityId: data.cityId,
        })
        .returning();

      const images = data.images?.length
        ? await tx
            .insert(parkImages)
            .values(
              data.images.map((image) => ({
                url: image.url,
                caption: image.caption,
                parkId: park.id,
              })),
            )
            .returning({
              id: parkImages.id,
              url: parkImages.url,
              caption: parkImages.caption,
            })
        : [];

      return {
        id: park.id,
        name: park.name,
        description: park.description,
        cityName: location.cityName,
        regionName: location.regionName,
        images,
      };
    });
  }
}