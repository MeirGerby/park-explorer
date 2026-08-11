import { text, uuid } from "drizzle-orm/cockroach-core";
import { pgTable } from "drizzle-orm/pg-core";
import { region } from './region'


export const city = pgTable('city', {
    id: uuid('id').defaultRandom().primaryKey(),

    name: text('name').notNull(),

    regionId: uuid('id')
        .notNull()
        .references(() => region.id)
})