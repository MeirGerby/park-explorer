import { Link } from "react-router-dom"
import { RegionList } from "@/features/regions/components/RegionList"

export function RegionsPage() {
  return (
    <div className="relative min-h-screen bg-stone-100 text-stone-800 antialiased p-4 sm:p-8 space-y-8 overflow-hidden">
      {/* 1. Organic Warm Ambient Glows */}
      <div className="absolute inset-0 opacity-60 pointer-events-none filter blur-[120px] transition-all duration-1000 -z-10">
        <div className="absolute top-[10%] left-[10%] h-125 w-125 rounded-full bg-emerald-200/40 animate-pulse [animation-duration:14s]" />
        <div className="absolute bottom-[20%] right-[10%] h-137.5 w-137.5 rounded-full bg-amber-200/35 animate-pulse [animation-duration:18s]" />
      </div>

      {/* 2. Topo-style Subtle Micro Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#000000_1px,transparent_1px),linear-gradient(to_bottom,#000000_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.025] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <section className="space-y-1">
            <span className="text-xs font-bold tracking-[0.25em] text-emerald-900 uppercase">
              Explore
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
              Regions
            </h1>
            <p className="text-sm text-stone-500">
              Browse regions and discover the parks within them.
            </p>
          </section>

          <Link
            to="/regions/new"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-emerald-900 px-5 text-sm font-semibold text-emerald-50 shadow-md shadow-emerald-900/15 transition-all duration-200 hover:bg-emerald-950 hover:scale-[1.02] active:scale-[0.98]"
          >
            + Add New Region
          </Link>
        </div>

        {/* Main List Glass Container */}
        <div className="relative overflow-hidden rounded-3xl border border-stone-200/80 bg-stone-50/80 backdrop-blur-2xl p-6 sm:p-8 shadow-xl shadow-stone-900/5 ring-1 ring-white/60">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-linear-to-r from-transparent via-emerald-600/50 to-transparent" />
          <RegionList />
        </div>
      </div>
    </div>
  )
}