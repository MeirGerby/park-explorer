import { Button } from "@/components/ui/button"
import { trpc } from "@/lib/trpc"

function App() {
  const healthQuery = trpc.health.health.useQuery()

  if (healthQuery.isLoading) {
    return <div>Loading...</div>
  }

  if (healthQuery.isError) {
    return <div>Something went wrong</div>
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Park Explorer</h1>

      <p>
        status: {healthQuery.data?.status}
      </p>

      <Button>Connected</Button>
    </main>
  )
}

export default App