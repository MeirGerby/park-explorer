import { CreateRegionForm } from "@/features/regions/components/CreateRegionForm"
import { RegionList } from "@/features/regions/components/RegionList"

export function RegionsPage() {
  return (
    <div className="grid gap-8">
      <section>
        <p className="text-sm font-semibold text-primary">
          Explore
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Regions
        </h1>

        <p className="mt-2 max-w-2xl text-muted-foreground">
          Browse regions and discover the parks within them.
        </p>
      </section>

      <RegionList />

      <details className="group rounded-xl border bg-card">
        <summary className="cursor-pointer list-none p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">
                Add a new region
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Create a region to organize cities and parks.
              </p>
            </div>

            <span className="text-xl text-muted-foreground transition-transform group-open:rotate-45">
              +
            </span>
          </div>
        </summary>

        <div className="border-t p-6">
          <CreateRegionForm />
        </div>
      </details>
    </div>
  )
}