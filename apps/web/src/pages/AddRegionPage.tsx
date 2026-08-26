import { useNavigate } from "react-router-dom"
import { CreateRegionForm } from "@/features/regions/components/CreateRegionForm"

export function AddRegionPage() {
  const navigate = useNavigate()

  return (
    <div className="relative min-h-screen bg-stone-100 text-stone-800 antialiased p-4 sm:p-8 space-y-8 overflow-hidden">
      {/* 1. Organic Warm Ambient Glows */}
      <div className="absolute inset-0 opacity-60 pointer-events-none filter blur-[120px] transition-all duration-1000 -z-10">
        <div className="absolute top-[10%] left-[15%] h-125 w-125 rounded-full bg-emerald-200/40 animate-pulse [animation-duration:14s]" />
        <div className="absolute bottom-[15%] right-[15%] h-137.5 w-137.5 rounded-full bg-amber-200/35 animate-pulse [animation-duration:18s]" />
      </div>

      {/* 2. Topo-style Subtle Micro Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#000000_1px,transparent_1px),linear-gradient(to_bottom,#000000_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.025] pointer-events-none -z-10" />

      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header & Back Button */}
        <div className="space-y-2">
          <button 
            onClick={() => navigate("/regions")}
            className="inline-flex items-center text-xs font-semibold tracking-wider text-stone-500 uppercase transition-colors hover:text-emerald-900"
          >
            ← Back to Regions
          </button>
          
          <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
            Create a New Region
          </h1>
          
          <p className="text-sm text-stone-500">
            Create a region to organize cities and parks.
          </p>
        </div>

        {/* Glassmorphic Form Container */}
        <div className="relative overflow-hidden rounded-3xl border border-stone-200/80 bg-stone-50/80 backdrop-blur-2xl p-6 sm:p-8 shadow-xl shadow-stone-900/5 ring-1 ring-white/60">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-linear-to-r from-transparent via-emerald-600/50 to-transparent" />
          {/* <CreateRegionForm onSuccess={() => navigate("/regions")} /> */}
          <CreateRegionForm />
        </div>
      </div>
    </div>
  )
}