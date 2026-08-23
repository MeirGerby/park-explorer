type ParkBoundaryProps = {
  polygon: unknown
}

export function ParkBoundary({
  polygon,
}: ParkBoundaryProps) {
  if (polygon == null) {
    return null
  }

  return (
    <div className="grid gap-2">
      <h2 className="text-sm font-semibold text-foreground">
        Boundary
      </h2>

      <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs text-muted-foreground">
        {JSON.stringify(polygon, null, 2)}
      </pre>
    </div>
  )
}