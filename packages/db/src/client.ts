import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

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

export type Database = ReturnType<typeof createDatabaseClient>["db"];
export type DatabasePool = ReturnType<typeof createDatabaseClient>["pool"];