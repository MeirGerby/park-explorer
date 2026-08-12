import "dotenv/config";
import { migrate } from "drizzle-orm/neon-serverless/migrator";
import { getDatabaseConnection } from "./client";

const connectionString = process.env.DATABASE_URL
const { db, pool } = getDatabaseConnection(connectionString)

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
