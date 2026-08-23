import { CreateParkForm } from "@/features/parks/components/CreateParkForm"
import { ParkList } from "@/features/parks/components/ParkList"

export function ParksPage() {
  return (
    <div className="grid gap-8">
      <section>
        <p className="text-sm font-semibold text-primary">
          Explore
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Parks
        </h1>

        <p className="mt-2 max-w-2xl text-muted-foreground">
          Discover parks across different regions and cities.
        </p>
      </section>

      <ParkList />

      <details className="group rounded-xl border bg-card">
        <summary className="cursor-pointer list-none p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">
                Add a new park
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Create a park and assign it to a city.
              </p>
            </div>

            <span className="text-xl text-muted-foreground transition-transform group-open:rotate-45">
              +
            </span>
          </div>
        </summary>

        <div className="border-t p-6">
          <CreateParkForm />
        </div>
      </details>
    </div>
  )
}