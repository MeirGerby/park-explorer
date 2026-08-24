import { useNavigate } from "react-router-dom"
import { CreateRegionForm } from "@/features/regions/components/CreateRegionForm"

export function AddRegionPage() {
  const navigate = useNavigate()

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <button 
          onClick={() => navigate("/regions")}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to Regions
        </button>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">Create a New Region</h1>
        <p className="text-sm text-muted-foreground">
          Create a region to organize cities and parks.
        </p>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        {/* <CreateRegionForm onSuccess={() => navigate("/regions")} /> */}
        <CreateRegionForm />
      </div>
    </div>
  )
}
