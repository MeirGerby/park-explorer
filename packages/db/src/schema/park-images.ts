import { pgTable, uuid, text } from "drizzle-orm/pg-core";
import { parks } from "./parks.js";

export const parkImages = pgTable("park_images", {
    id: uuid("id").defaultRandom().primaryKey(),

    parkId: uuid("park_id")
        .notNull()
        .references(() => parks.id, {
            onDelete: "cascade"
        }),

    url: text('url').notNull(),

})