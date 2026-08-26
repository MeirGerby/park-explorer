import { Routes, Route } from "react-router-dom"

import { AuthPage } from "@/features/auth/components/AuthPage"
import { useCurrentUser } from "@/features/auth/hooks/use-current-user"

import { AppShell } from "@/components/layout/AppShell"

import { HomePage } from "@/pages/HomePage"
import { ParksPage } from "@/pages/ParksPage"
import { AddParkPage } from "@/pages/AddParkPage"
import { ParkDetailPage } from "@/pages/ParkDetailPage"
import { RegionsPage } from "@/pages/RegainsPage"
import { AddRegionPage } from "@/pages/AddRegionPage"
import { ParkMapPage } from "@/pages/ParkMapPage"

export function Router() {
  const { data: user, isLoading, isError } = useCurrentUser()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground animate-pulse">
          Loading layout...
        </p>
      </div>
    )
  }

  if (isError || !user) {
    return <AuthPage />
  }

  return (
    <Routes>
      {/* AppShell acts as the layout wrapper for all protected routes */}
      <Route element={<AppShell userName={user.name} />}>
        <Route path="/" element={<HomePage />} />
        
        {/* Parks Feature Tree */}
        <Route path="parks">
          <Route index element={<ParksPage />} />
          <Route path="new" element={<AddParkPage />} />
          <Route path=":id/map" element={<ParkMapPage />} />
          <Route path=":id" element={<ParkDetailPage />} />
        </Route>

        {/* Regions Feature Tree */}
        <Route path="regions">
          <Route index element={<RegionsPage />} />
          <Route path="new" element={<AddRegionPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
