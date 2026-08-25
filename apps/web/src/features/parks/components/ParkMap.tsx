import {
  MapContainer,
  TileLayer,
} from "react-leaflet"

import { ParkMapMarker } from "./ParkMapMarker"

import "leaflet/dist/leaflet.css"

type Park = {
  id: string
  name: string
  cityName: string
  location: [number, number]
  polygon: string | null
}

type ParkMapProps = {
  parks: Park[]
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

      {parks.map((park) => (
        <ParkMapMarker
          key={park.id}
          park={park}
        />
      ))}
    </MapContainer>
  )
}