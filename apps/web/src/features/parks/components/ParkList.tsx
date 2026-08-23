import { trpc } from "@/lib/trpc"
import { ParkFilters } from "./ParkFilters"
import { ParkGrid } from "./ParkGrid"
import { useParkFilters } from "../hooks/use-park-filter"

export function ParkList() {
  const filters = useParkFilters()

  const {
    data: parks,
    isLoading,
    isError,
    error,
  } = trpc.parks.getParks.useQuery({
    regionId: filters.regionId || undefined,
    cityId: filters.cityId || undefined,
  })

  const filteredParks = parks?.filter((park) =>
    park.name
      .toLowerCase()
      .includes(filters.search.trim().toLowerCase()),
  )

  return (
    <div className="grid gap-4">
      <ParkFilters
        search={filters.search}
        regionId={filters.regionId}
        cityId={filters.cityId}
        onSearchChange={filters.setSearch}
        onRegionChange={filters.handleRegionChange}
        onCityChange={filters.setCityId}
      />

      {isLoading && (
        <div className="p-4 text-muted-foreground">
          Loading parks...
        </div>
      )}

      {isError && (
        <div className="rounded-md border border-destructive/20 bg-destructive/5 p-4 text-destructive">
          <p className="font-semibold">Error loading parks</p>
          <p className="text-sm">{error.message}</p>
        </div>
      )}

      {!isLoading &&
        !isError &&
        filteredParks &&
        filteredParks.length === 0 && (
          <div className="p-4 text-muted-foreground">
            No parks found.
          </div>
        )}

      {!isLoading &&
        !isError &&
        filteredParks &&
        filteredParks.length > 0 && (
          <ParkGrid parks={filteredParks} />
        )}
    </div>
  )
}