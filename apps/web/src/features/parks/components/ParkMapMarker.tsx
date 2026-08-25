import { Link } from "react-router-dom"
import {
  Marker,
  Polygon,
  Popup,
} from "react-leaflet"

import { isLatLng } from "@/features/parks/lib/park-location"
import { parseParkPolygon } from "@/features/parks/lib/park-polygon"

type ParkMapMarkerProps = {
  park: {
    id: string
    name: string
    cityName: string
    location: [number, number]
    polygon: string | null
  }
}

export function ParkMapMarker({
  park,
}: ParkMapMarkerProps) {
  if (!isLatLng(park.location)) {
    return null
  }

  const polygon = parseParkPolygon(
    park.polygon,
  )

  return (
    <>
      <Marker position={park.location}>
        <Popup>
          <div className="grid gap-1">
            <p className="font-semibold">
              {park.name}
            </p>

            <p className="text-sm">
              {park.cityName}
            </p>

            <Link
              to={`/parks/${park.id}`}
              className="text-sm text-primary hover:underline"
            >
              View park →
            </Link>
          </div>
        </Popup>
      </Marker>

      {polygon && (
        <Polygon positions={polygon} />
      )}
    </>
  )
}