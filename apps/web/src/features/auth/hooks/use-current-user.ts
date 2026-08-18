import { trpc } from "@/lib/trpc"


export function useCurrentUser() {
  return trpc.auth.me.useQuery(undefined, {
    retry: false,
  })
}
