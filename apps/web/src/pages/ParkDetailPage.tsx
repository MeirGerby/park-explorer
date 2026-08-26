import { useParams } from "react-router-dom";

import { trpc } from "@/lib/trpc";
import { ParkHeader } from "@/features/parks/components/ParkHeader";
import { ParkInformation } from "@/features/parks/components/ParkInformation";
import { ParkLocation } from "@/features/parks/components/ParkLocation";
import { ParkBoundary } from "@/features/parks/components/ParkBoundary";
import { ParkImageGallery } from "@/features/parks/components/ParkImageGallery";

export function ParkDetailPage() {
  const { id } = useParams<{ id: string }>();

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
  );

  if (isLoading) {
    return <div className="p-4 text-muted-foreground">Loading park...</div>;
  }

  if (isError) {
    return (
      <div className="rounded-md border border-destructive/20 bg-destructive/5 p-4 text-destructive">
        <p className="font-semibold">Error loading park</p>

        <p className="text-sm">{error.message}</p>
      </div>
    );
  }

  if (!park) {
    return <div className="p-4 text-muted-foreground">Park not found.</div>;
  }

  return (
    <div className="grid gap-8">
      <ParkHeader
        id={park.id}
        name={park.name}
        cityName={park.cityName}
        regionName={park.regionName}
      />

      <ParkImageGallery images={park.images} parkName={park.name} />

      <ParkInformation
        description={park.description}
        openedAt={park.openedAt}
      />

      <ParkLocation location={park.location} parkId={park.id} />

      <ParkBoundary polygon={park.polygon} />
    </div>
  );
}
