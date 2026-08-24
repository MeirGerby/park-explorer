import { Link } from "react-router-dom";
import { ParkList } from "@/features/parks/components/ParkList";
import { RegionList } from "@/features/regions/components/RegionList";

export function HomePage() {
  return (
    <div className="space-y-12">
      <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="p-8 sm:p-12">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-primary">Park Explorer</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Explore the parks around you.
            </h1>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed">
              Discover parks, cities and regions, and find your next place to
              explore.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/parks"
                className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
              >
                Explore parks
              </Link>
              <Link
                to="/regions"
                className="rounded-md border bg-background px-5 py-2.5 text-sm font-medium shadow-sm transition-colors hover:bg-muted"
              >
                Browse regions
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded Dashboard Previews */}
      <section className="space-y-4">
        <div className="flex items-end justify-between border-b pb-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Recent Parks
            </h2>
            <p className="text-sm text-muted-foreground">
              Discover parks currently available.
            </p>
          </div>
          <Link
            to="/parks"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all parks →
          </Link>
        </div>
        <ParkList
          limit={3}
        />
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between border-b pb-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Active Regions
            </h2>
            <p className="text-sm text-muted-foreground">
              Explore local geographic systems.
            </p>
          </div>
          <Link
            to="/regions"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all regions →
          </Link>
        </div>
        <RegionList limit={3} />
      </section>
    </div>
  );
}
