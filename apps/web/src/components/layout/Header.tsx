import { Link, NavLink } from "react-router-dom";

import { LogoutButton } from "@/features/auth/components/LogoutButton";

type HeaderProps = {
  userName: string;
};

export function Header({ userName }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-lg font-bold tracking-tight">
            Park Explorer
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `text-sm transition-colors ${
                  isActive
                    ? "font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/parks"
              className={({ isActive }) =>
                `text-sm transition-colors ${
                  isActive
                    ? "font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              Parks
            </NavLink>

            <NavLink
              to="/regions"
              className={({ isActive }) =>
                `text-sm transition-colors ${
                  isActive
                    ? "font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              Regions
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-muted-foreground sm:block">
            {userName}
          </span>

          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
