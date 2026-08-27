import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ParkEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Local Form state metrics definitions
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [openedAt, setOpenedAt] = useState("");

  // 1. Fetching current data structure baseline context parameters
  const { data: park, isLoading, isError } = trpc.parks.getParkById.useQuery(
    { id: id ?? "" },
    { enabled: !!id, retry: false }
  );

  // Sync state values once database payloads successfully load
  useEffect(() => {
    if (park) {
      setName(park.name);
      setDescription(park.description ?? "");
      if (park.openedAt) {
        const dateObj = new Date(park.openedAt);
        setOpenedAt(dateObj.toISOString().split("T")[0]);
      }
    }
  }, [park]);

  // 2. Setup structural mutation call tracking parameters
  const updateParkMutation = trpc.parks.updatePark.useMutation({
    onSuccess: () => {
      // Redirect back to single view dashboard layout upon successful alteration tracking
      navigate(`/parks/${id}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    updateParkMutation.mutate({
      id,
      data: {
        name: name.trim(),
        description: description.trim() || undefined,
        openedAt: openedAt ? new Date(openedAt) : undefined,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-100">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  if (isError || !park) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-100 p-4">
        <div className="max-w-md w-full rounded-2xl bg-white p-6 shadow-md text-center space-y-4 border border-stone-200">
          <h2 className="text-lg font-bold text-stone-900">Failed to load data profile</h2>
          <Button asChild className="bg-emerald-800 hover:bg-emerald-900 rounded-xl"><Link to="/parks">Back to directory</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <Card className="rounded-3xl border-stone-200/80 bg-white/90 backdrop-blur-2xl shadow-xl shadow-stone-900/5">
          <form onSubmit={handleSubmit}>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold tracking-tight text-stone-900">Modify Park Details</CardTitle>
              <CardDescription className="text-stone-500">Update workspace identities, descriptive logs and activation periods.</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">Park Identity Name</label>
                <Input 
                  type="text" 
                  required 
                  className="rounded-xl border-stone-200 bg-white focus-visible:ring-emerald-500"
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">Description Context</label>
                <Textarea 
                  rows={4}
                  className="rounded-xl border-stone-200 bg-white focus-visible:ring-emerald-500 resize-none"
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">Establishment / Opened Date</label>
                <Input 
                  type="date" 
                  className="rounded-xl border-stone-200 bg-white focus-visible:ring-emerald-500"
                  value={openedAt} 
                  onChange={(e) => setOpenedAt(e.target.value)} 
                />
              </div>

              {updateParkMutation.isError && (
                <p className="text-sm font-medium text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">
                  {updateParkMutation.error.message}
                </p>
              )}
            </CardContent>

            <CardFooter className="flex items-center justify-end gap-3 border-t border-stone-100 pt-4">
              <Button asChild type="button" variant="outline" className="rounded-xl border-stone-200">
                <Link to={`/parks/${id}`}>Cancel</Link>
              </Button>
              <Button 
                type="submit" 
                className="rounded-xl bg-emerald-800 hover:bg-emerald-900 px-6 font-semibold shadow-md shadow-emerald-900/10 text-white"
                disabled={updateParkMutation.isPending}
              >
                {updateParkMutation.isPending ? "Saving changes..." : "Save changes"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
