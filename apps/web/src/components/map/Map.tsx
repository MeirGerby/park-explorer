import { MapContainer, TileLayer } from "react-leaflet"
import "leaflet/dist/leaflet.css"

const DEFAULT_CENTER: [number, number] = [31.7683, 35.2137]

type MapProps = {
  center?: [number, number] | null
  zoom?: number
  children?: React.ReactNode
}

export function Map({ center, zoom = 8, children }: MapProps) {
  // Guarantee center is never undefined or invalid
  const mapCenter: [number, number] = 
    Array.isArray(center) && center.length === 2 && typeof center[0] === "number" && typeof center[1] === "number"
      ? center
      : DEFAULT_CENTER

  return (
    <MapContainer
      center={mapCenter}
      zoom={zoom}
      scrollWheelZoom
      className="h-125 w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {children}
    </MapContainer>
  )
}