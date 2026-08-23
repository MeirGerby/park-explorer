import { Link } from "react-router-dom"

type ParkHeaderProps = {
  name: string
  cityName: string
  regionName: string
  id: string
}

export function ParkHeader({
  name,
  cityName,
  regionName,
  id,
}: ParkHeaderProps) {
  return (
    <div>
      <Link
        to="/"
        className="text-sm text-primary hover:underline"
      >
        ← Back to parks
      </Link>

      <div className="mt-4">
        <h1 className="text-3xl font-bold text-foreground">
          {name}
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          {cityName}, {regionName}
        </p>

        <p className="mt-1 font-mono text-xs text-muted-foreground">
          {id}
        </p>
      </div>
    </div>
  )
}