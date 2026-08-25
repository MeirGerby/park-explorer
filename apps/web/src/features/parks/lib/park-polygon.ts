export type ParkPolygon = [number, number][]

export function parseParkPolygon(
  value: unknown,
): ParkPolygon | null {
  if (typeof value !== "string") {
    return null
  }

  const match = value.match(
    /^POLYGON\s*\(\((.+)\)\)$/i,
  )

  if (!match) {
    return null
  }

  const coordinates = match[1]
    .split(",")
    .map((coordinate) => {
      const [lng, lat] = coordinate
        .trim()
        .split(/\s+/)
        .map(Number)

      if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lng)
      ) {
        return null
      }

      // WKT: [lng, lat]
      // Leaflet: [lat, lng]
      return [lat, lng] as [number, number]
    })

  if (coordinates.some((coordinate) => coordinate === null)) {
    return null
  }

  return coordinates as ParkPolygon
}