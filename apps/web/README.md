# Park Explorer — Web

React + Vite frontend for Park Explorer. Talks to `apps/api` exclusively through tRPC — it never accesses the database directly.

## Stack

- React 19, TypeScript, Vite
- TanStack Query — server state (data fetched via tRPC)
- Zustand — client/UI state only (map viewport, selected park, filters, etc.), never server data
- Zod — runtime validation
- tRPC client (`@trpc/client`, `@trpc/react-query`)
- Tailwind CSS + shadcn/ui
- React Leaflet — map rendering

## Getting started

Run from the repo root (this workspace depends on `apps/api`'s compiled types, so pnpm/turbo need the monorepo context):

```bash
pnpm install
pnpm --filter web dev
```

The dev server runs at http://localhost:5173.

By default it calls the API at `http://localhost:3000/trpc`. Override this with a `VITE_API_URL` env var (e.g. `apps/web/.env.local`) if the API runs elsewhere:

```bash
VITE_API_URL=http://localhost:3000/trpc
```

## Scripts

| Script          | Description                                  |
| ---------------- | --------------------------------------------- |
| `pnpm dev`       | Start the Vite dev server                     |
| `pnpm build`     | Type-check (`tsc -b`) then build for production |
| `pnpm lint`      | Run ESLint                                    |
| `pnpm preview`   | Preview the production build locally          |

Run any of these from the repo root as `pnpm --filter web <script>`.

## Folder structure

```text
src/
├── app/            App-level setup (providers, routing shell)
├── components/     Shared, generic UI (components/ui = shadcn/ui) and map primitives
├── features/       Feature-oriented modules (auth, parks, regions) — components, hooks, and
│                   feature-local logic grouped by domain rather than by file type
├── hooks/          Shared, non-feature-specific hooks
├── lib/            Cross-cutting utilities (e.g. the tRPC client setup)
└── pages/          Route-level page components
```

New UI work should generally live under `features/<domain>/` if it's tied to a specific domain (parks, regions, auth), or `components/` if it's generic and reusable across features.

## Type-sharing with the API

`src/lib/trpc.ts` imports the `AppRouter` type from `apps/api`'s **compiled** output (`apps/api/dist/@generated/server.d.ts`), not its raw source. This keeps each app's TypeScript compiler options independent — `apps/web` never needs to parse NestJS decorator syntax. Because of this, `apps/api` must be built at least once before `apps/web` type-checks; Turborepo's task graph (via the `api` devDependency in this package's `package.json`) handles that ordering automatically for `pnpm build` / `pnpm --filter web build`.
