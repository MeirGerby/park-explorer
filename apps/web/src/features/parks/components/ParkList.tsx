import { trpc } from "@/lib/trpc"
import { ParkFilters } from "./ParkFilters"
import { ParkGrid } from "./ParkGrid"
import { useParkFilters } from "../hooks/use-park-filter"

interface ParkListProps {
  limit?: number
}

export function ParkList({ limit }: ParkListProps) {
  const filters = useParkFilters()

  // Avoid running filters if used inside a limited context
  const { data: parks, isLoading, isError, error } = trpc.parks.getParks.useQuery({
    regionId: limit ? undefined : (filters.regionId || undefined),
    cityId: limit ? undefined : (filters.cityId || undefined),
  })

  const filteredParks = parks?.filter((park) => {
    if (limit) return true
    return park.name.toLowerCase().includes(filters.search.trim().toLowerCase())
  })

  // Slice list if limit property exists
  const displayedParks = limit ? filteredParks?.slice(0, limit) : filteredParks

  return (
    <div className="grid gap-4">
      {/* Hide management toolbars inside previews */}
      {!limit && (
        <ParkFilters
          search={filters.search}
          regionId={filters.regionId}
          cityId={filters.cityId}
          onSearchChange={filters.setSearch}
          onRegionChange={filters.handleRegionChange}
          onCityChange={filters.setCityId}
        />
      )}

      {isLoading && <div className="p-4 text-muted-foreground text-sm">Loading parks...</div>}

      {isError && (
        <div className="rounded-md border border-destructive/20 bg-destructive/5 p-4 text-destructive text-sm">
          <p className="font-semibold">Error loading parks</p>
          <p className="text-xs">{error.message}</p>
        </div>
      )}

      {!isLoading && !isError && displayedParks && displayedParks.length === 0 && (
        <div className="p-4 text-muted-foreground text-sm">No parks found.</div>
      )}

      {!isLoading && !isError && displayedParks && displayedParks.length > 0 && (
        <ParkGrid parks={displayedParks} />
      )}
    </div>
  )
}
