function isLatLng(
  value: unknown,
): value is { lat: number; lng: number } {
  if (typeof value !== "object" || value === null) {
    return false
  }

  const record = value as Record<string, unknown>

  return (
    typeof record.lat === "number" &&
    typeof record.lng === "number"
  )
}

type ParkLocationProps = {
  location: unknown
}

export function ParkLocation({
  location,
}: ParkLocationProps) {
  if (!isLatLng(location)) {
    return null
  }

  return (
    <div className="grid gap-2">
      <h2 className="text-sm font-semibold text-foreground">
        Location
      </h2>

      <p className="text-sm text-muted-foreground">
        {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
      </p>

      <a
        href={`https://www.google.com/maps?q=${location.lat},${location.lng}`}
        target="_blank"
        rel="noreferrer"
        className="w-fit text-sm text-primary hover:underline"
      >
        View on map →
      </a>
    </div>
  )
}