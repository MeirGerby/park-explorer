import { trpc } from "@/lib/trpc"

export function RegionList() {
  const {
    data: regions,
    isLoading,
    isError,
    error,
  } = trpc.regions.getRegions.useQuery()

  if (isLoading) {
    return <div className="p-4 text-gray-500">Loading regions...</div>
  }

  if (isError) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-600">
        <p className="font-semibold">Error loading regions</p>
        <p className="text-sm">{error.message}</p>
      </div>
    )
  }

  if (!regions || regions.length === 0) {
    return <div className="p-4 text-gray-500">No regions found.</div>
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {regions.map((region) => (
        <li
          key={region.id}
          className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
        >
          <h3 className="text-lg font-semibold text-gray-900">{region.name}</h3>
        </li>
      ))}
    </ul>
  )
}
