import { Routes, Route, Link } from "react-router-dom";
import { AuthPage } from "./features/auth/components/AuthPage";
import { LogoutButton } from "./features/auth/components/LogoutButton";
import { useCurrentUser } from "./features/auth/hooks/use-current-user";
import { RegionsSection } from "./features/regions/components/RegionsSection";
import { ParksSection } from "./features/parks/components/ParksSection";
import { ParkDetailPage } from "./features/parks/components/ParkDetailPage";

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
        <Link to="/" className="text-lg font-bold">
          Park Explorer
        </Link>
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground">Signed in as {user.name}</p>
          <LogoutButton />
        </div>
      </header>
      <main className="mx-auto grid max-w-4xl gap-8 p-6">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <RegionsSection />
                <ParksSection />
              </>
            }
          />
          <Route path="/parks/:id" element={<ParkDetailPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
