import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { QueryClientProvider } from "@tanstack/react-query"
import { trpc, trpcClient } from "@/lib/trpc"
import { queryClient } from "@/lib/query-client"
import "./index.css"
import App from "./App.tsx"

const AppProvider = trpc.Provider

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppProvider client={trpcClient} queryClient={queryClient}>
        <App />
      </AppProvider>
    </QueryClientProvider>
  </StrictMode>,
)