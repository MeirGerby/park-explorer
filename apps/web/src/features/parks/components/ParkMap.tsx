import { Link } from "react-router-dom"
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from "react-leaflet"

import { isLatLng } from "@/features/parks/lib/park-location"

import "leaflet/dist/leaflet.css"

type ParkMapProps = {
  parks: Array<{
    id: string
    name: string
    cityName: string
    location: unknown
  }>
}

const DEFAULT_CENTER: [number, number] = [
  31.7683,
  35.2137,
]

export function ParkMap({
  parks,
}: ParkMapProps) {
  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={8}
      scrollWheelZoom
      className="h-125 w-full"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {parks.map((park) => {
        if (!isLatLng(park.location)) {
          return null
        }

        return (
          <Marker
            key={park.id}
            position={[
              park.location.lat,
              park.location.lng,
            ]}
          >
            <Popup>
              <div className="grid gap-1">
                <p className="font-semibold">
                  {park.name}
                </p>

                <p className="text-sm text-muted-foreground">
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
        )
      })}
    </MapContainer>
  )
}