import { Link } from "react-router-dom";
import { trpc } from "@/lib/trpc";
import { ParkMap } from "@/features/parks/components/ParkMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function HomePage() {
  const { data: parks, isLoading } = trpc.parks.getParks.useQuery({});

  // Normalize locations to [number, number] tuple format
  const mappedParks =
    parks?.map((park) => {
      let location: [number, number] = [0, 0];
      const loc = park.location as unknown;

      if (Array.isArray(loc) && loc.length === 2) {
        location = [Number(loc[0]), Number(loc[1])];
      } else if (typeof loc === "object" && loc !== null) {
        const obj = loc as Record<string, unknown>;
        if ("lat" in obj && "lng" in obj) {
          location = [Number(obj.lat), Number(obj.lng)];
        } else if ("x" in obj && "y" in obj) {
          location = [Number(obj.x), Number(obj.y)];
        }
      }

      return {
        ...park,
        location,
      };
    }) ?? [];

  const validParksForMap = mappedParks.filter(
    (p) => p.location[0] !== 0 || p.location[1] !== 0
  );

  const parkCount = parks?.length ?? 0;

  return (
    <div className="relative min-h-screen bg-stone-100 text-stone-800 antialiased p-4 sm:p-8 space-y-10 overflow-hidden">
      {/* 1. Organic Warm Ambient Glows (Matching AuthPage) */}
      <div className="absolute inset-0 opacity-60 pointer-events-none filter blur-[120px] transition-all duration-1000 -z-10">
        <div className="absolute top-[5%] left-[5%] h-125 w-125 rounded-full bg-emerald-200/40 animate-pulse [animation-duration:14s]" />
        <div className="absolute top-[40%] right-[10%] h-137.5 w-137.5 rounded-full bg-amber-200/35 animate-pulse [animation-duration:18s]" />
        <div className="absolute bottom-[10%] left-[20%] h-100 w-100 rounded-full bg-teal-200/30 animate-pulse [animation-duration:12s]" />
      </div>

      {/* 2. Topo-style Subtle Micro Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#000000_1px,transparent_1px),linear-gradient(to_bottom,#000000_1px,transparent_1px)] bg-size-[3rem_3rem] mask-[radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.025] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto space-y-10">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl border border-stone-200/80 bg-stone-50/80 backdrop-blur-2xl p-8 sm:p-10 shadow-xl shadow-stone-900/5 ring-1 ring-white/60">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-linear-to-r from-transparent via-emerald-600/50 to-transparent" />
          
          <div className="max-w-2xl space-y-4">
            <span className="inline-block text-xs font-bold tracking-[0.2em] text-emerald-900 uppercase">
              Park Explorer
            </span>

            <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
              Explore national parks & wilderness around you
            </h1>

            <p className="text-stone-600 leading-relaxed text-sm sm:text-base">
              Discover local ecosystems, navigate trails on the live map, and connect with nature reserves in your region.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/parks"
                className="inline-flex h-10 items-center justify-center rounded-xl bg-emerald-900 px-5 text-sm font-semibold text-emerald-50 shadow-md shadow-emerald-900/15 transition-all duration-200 hover:bg-emerald-950 hover:scale-[1.02]"
              >
                Explore parks
              </Link>

              <Link
                to="/regions"
                className="inline-flex h-10 items-center justify-center rounded-xl border border-stone-300/80 bg-stone-100/80 px-5 text-sm font-medium text-stone-700 shadow-xs transition-all duration-200 hover:bg-stone-200/60 hover:text-stone-900"
              >
                Browse regions
              </Link>
            </div>
          </div>
        </section>

        {/* Key Stats Cards */}
        <section className="grid gap-4 sm:grid-cols-3">
          <Card className="rounded-2xl border border-stone-200/80 bg-stone-50/80 backdrop-blur-xl shadow-lg shadow-stone-900/5 ring-1 ring-white/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Total Parks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-extrabold text-stone-900">{parkCount}</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-stone-200/80 bg-stone-50/80 backdrop-blur-xl shadow-lg shadow-stone-900/5 ring-1 ring-white/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Parks on Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-extrabold text-emerald-900">{validParksForMap.length}</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-stone-200/80 bg-stone-50/80 backdrop-blur-xl shadow-lg shadow-stone-900/5 ring-1 ring-white/60 flex flex-col justify-between">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Regions Covered
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Link
                to="/regions"
                className="inline-flex items-center text-sm font-semibold text-emerald-800 hover:text-emerald-950 group"
              >
                Explore regions <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </CardContent>
          </Card>
        </section>

        {/* Map View */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-stone-900">Interactive Map</h2>
            <p className="text-sm text-stone-500">
              Select a marker to view details about specific parks.
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-stone-200/80 bg-stone-50/80 backdrop-blur-xl shadow-xl shadow-stone-900/5 p-2 ring-1 ring-white/60">
            <div className="overflow-hidden rounded-2xl">
              {isLoading ? (
                <div className="h-125 animate-pulse bg-stone-200/60" />
              ) : (
                <ParkMap parks={validParksForMap} />
              )}
            </div>
          </div>
        </section>

        {/* Featured Parks Grid */}
        {!isLoading && parks && parks.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-stone-900">Featured Parks</h2>
                <p className="text-sm text-stone-500">
                  Discover popular outdoor destinations.
                </p>
              </div>

              <Link
                to="/parks"
                className="text-sm font-semibold text-emerald-800 hover:text-emerald-950 transition-colors"
              >
                View all →
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {parks.slice(0, 6).map((park) => (
                <Link
                  key={park.id}
                  to={`/parks/${park.id}`}
                  className="group relative overflow-hidden rounded-2xl border border-stone-200/80 bg-stone-50/80 backdrop-blur-xl p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-stone-900/10 hover:-translate-y-0.5 ring-1 ring-white/60"
                >
                  <div className="absolute top-0 inset-x-0 h-0.5 bg-emerald-600/0 group-hover:bg-emerald-600/60 transition-all duration-300" />
                  <h3 className="font-bold text-stone-900 group-hover:text-emerald-900 transition-colors">
                    {park.name}
                  </h3>

                  <p className="mt-1 text-xs font-medium text-stone-500">
                    {park.cityName}, {park.regionName}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}