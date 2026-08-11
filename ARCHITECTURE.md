
# Park Explorer — Architecture

## Overview

Park Explorer is a full-stack TypeScript application organized as a **Turborepo monorepo**.

The architecture separates the frontend, backend/application logic, and database infrastructure.

```text
park-explorer/
│
├── apps/
│   ├── web/                         # React + Vite
│   │   ├── src/
│   │   │   ├── app/
│   │   │   ├── components/
│   │   │   │   └── ui/              # shadcn/ui
│   │   │   └── ...
│   │   ├── index.html
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   └── api/                         # NestJS
│       ├── src/
│       │   ├── app/
│       │   ├── trpc/
│       │   │   ├── trpc.module.ts
│       │   │   ├── trpc.router.ts
│       │   │   └── procedures/
│       │   │       └── health.ts
│       │   └── main.ts
│       └── package.json
│
├── packages/
│   └── db/                          # Database infrastructure
│       ├── src/
│       │   ├── schema/
│       │   │   ├── users.ts
│       │   │   ├── regions.ts
│       │   │   ├── cities.ts
│       │   │   ├── parks.ts
│       │   │   └── park-images.ts
│       │   ├── relations/
│       │   ├── seed/
│       │   ├── client.ts
│       │   └── index.ts
│       ├── drizzle/
│       │   └── migrations/
│       └── package.json
│
├── package.json
├── turbo.json
├── tsconfig.json
├── .env
├── .gitignore
└── README.md
```

## Dependency Flow

```text
apps/web
    │
    │ tRPC
    ▼
apps/api
    │
    │ Database Provider
    ▼
packages/db
    │
    ▼
Neon PostgreSQL
```

Dependencies should flow in this direction.

The frontend must not access the database directly.

---

## `apps/web`

Responsible for:

* React UI
* User interactions
* tRPC client
* TanStack React Query
* Tailwind CSS
* shadcn/ui

The frontend communicates with the backend through tRPC.

---

## `apps/api`

Responsible for:

* NestJS application
* tRPC routers
* Application/business logic
* Services
* Repositories / Data Access
* Validation
* Authentication and authorization when introduced

The API is responsible for deciding **how the application uses the data**.

Conceptually:

```text
tRPC Router
     ↓
  Service
     ↓
Repository
     ↓
Database Provider
```

---

## `packages/db`

`packages/db` is a **database infrastructure package**.

It is responsible for:

* Drizzle schema
* Relations
* PostgreSQL/Drizzle client
* Migrations
* Seed data
* Database-related types

It should **not** contain:

* Services
* Controllers
* tRPC routers
* Business logic
* Application-specific repositories
* Authorization logic

The package defines **how the data is structured**, while `apps/api` defines **how the application uses that data**.

---

## Database Model

```text
Region
   │
   └── City
         │
         └── Park
               │
               └── ParkImage

User
   │
   └── Park
```

Relationships:

```text
Region 1 ──── N City
City   1 ──── N Park
User   1 ──── N Park
Park   1 ──── N ParkImage
```

`Park` does not contain `regionId`.

The region is resolved through:

```text
Park → City → Region
```

---

## Geographic Data

A park contains:

* **Location** — a geographic point associated with the park.
* **Polygon** — a GeoJSON geographic area associated with the park.

PostGIS is intentionally deferred to a later stage.

---

## Database Lifecycle

```text
Empty PostgreSQL
      ↓
Migrations
      ↓
Database Schema
      ↓
Seed
      ↓
Initial Development Data
```

Migrations define database structure.

Seed data creates initial development data such as Regions and Cities.

Both are part of the repository and should be reproducible on a fresh database.

---

## Core Architectural Principles

1. **Clear separation of responsibilities**
2. **Database infrastructure stays in `packages/db`**
3. **Business logic and data access stay in `apps/api`**
4. **Frontend communicates only through the API**
5. **Avoid duplicated API/database type definitions**
6. **Do not introduce abstractions before they are needed**
7. **Keep the architecture simple and evolve it with the application**
