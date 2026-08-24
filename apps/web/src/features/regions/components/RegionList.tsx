import { trpc } from "@/lib/trpc"

interface RegionListProps {
  limit?: number
}

export function RegionList({ limit }: RegionListProps) {
  const { data: regions, isLoading, isError, error } = trpc.regions.getRegions.useQuery()

  if (isLoading) return <div className="p-4 text-muted-foreground text-sm">Loading regions...</div>

  if (isError) {
    return (
      <div className="rounded-md border border-destructive/20 bg-destructive/5 p-4 text-destructive text-sm">
        <p className="font-semibold">Error loading regions</p>
        <p className="text-xs">{error.message}</p>
      </div>
    )
  }

  if (!regions || regions.length === 0) {
    return <div className="p-4 text-muted-foreground text-sm">No regions found.</div>
  }

  const displayedRegions = limit ? regions.slice(0, limit) : regions

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {displayedRegions.map((region) => (
        <li
          key={region.id}
          className="rounded-xl border bg-card p-4 text-card-foreground shadow-sm transition-all hover:shadow-md"
        >
          <h3 className="font-semibold tracking-tight text-foreground">{region.name}</h3>
        </li>
      ))}
    </ul>
  )
}
