import { relations } from 'drizzle-orm'
import { cities, regions } from '../index'

export const regionRelations = relations(regions, ({ many }) => ({
    cities: many(cities)
}))