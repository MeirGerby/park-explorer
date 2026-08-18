import { Link, useParams } from "react-router-dom"

import { trpc } from "@/lib/trpc"

export function ParkDetailPage() {
  const { id } = useParams<{ id: string }>()

  const {
    data: park,
    isLoading,
    isError,
    error,
  } = trpc.parks.getParkById.useQuery(
    { id: id ?? "" },
    { enabled: !!id, retry: false }
  )

  return (
    <div className="grid gap-4">
      <Link to="/" className="text-sm text-primary hover:underline">
        ← Back to parks
      </Link>

      {isLoading && <div className="p-4 text-gray-500">Loading park...</div>}

      {isError && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-600">
          <p className="font-semibold">Error loading park</p>
          <p className="text-sm">{error.message}</p>
        </div>
      )}

      {park && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900">{park.name}</h2>
          <p className="mt-1 text-sm text-gray-600">
            {park.cityName}, {park.regionName}
          </p>

          {park.description && <p className="mt-4 text-gray-800">{park.description}</p>}

          {park.openedAt && (
            <p className="mt-4 text-sm text-gray-600">
              Opened {new Date(park.openedAt).toLocaleDateString()}
            </p>
          )}

          {park.images.length > 0 && (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {park.images.map((image) => (
                <img
                  key={image.id}
                  src={image.url}
                  alt={image.caption ?? park.name}
                  className="w-full rounded-md object-cover"
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
