import { Link } from "react-router-dom"

import { ParkList } from "@/features/parks/components/ParkList"
import { RegionList } from "@/features/regions/components/RegionList"

export function HomePage() {
  return (
    <div className="grid gap-12">
      <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="p-8 sm:p-10">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-primary">
              Park Explorer
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              Explore the parks around you.
            </h1>

            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              Discover parks, cities and regions, and find
              your next place to explore.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/parks"
                className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Explore parks
              </Link>

              <Link
                to="/regions"
                className="rounded-md border bg-background px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
              >
                Browse regions
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Parks
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Discover parks currently available.
            </p>
          </div>

          <Link
            to="/parks"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all →
          </Link>
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Regions
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Explore parks by region.
            </p>
          </div>

          <Link
            to="/regions"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all →
          </Link>
        </div>

        {/* <RegionList /> */}
      </section>
    </div>
  )
}