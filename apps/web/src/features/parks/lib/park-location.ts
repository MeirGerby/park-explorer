import { type LatLngExpression } from "leaflet"

export function isLatLng(location: unknown): location is [number, number] {
  if (!location) return false

  // Handle [lat, lng] array format
  if (Array.isArray(location) && location.length === 2) {
    const lat = Number(location[0])
    const lng = Number(location[1])
    return !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
  }

  // Handle { lat, lng } or { latitude, longitude } object format
  if (typeof location === "object" && location !== null) {
    const loc = location as Record<string, unknown>
    const lat = Number(loc.lat ?? loc.latitude ?? loc.y)
    const lng = Number(loc.lng ?? loc.longitude ?? loc.x)
    return !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
  }

  return false
}

export function normalizeLatLng(location: unknown): [number, number] | null {
  if (!isLatLng(location)) return null

  if (Array.isArray(location)) {
    return [Number(location[0]), Number(location[1])]
  }

  const loc = location as Record<string, unknown>
  const lat = Number(loc.lat ?? loc.latitude ?? loc.y)
  const lng = Number(loc.lng ?? loc.longitude ?? loc.x)
  return [lat, lng]
}