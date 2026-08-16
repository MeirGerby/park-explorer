import { pgTable, uuid, text, timestamp, jsonb } from "drizzle-orm/pg-core"
import { users } from "./users.js"
import { cities } from "./cities.js"


export const parks = pgTable("parks", {
    id: uuid("id").defaultRandom().primaryKey(),

    name: text("name").notNull(),

    description: text("description"),

    creatorId: uuid("creator_id")
        .notNull()
        .references(() => users.id),

    openedAt: timestamp('opened_at', {
        withTimezone: true
    }),

    cityId: uuid("city_id")
        .notNull()
        .references(() => cities.id),

    location: jsonb("location"),

    polygon: jsonb("polygon"),

    createdAt: timestamp("created_at", {
        withTimezone: true
    }).defaultNow().notNull(),

    updatedAt: timestamp("updated_at", {
        withTimezone: true,
    }).defaultNow().notNull()
})