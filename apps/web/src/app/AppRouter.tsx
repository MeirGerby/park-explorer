import { Routes, Route } from "react-router-dom"

import { AuthPage } from "@/features/auth/components/AuthPage"
import { useCurrentUser } from "@/features/auth/hooks/use-current-user"

import { AppShell } from "@/components/layout/AppShell"

import { HomePage } from "@/pages/HomePage"
import { ParksPage } from "@/pages/ParksPage"
import { RegionsPage } from "@/pages/RegainsPage"
import { ParkDetailPage } from "@/pages/ParkDetailPage"

export function Router() {
  const { data: user, isLoading, isError } = useCurrentUser()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">
          Loading...
        </p>
      </div>
    )
  }

  if (isError || !user) {
    return <AuthPage />
  }

  return (
    <AppShell userName={user.name}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/parks" element={<ParksPage />} />
        <Route path="/parks/:id" element={<ParkDetailPage />} />
        <Route path="/regions" element={<RegionsPage />} />
      </Routes>
    </AppShell>
  )
}