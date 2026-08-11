import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless"
import * as schema from './index'

export function createDatabaseClient(connectionString: string) {
    const pool = new Pool({ connectionString })
    return drizzle(pool, { schema})
}

export type Database = ReturnType<typeof createDatabaseClient>