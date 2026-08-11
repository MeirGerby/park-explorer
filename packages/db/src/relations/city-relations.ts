import { relations } from 'drizzle-orm'
import { cities, regions, parks } from '../index'

export const cityRelations = relations(cities, ({ one, many }) => ({
    region: one(regions, {
        fields: [cities.regionId],
        references: [regions.id],
    }),

    parks: many(parks)
}))