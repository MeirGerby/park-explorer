import { pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { regions } from './regions.js'


export const cities = pgTable('cities', {
    id: uuid('id').defaultRandom().primaryKey(),

    name: text('name').notNull(),

    regionId: uuid('region_id')
        .notNull()
        .references(() => regions.id),

    createdAt: timestamp('created_at', {
        withTimezone: true
    }).defaultNow().notNull(),
}, (table) => [
    index('cities_region_id_idx').on(table.regionId),
])
