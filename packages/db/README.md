# @park-explorer/db

Database infrastructure package: Drizzle ORM schema, the PostgreSQL client, migrations, and seed data. Shared by `apps/api` — it is **not** a NestJS package and has no dependency on NestJS, so it stays independently usable and testable.

This package defines **how the data is structured**. `apps/api` decides **how the application uses it** (services, business rules, authorization). See [ARCHITECTURE.md](../../ARCHITECTURE.md) for the full picture.

## What lives here

```text
src/
├── schema/       Drizzle table definitions (users, regions, cities, parks, park-images)
├── relations/    Drizzle relations between tables
├── seed/         Seed script — creates initial regions/cities/users/parks for local dev
├── client.ts     createDatabaseClient / getDatabaseConnection — the Drizzle + pg client
├── migrate.ts    Runs pending migrations against DATABASE_URL
└── index.ts      Public exports: schema, client, and re-exported drizzle-orm helpers
drizzle/          Generated SQL migration files (drizzle-kit output — do not hand-edit)
```

## Database driver

The client uses `pg` (`node-postgres`) via `drizzle-orm/node-postgres`, not `@neondatabase/serverless`. `apps/api` is a long-running NestJS server, not an edge/serverless function, so a standard TCP driver is the correct fit — it works identically against a local Postgres container and against Neon (Neon accepts normal TCP connections in addition to its HTTP/WebSocket proxy).

## Environment

Requires a `DATABASE_URL` in the repo-root `.env` (or in the environment, e.g. set by `docker-compose.yml` for the containerized setup):

```bash
DATABASE_URL='postgresql://user:password@host/dbname'
```

## Scripts

Run these from the repo root as `pnpm --filter @park-explorer/db <script>`, or `cd packages/db && pnpm <script>`.

| Script          | Description                                                        |
| ---------------- | ------------------------------------------------------------------- |
| `pnpm build`     | Compile to `dist/` (excludes `migrate.ts` and `seed/` — see below) |
| `pnpm db:generate` | Build, then generate a new migration from schema changes (`drizzle-kit generate`) |
| `pnpm db:migrate`  | Run pending migrations against `DATABASE_URL` (via `tsx`, no build needed) |
| `pnpm db:push`     | Build, then push the schema directly to the database, skipping migration files (`drizzle-kit push`) |
| `pnpm db:studio`   | Build, then launch Drizzle Studio (`drizzle-kit studio`)            |
| `pnpm db:seed`     | Seed regions, cities, a placeholder user, and sample parks (via `tsx`) |

`migrate.ts` and `seed/` are intentionally excluded from the `tsc` build output (`tsconfig.build.json`) and always run straight through `tsx` — they're maintenance scripts, not part of the package's public API.

## Migration workflow

```text
schema change in src/schema/
        ↓
pnpm db:generate        (writes a new file under drizzle/)
        ↓
review the generated SQL
        ↓
pnpm db:migrate          (applies it to the database)
```

Migrations are generated artifacts and should not be hand-edited. Seed data (`db:seed`) is separate from migrations and only creates development data — it uses `onConflictDoNothing`/existence checks so it's safe to re-run against a non-empty database.

## Usage from apps/api

```ts
import { getDatabaseConnection, parks, eq } from '@park-explorer/db'

const { db, pool } = getDatabaseConnection(connectionString)
const results = await db.select().from(parks).where(eq(parks.id, id))
```

In practice, `apps/api`'s `DatabaseModule` constructs this connection once (from `DATABASE_URL` via `ConfigService`) and provides `Database`/`DatabasePool` for injection — see `apps/api/src/database/database.module.ts`.
