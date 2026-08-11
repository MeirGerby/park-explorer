import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

export const regions = pgTable('region', {
    id: uuid('id').defaultRandom().primaryKey(),

    name: text().notNull(),
})