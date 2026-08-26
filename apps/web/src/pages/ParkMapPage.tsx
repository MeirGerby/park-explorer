import { Link, useParams } from "react-router-dom"

import { trpc } from "@/lib/trpc"
import { Map } from "@/components/map/Map"
import { isLatLng } from "@/features/parks/lib/park-location"

export function ParkMapPage() {
  const { id } = useParams<{ id: string }>()

  const {
    data: park,
    isLoading,
    isError,
    error,
  } = trpc.parks.getParkById.useQuery(
    { id: id ?? "" },
    {
      enabled: !!id,
      retry: false,
    },
  )

  return (
    <div className="relative min-h-screen bg-stone-100 text-stone-800 antialiased p-4 sm:p-8 space-y-8 overflow-hidden">
      {/* 1. Organic Warm Ambient Glows */}
      <div className="absolute inset-0 opacity-60 pointer-events-none filter blur-[120px] transition-all duration-1000 -z-10">
        <div className="absolute top-[10%] left-[10%] h-125 w-125 rounded-full bg-emerald-200/40 animate-pulse [animation-duration:14s]" />
        <div className="absolute bottom-[20%] right-[10%] h-137.5 w-137.5 rounded-full bg-amber-200/35 animate-pulse [animation-duration:18s]" />
      </div>

      {/* 2. Topo-style Subtle Micro Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#000000_1px,transparent_1px),linear-gradient(to_bottom,#000000_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.025] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Loading State */}
        {isLoading && (
          <div className="space-y-6">
            <div className="h-28 rounded-3xl border border-stone-200/80 bg-stone-50/80 backdrop-blur-2xl animate-pulse ring-1 ring-white/60" />
            <div className="h-[500px] rounded-3xl border border-stone-200/80 bg-stone-50/80 backdrop-blur-2xl animate-pulse ring-1 ring-white/60" />
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="relative overflow-hidden rounded-3xl border border-rose-200/80 bg-rose-50/70 backdrop-blur-2xl p-6 sm:p-8 shadow-xl shadow-stone-900/5 ring-1 ring-white/60 space-y-4">
            <div className="absolute top-0 inset-x-0 h-0.5 bg-linear-to-r from-transparent via-rose-500/60 to-transparent" />
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-rose-900">Error loading park</h2>
              <p className="text-sm text-rose-700/90">{error.message}</p>
            </div>
            <Link
              to="/parks"
              className="inline-flex h-9 items-center justify-center rounded-xl bg-rose-900/10 px-4 text-xs font-semibold text-rose-900 hover:bg-rose-900/20 transition-colors"
            >
              ← Back to Parks
            </Link>
          </div>
        )}

        {/* Missing Location State */}
        {!isLoading && !isError && (!park || !isLatLng(park?.location)) && (
          <div className="relative overflow-hidden rounded-3xl border border-stone-200/80 bg-stone-50/80 backdrop-blur-2xl p-8 text-center shadow-xl shadow-stone-900/5 ring-1 ring-white/60 space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-stone-900">Location Unavailable</h2>
              <p className="text-sm text-stone-500">
                Park location coordinates are not available for display on the map.
              </p>
            </div>
            {park && (
              <Link
                to={`/parks/${park.id}`}
                className="inline-flex h-10 items-center justify-center rounded-xl bg-emerald-900 px-5 text-sm font-semibold text-emerald-50 shadow-md shadow-emerald-900/15 transition-all hover:bg-emerald-950"
              >
                ← Back to Park Details
              </Link>
            )}
          </div>
        )}

        {/* Main Map View */}
        {!isLoading && !isError && park && isLatLng(park.location) && (
          <div className="space-y-6">
            {/* Header Section */}
            <div className="relative overflow-hidden rounded-3xl border border-stone-200/80 bg-stone-50/80 backdrop-blur-2xl p-6 sm:p-8 shadow-xl shadow-stone-900/5 ring-1 ring-white/60 space-y-2">
              <div className="absolute top-0 inset-x-0 h-0.5 bg-linear-to-r from-transparent via-emerald-600/50 to-transparent" />
              
              <Link
                to={`/parks/${park.id}`}
                className="inline-flex items-center text-xs font-semibold tracking-wider text-stone-500 uppercase transition-colors hover:text-emerald-900"
              >
                ← Back to Park
              </Link>

              <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
                {park.name}
              </h1>

              <p className="text-sm font-medium text-stone-500">
                {park.cityName}, {park.regionName}
              </p>
            </div>

            {/* Map Container */}
            <div className="relative overflow-hidden rounded-3xl border border-stone-200/80 bg-stone-50/80 backdrop-blur-2xl p-2 shadow-xl shadow-stone-900/5 ring-1 ring-white/60">
              <div className="overflow-hidden rounded-2xl">
                <Map
                  center={[park.location[0], park.location[1]]}
                  zoom={15}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}