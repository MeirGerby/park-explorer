import type { ReactNode } from "react"

import { Header } from "./Header"
import { PageContainer } from "./PageContainer"

type AppShellProps = {
  userName: string
  children: ReactNode
}

export function AppShell({
  userName,
  children,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header userName={userName} />

      <PageContainer>
        {children}
      </PageContainer>
    </div>
  )
}