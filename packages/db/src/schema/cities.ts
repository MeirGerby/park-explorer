import { pgTable, uuid, text } from "drizzle-orm/pg-core";
import { regions } from './regions'


export const cities = pgTable('cities', {
    id: uuid('id').defaultRandom().primaryKey(),

    name: text('name').notNull(),

    regionId: uuid('id')
        .notNull()
        .references(() => regions.id)
})