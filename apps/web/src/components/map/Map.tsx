import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from "react-leaflet"

import "leaflet/dist/leaflet.css"

type MapProps = {
  center: [number, number]
  zoom?: number
}

export function Map({
  center,
  zoom = 15,
}: MapProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom
      className="h-105 w-full rounded-xl"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={center}>
        <Popup>Park location</Popup>
      </Marker>
    </MapContainer>
  )
}