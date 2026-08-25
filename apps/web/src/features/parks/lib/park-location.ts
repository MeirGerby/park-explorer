export type LatLng = {
  lat: number
  lng: number
}

export function isLatLng(
  value: unknown,
): value is LatLng {
  if (typeof value !== "object" || value === null) {
    return false
  }

  const record = value as Record<string, unknown>

  return (
    typeof record.lat === "number" &&
    typeof record.lng === "number"
  )
}