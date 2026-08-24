import { Link } from "react-router-dom"
import { ParkList } from "@/features/parks/components/ParkList"

export function ParksPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <section>
          <p className="text-sm font-semibold text-primary">Explore</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">Parks</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Discover parks across different regions and cities.
          </p>
        </section>

        <Link
          to="/parks/new"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/95"
        >
          + Add New Park
        </Link>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <ParkList />
      </div>
    </div>
  )
}
