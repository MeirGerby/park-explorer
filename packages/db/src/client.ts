import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import "dotenv/config";

export function createDatabaseClient(connectionString: string) {
  const pool = new Pool({
    connectionString,
  });

  const db = drizzle({
    client: pool,
  });

  return {
    db,
    pool,
  };
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is required for seeding.");
}

export const { db, pool } = createDatabaseClient(
  connectionString ?? "",
);

export type Database = ReturnType<typeof createDatabaseClient>["db"];
export type DatabasePool = ReturnType<typeof createDatabaseClient>["pool"];
