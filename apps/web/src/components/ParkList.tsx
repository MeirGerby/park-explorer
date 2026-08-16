import { trpc } from "@/lib/trpc";

export function ParkList() {
  const {
    data: parks,
    isLoading,
    isError,
    error,
  } = trpc.parks.getParks.useQuery();

  if (isLoading) {
    return <div className="p-4 text-tray-500">Loading parks...</div>;
  }

  if (isError) {
    return (
      <div className="p-4 text-red-600 border border-red-200 rounded-md bg-red-50">
        <p className="font-semibold">Error loading parks</p>"
        <p className="font-sm">{error.message}</p>
      </div>
    );
  }

  if (!parks || parks.length === 0) {
    return <div className="p-4 text-gray-500">No parks found.</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Park Explorer</h1>
      <ul className="grid gap-4 sm:grid-cols-2">
        {parks.map((park) => (
          <li
            key={park.id}
            className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white"
          >
            <h2 className="text-lg font-semibold text-gray-900">{park.name}</h2>
            <p className="text-sm text-gray-600 mt-1">
              {park.cityName}, {park.regionName}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
