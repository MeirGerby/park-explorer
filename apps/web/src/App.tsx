import { ParkList } from "./components/ParkList";
import { AuthPage } from "./features/auth/components/AuthPage";
import { useCurrentUser } from "./features/auth/hooks/use-current-user";

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
      <header className="border-b border-border p-4 text-sm text-muted-foreground">
        Signed in as {user.name}
      </header>
      <ParkList />
    </div>
  );
}

export default App;
