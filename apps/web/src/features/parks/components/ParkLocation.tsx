import { Link } from "react-router-dom"

import { isLatLng } from "@/features/parks/lib/park-location"

type ParkLocationProps = {
  location: unknown
  parkId: string
  className?: string
}

export function ParkLocation({
  location,
  parkId,
  className,
}: ParkLocationProps) {
  if (!isLatLng(location)) {
    return null
  }

  return (
    <section className={className}>
      <Link
        to={`/parks/${parkId}/map`}
        className="inline-flex text-sm text-primary hover:underline"
      >
        View location on map →
      </Link>
    </section>
  )
}