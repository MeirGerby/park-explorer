import { pgTable, uuid, text, timestamp, jsonb } from "drizzle-orm/pg-core"
import { user } from "./user"
import { city } from "./city"


export const park = pgTable("parks", {
    id: uuid("id").defaultRandom().primaryKey(),

    name: text("name").notNull(),

    description: text("description"),

    creatorId: uuid("creator_id")
        .notNull()
        .references(() => user.id),

    openedAt: timestamp('opened_at', {
        withTimezone: true
    }),

    cityId: uuid("city_id")
        .notNull()
        .references(() => city.id),

    location: jsonb("location"),

    polygon: jsonb("polygon"),

    createdAt: timestamp("created_at", {
        withTimezone: true
    }).defaultNow().notNull(),

    updatedAt: timestamp("updated_at", {
        withTimezone: true,
    }).defaultNow().notNull()
})