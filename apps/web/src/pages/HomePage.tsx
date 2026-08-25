import { Link } from "react-router-dom";

import { trpc } from "@/lib/trpc";
import { ParkMap } from "@/features/parks/components/ParkMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function HomePage() {
  const { data: parks, isLoading } = trpc.parks.getParks.useQuery({});

  // Ensure locations are normalized to [number, number] tuple format
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
    <div className="grid gap-8">
      {/* Hero */}
      <section className="rounded-2xl border bg-card p-8 shadow-sm">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-primary">Park Explorer</p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Explore parks around you
          </h1>

          <p className="mt-3 text-muted-foreground">
            Discover parks, explore their locations, and learn more about the
            places around you.
          </p>

          <div className="mt-6 flex gap-3">
            <Link
              to="/parks"
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90"
            >
              Explore parks
            </Link>

            <Link
              to="/regions"
              className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Browse regions
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Parks
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold">{parkCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Parks on map
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold">{validParksForMap.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Regions
            </CardTitle>
          </CardHeader>

          <CardContent>
            <Link
              to="/regions"
              className="text-sm text-primary hover:underline"
            >
              Explore regions →
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Map */}
      <section className="grid gap-4">
        <div>
          <h2 className="text-xl font-semibold">Explore the map</h2>

          <p className="text-sm text-muted-foreground">
            Select a park to view more information.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border shadow-sm">
          {isLoading ? (
            <div className="h-125 animate-pulse bg-muted" />
          ) : (
            <ParkMap parks={validParksForMap} />
          )}
        </div>
      </section>

      {/* Recent parks */}
      {!isLoading && parks && parks.length > 0 && (
        <section className="grid gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Parks</h2>

              <p className="text-sm text-muted-foreground">
                Explore the available parks.
              </p>
            </div>

            <Link
              to="/parks"
              className="inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              View all →
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {parks.slice(0, 6).map((park) => (
              <Link
                key={park.id}
                to={`/parks/${park.id}`}
                className="rounded-xl border bg-card p-5 transition-shadow hover:shadow-md"
              >
                <h3 className="font-semibold">{park.name}</h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  {park.cityName}, {park.regionName}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}