import { trpc } from "@/lib/trpc"
import { Button } from "@/components/ui/button"

export function LogoutButton() {
  const utils = trpc.useUtils()

  const logout = trpc.auth.logout.useMutation({
    onSuccess: () => {
      utils.auth.me.invalidate()
    },
  })

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => logout.mutate()}
      disabled={logout.isPending}
    >
      {logout.isPending ? "Signing out..." : "Log out"}
    </Button>
  )
}
