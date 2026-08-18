import { pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { parks } from "./parks.js";

export const parkImages = pgTable("park_images", {
    id: uuid("id").defaultRandom().primaryKey(),

    parkId: uuid("park_id")
        .notNull()
        .references(() => parks.id, {
            onDelete: "cascade"
        }),

    url: text('url').notNull(),

    caption: text('caption'),

    createdAt: timestamp('created_at', {
        withTimezone: true
    }).defaultNow().notNull(),
}, (table) => [
    index('park_images_park_id_idx').on(table.parkId),
])
