# Park Explorer

A full-stack TypeScript app for exploring parks and their geographic boundaries. Built as a learning project covering React, tRPC, NestJS, Drizzle ORM, and PostgreSQL in a Turborepo monorepo.

See [ARCHITECTURE.md](ARCHITECTURE.md) for the full architectural breakdown (dependency flow, database model, layering rules).

## Stack

| Layer    | Technology                                                   |
| -------- | ------------------------------------------------------------- |
| Frontend | React, Vite, TanStack Query, Zustand, Zod, tRPC client, Tailwind CSS, shadcn/ui |
| Backend  | NestJS, tRPC (`nestjs-trpc`), Zod                              |
| Database | PostgreSQL, Drizzle ORM, drizzle-kit                           |

## Monorepo layout

```text
apps/
  web/          React + Vite frontend      → apps/web/README.md
  api/          NestJS + tRPC backend      → apps/api/README.md
packages/
  db/           Drizzle schema, client, migrations, seed → packages/db/README.md
```

Managed with **Turborepo** + **pnpm workspaces**.

## Prerequisites

- Node.js >= 18
- [pnpm](https://pnpm.io) (version pinned via `packageManager` in [package.json](package.json) — run `corepack enable` and pnpm will resolve to the right version automatically)
- A PostgreSQL database — either a [Neon](https://neon.tech) connection string, or the local Postgres container from `docker-compose.yml` (see below)

## Getting started

```bash
pnpm install
```

Create a `.env` file at the repo root with your database connection string:

```bash
DATABASE_URL='postgresql://user:password@host/dbname'
```

Then set up the database and start everything in dev mode:

```bash
pnpm --filter @park-explorer/db db:migrate   # run migrations
pnpm --filter @park-explorer/db db:seed      # optional: seed sample data
pnpm dev                                     # runs apps/web + apps/api via turbo
```

- Web: http://localhost:5173
- API: http://localhost:3000

## Root scripts

| Script              | Description                                    |
| -------------------- | ----------------------------------------------- |
| `pnpm dev`           | Run all apps in dev/watch mode (via turbo)      |
| `pnpm build`         | Build all apps/packages (via turbo)             |
| `pnpm lint`          | Lint all apps/packages (via turbo)              |
| `pnpm check-types`   | Type-check all apps/packages (via turbo)        |
| `pnpm format`        | Format the repo with Prettier                   |

Each workspace also has its own scripts — see [apps/web/README.md](apps/web/README.md), [apps/api/README.md](apps/api/README.md), and [packages/db/README.md](packages/db/README.md).

## Running with Docker Compose

`docker-compose.yml` runs the whole stack — `web`, `api`, and a local `postgres` container — instead of Neon, useful for a clean local environment with no external dependencies.

```bash
docker compose up -d --build
```

This will:

1. Start `postgres` (local Postgres 16, credentials/db name `park_explorer`).
2. Run the `migrate` service once against it (`packages/db`'s `db:migrate`, via `tsx`).
3. Start `api` on port `3000`.
4. Start `web` on port `8080`, served by nginx, which reverse-proxies `/trpc` to `api` internally (so the browser only ever talks to one origin — no CORS to configure).

To seed sample data into the Dockerized database:

```bash
docker compose run --rm migrate node_modules/.bin/tsx src/seed/index.ts
```

Stop everything with `docker compose down` (add `-v` to also drop the Postgres volume).

Note: the `.env` file (used for local `pnpm dev` against Neon) and the Docker Compose `DATABASE_URL` are independent — Compose sets its own environment variables pointing at the `postgres` service, so the two setups don't conflict.
