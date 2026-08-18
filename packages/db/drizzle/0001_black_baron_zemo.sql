ALTER TABLE "cities" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "regions" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "park_images" ADD COLUMN "caption" text;--> statement-breakpoint
ALTER TABLE "park_images" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
CREATE INDEX "cities_region_id_idx" ON "cities" USING btree ("region_id");--> statement-breakpoint
CREATE INDEX "park_images_park_id_idx" ON "park_images" USING btree ("park_id");--> statement-breakpoint
ALTER TABLE "regions" ADD CONSTRAINT "regions_name_unique" UNIQUE("name");