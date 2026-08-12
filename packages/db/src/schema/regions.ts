import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core"

export const regions = pgTable('regions', {
    id: uuid('id').defaultRandom().primaryKey(),

    name: text('name').notNull().unique(),

    createdAt: timestamp('created_at', {
        withTimezone: true
    }).defaultNow().notNull(),
})
