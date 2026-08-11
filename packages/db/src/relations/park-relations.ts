import { relations } from 'drizzle-orm'
import { cities, parkImages, parks, users } from '../index'

export const parkRelations = relations(parks, ({ one, many }) => ({
    creator: one(users, {
        fields: [parks.creatorId],
        references: [users.id]
    }),

    city: one(cities, {
        fields: [parks.cityId],
        references: [cities.id]
    }),

    images: many(parkImages),
}))