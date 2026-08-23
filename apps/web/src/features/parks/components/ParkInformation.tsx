type ParkInformationProps = {
  description?: string | null
  openedAt?: string | Date | null
}

export function ParkInformation({
  description,
  openedAt,
}: ParkInformationProps) {
  if (!description && !openedAt) {
    return null
  }

  return (
    <div className="grid gap-3">
      {description && (
        <p className="text-foreground">
          {description}
        </p>
      )}

      {openedAt && (
        <p className="text-sm text-muted-foreground">
          Opened {new Date(openedAt).toLocaleDateString()}
        </p>
      )}
    </div>
  )
}