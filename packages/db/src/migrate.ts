import "dotenv/config";
import { migrate } from "drizzle-orm/neon-serverless/migrator";
import { db, pool } from "./client";

async function runMigrations() {
  console.log("Running migrations...");

  await migrate(db, { migrationsFolder: "./drizzle" });

  console.log("Migrations completed successfully!");
}

runMigrations()
  .catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
