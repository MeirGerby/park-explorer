import { defineConfig } from 'drizzle-kit'
import * as dotenv from 'dotenv'

dotenv.config({path: '../../.env'})

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is missing')
}

export default defineConfig({
    dialect: 'postgresql',
    schema: './src/schema/index.ts',
    out: './drizzle',
    dbCredentials: {
        url: process.env.DATABASE_URL
    }
})

