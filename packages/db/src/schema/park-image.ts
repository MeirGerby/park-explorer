import { pgTable, uuid, text } from "drizzle-orm/pg-core";
import { park } from "./park";

export const parkImage = pgTable("park_image", {
    id: uuid("id").defaultRandom().primaryKey(),

    parkId: uuid("park_id")
        .notNull()
        .references(() => park.id, {
            onDelete: "cascade"
        }),

    url: text('url').notNull(),

})