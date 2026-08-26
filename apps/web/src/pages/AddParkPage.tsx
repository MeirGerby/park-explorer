import { useNavigate } from "react-router-dom"
import { CreateParkForm } from "@/features/parks/components/CreateParkForm"

export function AddParkPage() {
  const navigate = useNavigate()

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <button 
          onClick={() => navigate("/parks")}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to Parks
        </button>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">Create a New Park</h1>
        <p className="text-sm text-muted-foreground">
          Fill in the details below to assign a park to a city.
        </p>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <CreateParkForm onSuccess={() => navigate("/parks")} />
        {/* <CreateParkForm /> */}
      </div>
    </div>
  )
}
