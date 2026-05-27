import { NavLink, Link, useNavigate } from "react-router-dom";
import { Bell, LogOut, UserCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "./Logo";

const nav = [
  { to: "/learning", label: "Learning" },
  { to: "/roadmap", label: "Roadmap" },
  { to: "/analysis", label: "Analysis" },
  { to: "/prices", label: "Prices" },
] as const;

export function Header() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/", { replace: true });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Logo />
        <nav className="hidden items-center gap-10 md:flex">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `text-sm text-muted-foreground transition-colors hover:text-foreground ${
                  isActive
                    ? "text-primary underline underline-offset-[10px]"
                    : ""
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-3 text-muted-foreground">
          {loading ? null : user ? (
            <>
              <Link
                to="/dashboard"
                className="hidden items-center gap-1.5 text-sm hover:text-foreground sm:inline-flex"
              >
                <UserCircle2 className="h-4 w-4" />
                {user.username}
              </Link>
              <button
                aria-label="Sign out"
                onClick={handleLogout}
                className="rounded-full p-1 hover:text-foreground"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm hover:text-foreground"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="rounded-md border border-primary/40 bg-primary/10 px-3 py-1.5 text-sm text-primary transition hover:bg-primary/20"
              >
                Register
              </Link>
            </>
          )}
          <button
            aria-label="Notifications"
            className="rounded-full p-1 hover:text-foreground"
          >
            <Bell className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
