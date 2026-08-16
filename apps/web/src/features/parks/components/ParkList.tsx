import { trpc } from "@/lib/trpc"

export function ParkList() {
  const {
    data: parks,
    isLoading,
    isError,
    error,
  } = trpc.parks.getParks.useQuery()

  if (isLoading) {
    return <div className="p-4 text-gray-500">Loading parks...</div>
  }

  if (isError) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-600">
        <p className="font-semibold">Error loading parks</p>
        <p className="text-sm">{error.message}</p>
      </div>
    )
  }

  if (!parks || parks.length === 0) {
    return <div className="p-4 text-gray-500">No parks found.</div>
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {parks.map((park) => (
        <li
          key={park.id}
          className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
        >
          <h3 className="text-lg font-semibold text-gray-900">{park.name}</h3>
          <p className="mt-1 text-sm text-gray-600">
            {park.cityName}, {park.regionName}
          </p>
        </li>
      ))}
    </ul>
  )
}
