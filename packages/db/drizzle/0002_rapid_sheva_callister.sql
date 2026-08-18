ALTER TABLE "users" ADD COLUMN "password_hash" text NOT NULL DEFAULT 'unusable-seed-placeholder';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password_hash" DROP DEFAULT;