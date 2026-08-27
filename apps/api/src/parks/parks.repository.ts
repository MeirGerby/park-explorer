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
  UpdateParkInput
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
      (filter): filter is NonNullable<typeof filter> => filter !== undefined,
    );

    const result = await this.db
      .select(parkSelection)
      .from(parks)
      .innerJoin(cities, eq(parks.cityId, cities.id))
      .innerJoin(regions, eq(cities.regionId, regions.id))
      .where(filters.length > 0 ? and(...filters) : undefined);

    return result as unknown as ParkOutput[];
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
    } as unknown as ParkDetailOutput;
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
          openedAt: data.openedAt,
          cityId: data.cityId,
          location: data.location,
          polygon: data.polygon,
          creatorId: data.creatorId,
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
        openedAt: park.openedAt,
        location: park.location,
        polygon: park.polygon,
        cityName: location.cityName,
        regionName: location.regionName,
        images,
      } as unknown as ParkDetailOutput;
    });
  }
  async update(
    id: string,
    data: UpdateParkInput,
    handlers: {
      onParkNotFound: () => never;
      onCityNotFound: () => never;
    },
  ): Promise<ParkDetailOutput> {
    return this.db.transaction(async (tx) => {
      const [existingPark] = await tx
        .select({ id: parks.id, cityId: parks.cityId })
        .from(parks)
        .where(eq(parks.id, id))
        .limit(1);

      if (!existingPark) {
        handlers.onParkNotFound();
      }

      const tragetCityId = data.cityId ?? existingPark.cityId;
      const [location] = await tx
        .select({
          cityName: cities.name,
          regionName: regions.name,
        })
        .from(cities)
        .innerJoin(regions, eq(cities.regionId, regions.id))
        .where(eq(cities.id, tragetCityId))
        .limit(1);

      if (!location) {
        handlers.onCityNotFound();
      }

      const [updatedPark] = await tx
        .update(parks)
        .set({
          name: data.name,
          description: data.description,
          openedAt: data.openedAt,
          cityId: data.cityId,
          location: data.location,
          polygon: data.polygon,
        })
        .where(eq(parks.id, id))
        .returning();

      let images = await tx
        .select({
          id: parkImages.id,
          url: parkImages.url,
          caption: parkImages.caption,
        })
        .from(parkImages)
        .where(eq(parkImages.parkId, id));

      if (data.images !== undefined) {
        await tx.delete(parkImages).where(eq(parkImages.parkId, id));

        images = data.images.length
          ? await tx
              .insert(parkImages)
              .values(
                data.images.map((image) => ({
                  url: image.url,
                  caption: image.caption,
                  parkId: id,
                })),
              )
              .returning({
                id: parkImages.id,
                url: parkImages.url,
                caption: parkImages.caption,
              })
          : [];
      }

      return {
        id: updatedPark.id,
        name: updatedPark.name,
        description: updatedPark.description,
        openedAt: updatedPark.openedAt,
        location: updatedPark.location,
        polygon: updatedPark.polygon,
        cityName: location.cityName,
        regionName: location.regionName,
        images,
      } as unknown as ParkDetailOutput;
    });
  }

  async remove(id: string): Promise<{ success: boolean }> {
    await this.db.delete(parkImages).where(eq(parkImages.parkId, id));

    const result = await this.db
      .delete(parks)
      .where(eq(parks.id, id))
      .returning({ id: parks.id });

    return { success: result.length > 0 };
  }
}
