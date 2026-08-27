import { useEffect } from "react"
import { useMap } from "react-leaflet"

import { isLatLng } from "@/features/parks/lib/park-location"
import { parseParkPolygon } from "@/features/parks/lib/park-polygon"

type Park = {
  location: [number, number]
  polygon: string | null
}

type ParkMapViewportProps = {
  parks: Park[]
}

export function ParkMapViewport({
  parks,
}: ParkMapViewportProps) {
  const map = useMap()

  useEffect(() => {
    const bounds: [number, number][] = []

    for (const park of parks) {
      if (isLatLng(park.location)) {
        bounds.push(park.location)
      }

      const polygon = parseParkPolygon(park.polygon)

      if (polygon) {
        bounds.push(...polygon)
      }
    }

    if (bounds.length === 0) {
      return
    }

    map.fitBounds(bounds, {
      padding: [40, 40],
      maxZoom: 15,
    })
  }, [map, parks])

  return null
}