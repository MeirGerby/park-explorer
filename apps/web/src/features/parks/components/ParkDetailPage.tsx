import { Link, useParams } from "react-router-dom";

import { trpc } from "@/lib/trpc";

function isLatLng(value: unknown): value is { lat: number; lng: number } {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;
  return typeof record.lat === "number" && typeof record.lng === "number";
}

export function ParkDetailPage() {
  const { id } = useParams<{ id: string }>();

  const {
    data: park,
    isLoading,
    isError,
    error,
  } = trpc.parks.getParkById.useQuery(
    { id: id ?? "" },
    { enabled: !!id, retry: false },
  );

  const location = isLatLng(park?.location) ? park.location : null;

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
          <p className="mt-1 font-mono text-xs text-gray-400">{park.id}</p>

          {park.description && (
            <p className="mt-4 text-gray-800">{park.description}</p>
          )}

          {park.openedAt && (
            <p className="mt-4 text-sm text-gray-600">
              Opened {new Date(park.openedAt).toLocaleDateString()}
            </p>
          )}

          {location && (
            <p className="mt-4 text-sm text-gray-600">
              Location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}{" "}
              <a
                href={`https://www.google.com/maps?q=${location.lat},${location.lng}`}
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline"
              >
                (view on map)
              </a>
            </p>
          )}

          {park.polygon != null && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700">Boundary</p>
              <pre className="mt-1 overflow-x-auto rounded-md bg-gray-50 p-3 text-xs text-gray-700">
                {JSON.stringify(park.polygon, null, 2)}
              </pre>
            </div>
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
  );
}
