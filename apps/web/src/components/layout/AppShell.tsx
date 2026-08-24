import { Outlet } from "react-router-dom"
import { Header } from "./Header"
import { PageContainer } from "./PageContainer"

type AppShellProps = {
  userName: string
}

export function AppShell({ userName }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header userName={userName} />

      <PageContainer>
        {/* Outlet acts as a placeholder for nested route components */}
        <Outlet />
      </PageContainer>
    </div>
  )
}
