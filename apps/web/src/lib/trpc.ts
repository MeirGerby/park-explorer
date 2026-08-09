import { createTRPCReact } from "@trpc/react-query"
import { createTRPCClient, httpBatchLink } from "@trpc/client"
import type { AppRouter } from "api"

// יצירת ה-Proxy Client שמאפשר גישה ישירה כמו trpc.health.useQuery()
export const trpc = createTRPCReact<AppRouter>()

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3000/trpc",
    }),
  ],
})