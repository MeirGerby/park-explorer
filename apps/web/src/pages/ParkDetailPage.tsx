import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ParkHeader } from "@/features/parks/components/ParkHeader";
import { ParkInformation } from "@/features/parks/components/ParkInformation";
import { ParkLocation } from "@/features/parks/components/ParkLocation";
import { ParkBoundary } from "@/features/parks/components/ParkBoundary";
import { ParkImageGallery } from "@/features/parks/components/ParkImageGallery";

export function ParkDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  // 1. Fetch the current park data from the server
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

  // 2. Setup the delete logic with tRPC
  const deleteParkMutation = trpc.parks.removePark.useMutation({
    onSuccess: () => {
      setIsDeleting(false);
      navigate("/parks"); // Automatically navigate back to the list after successful deletion
    },
  });

  const handleDeleteConfirm = () => {
    if (!id) return;
    deleteParkMutation.mutate({ id });
  };

  return (
    <div className="relative min-h-screen bg-stone-100 text-stone-800 antialiased p-4 sm:p-8 space-y-8 overflow-hidden">
      {/* Styled background environment */}
      <div className="absolute inset-0 opacity-60 pointer-events-none filter blur-[120px] transition-all duration-1000 -z-10">
        <div className="absolute top-[5%] right-[10%] h-125 w-125 rounded-full bg-emerald-200/40 animate-pulse [animation-duration:14s]" />
        <div className="absolute top-[45%] left-[5%] h-137.5 w-137.5 rounded-full bg-amber-200/35 animate-pulse [animation-duration:18s]" />
        <div className="absolute bottom-[10%] right-[15%] h-100 w-100 rounded-full bg-teal-200/30 animate-pulse [animation-duration:12s]" />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#000000_1px,transparent_1px),linear-gradient(to_bottom,#000000_1px,transparent_1px)] bg-size-[3rem_3rem] mask-[radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.025] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Loading state */}
        {isLoading && (
          <div className="space-y-6">
            <div className="h-32 rounded-3xl border border-stone-200/80 bg-stone-50/80 backdrop-blur-2xl animate-pulse ring-1 ring-white/60" />
            <div className="h-80 rounded-3xl border border-stone-200/80 bg-stone-50/80 backdrop-blur-2xl animate-pulse ring-1 ring-white/60" />
          </div>
        )}

        {/* Error state */}
        {isError && (
          <div className="relative overflow-hidden rounded-3xl border border-rose-200/80 bg-rose-50/70 backdrop-blur-2xl p-6 sm:p-8 shadow-xl shadow-stone-900/5 ring-1 ring-white/60 text-stone-800 space-y-4">
            <div className="absolute top-0 inset-x-0 h-0.5 bg-linear-to-r from-transparent via-rose-500/60 to-transparent" />
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-rose-900">
                Error loading park
              </h2>
              <p className="text-sm text-rose-700/90">{error.message}</p>
            </div>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => navigate("/parks")}
            >
              ← Back to Parks
            </Button>
          </div>
        )}

        {/* Park not found state */}
        {!isLoading && !isError && !park && (
          <div className="relative overflow-hidden rounded-3xl border border-stone-200/80 bg-stone-50/80 backdrop-blur-2xl p-8 text-center shadow-xl shadow-stone-900/5 ring-1 ring-white/60 space-y-4">
            <h2 className="text-xl font-bold text-stone-900">Park not found</h2>
            <Button
              className="rounded-xl bg-emerald-900 text-emerald-50 hover:bg-emerald-950"
              onClick={() => navigate("/parks")}
            >
              Explore Parks
            </Button>
          </div>
        )}

        {/* Successfully loaded park details */}
        {!isLoading && !isError && park && (
          <div className="grid gap-8">
            <div className="relative overflow-hidden rounded-3xl border border-stone-200/80 bg-stone-50/80 backdrop-blur-2xl p-6 sm:p-8 shadow-xl shadow-stone-900/5 ring-1 ring-white/60">
              <div className="absolute top-0 inset-x-0 h-0.5 bg-linear-to-r from-transparent via-emerald-600/50 to-transparent" />

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <ParkHeader
                  id={park.id}
                  name={park.name}
                  cityName={park.cityName}
                  regionName={park.regionName}
                />

                {/* Management control actions styled for Base UI */}
                <div className="flex items-center gap-3 self-end sm:self-center">
                  {/* Edit button: uses onClick with navigate instead of an inner Link tag to avoid type breaking */}
                  <Button
                    variant="outline"
                    className="rounded-xl border-stone-200 bg-white hover:bg-stone-50 hover:text-stone-900 shadow-sm"
                    onClick={() => navigate(`/parks/${park.id}/edit`)}
                  >
                    <svg
                      xmlns="http://w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4"
                    >
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                    </svg>
                    Edit Park
                  </Button>

                  {/* Delete button: uses render prop for Base UI dialog window */}
                  <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
                    <DialogTrigger
                      render={
                        <Button
                          variant="destructive"
                          className="rounded-xl shadow-sm bg-red-600 hover:bg-red-700 text-white"
                        >
                          <svg
                            xmlns="http://w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2 h-4 w-4"
                          >
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                          </svg>
                          Delete
                        </Button>
                      }
                    />

                    <DialogContent className="rounded-2xl border-stone-200 bg-white">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-stone-900">
                          Are you absolutely sure?
                        </DialogTitle>
                        <DialogDescription className="text-stone-500 mt-2">
                          This will permanently delete{" "}
                          <span className="font-semibold text-stone-800">
                            "{park.name}"
                          </span>{" "}
                          and remove all mapped boundary parameters, imagery
                          databases, and metadata from our servers.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="mt-6 gap-2 sm:gap-0">
                        <Button
                          variant="outline"
                          className="rounded-xl"
                          onClick={() => setIsDeleting(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          className="rounded-xl bg-red-600 hover:bg-red-700 text-white"
                          disabled={deleteParkMutation.isPending}
                          onClick={handleDeleteConfirm}
                        >
                          {deleteParkMutation.isPending
                            ? "Deleting..."
                            : "Yes, delete park"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <ParkInformation
                description={park.description}
                openedAt={park.openedAt}
              />

              <ParkLocation location={park.location} parkId={park.id} />
            </div>

            <ParkBoundary polygon={park.polygon} />

            <ParkImageGallery images={park.images} parkName={park.name} />
          </div>
        )}
      </div>
    </div>
  );
}