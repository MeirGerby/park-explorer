import { Link, useParams } from "react-router-dom"

import { trpc } from "@/lib/trpc"
import { Map } from "@/components/map/Map"
import { isLatLng } from "@/features/parks/lib/park-location"

export function ParkMapPage() {
  const { id } = useParams<{ id: string }>()

  const {
    data: park,
    isLoading,
    isError,
    error,
  } = trpc.parks.getParkById.useQuery(
    { id: id ?? "" },
    {
      enabled: !!id,
      retry: false,
    },
  )

  if (isLoading) {
    return (
      <div className="p-4 text-muted-foreground">
        Loading map...
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-md border border-destructive/20 bg-destructive/5 p-4 text-destructive">
        <p className="font-semibold">
          Error loading park
        </p>

        <p className="text-sm">
          {error.message}
        </p>
      </div>
    )
  }

  if (!park || !isLatLng(park.location)) {
    return (
      <div className="p-4 text-muted-foreground">
        Park location not available.
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      <div>
        <Link
          to={`/parks/${park.id}`}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to park
        </Link>

        <h1 className="mt-3 text-2xl font-bold">
          {park.name}
        </h1>

        <p className="text-sm text-muted-foreground">
          {park.cityName}, {park.regionName}
        </p>
      </div>

      <Map
        center={[park.location[0], park.location[1]]}
        zoom={15}
      />
    </div>
  )
}