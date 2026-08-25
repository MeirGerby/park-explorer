import { Link } from "react-router-dom"
// Make sure 'polygon' function is NOT imported from "leaflet" here
import { Marker, Polygon, Popup } from "react-leaflet"
import L from "leaflet"

import { normalizeLatLng } from "@/features/parks/lib/park-location"
import { parseParkPolygon } from "@/features/parks/lib/park-polygon"

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png"
import markerIcon from "leaflet/dist/images/marker-icon.png"
import markerShadow from "leaflet/dist/images/marker-shadow.png"

const defaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

type ParkMapMarkerProps = {
  park: {
    id: string
    name: string
    cityName: string
    location: unknown
    polygon: unknown
  }
}

export function ParkMapMarker({ park }: ParkMapMarkerProps) {
  const position = normalizeLatLng(park.location)

  if (!position) {
    return null
  }

  // Rename variable to 'polygonPositions' to prevent shadowing
  const polygonPositions = parseParkPolygon(park.polygon)

  return (
    <>
      {polygonPositions && (
        <Polygon
          positions={polygonPositions}
          pathOptions={{ color: "#3388ff", weight: 2, fillOpacity: 0.2 }}
        />
      )}

      <Marker position={position} icon={defaultIcon}>
        <Popup>
          <div className="grid gap-1">
            <p className="font-semibold">{park.name}</p>
            <p className="text-sm">{park.cityName}</p>
            <Link
              to={`/parks/${park.id}`}
              className="text-sm text-primary hover:underline"
            >
              View park →
            </Link>
          </div>
        </Popup>
      </Marker>
    </>
  )
}