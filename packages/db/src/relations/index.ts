
import { relations } from "drizzle-orm";
import { users, regions, cities, parks, parkImages } from "../index"

export const userRelations = relations(users, ({ many }) => ({
  parks: many(parks),
}));

export const regionRelations = relations(regions, ({ many }) => ({
  cities: many(cities),
}));

export const cityRelations = relations(cities, ({ one, many }) => ({
  region: one(regions, {
    fields: [cities.regionId],
    references: [regions.id],
  }),

  parks: many(parks),
}));

export const parkRelations = relations(parks, ({ one, many }) => ({
  creator: one(users, {
    fields: [parks.creatorId],
    references: [users.id],
  }),

  city: one(cities, {
    fields: [parks.cityId],
    references: [cities.id],
  }),

  images: many(parkImages),
}));

export const parkImageRelations = relations(
  parkImages,
  ({ one }) => ({
    park: one(parks, {
      fields: [parkImages.parkId],
      references: [parks.id],
    }),
  }),
);