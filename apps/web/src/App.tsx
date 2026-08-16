import { AuthPage } from "./features/auth/components/AuthPage";
import { useCurrentUser } from "./features/auth/hooks/use-current-user";
import { RegionsSection } from "./features/regions/components/RegionsSection";
import { ParksSection } from "./features/parks/components/ParksSection";

function App() {
  const { data: user, isLoading, isError } = useCurrentUser();

  if (isLoading) {
    return <div className="p-4 text-gray-500">Loading...</div>;
  }

  if (isError || !user) {
    return <AuthPage />;
  }

  return (
    <div>
      <header className="flex items-center justify-between border-b border-border p-4">
        <h1 className="text-lg font-bold">Park Explorer</h1>
        <p className="text-sm text-muted-foreground">Signed in as {user.name}</p>
      </header>
      <main className="mx-auto grid max-w-4xl gap-8 p-6">
        <RegionsSection />
        <ParksSection />
      </main>
    </div>
  );
}

export default App;
