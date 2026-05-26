import { NavLink, Link } from "react-router-dom";
import { Bell, UserCircle2 } from "lucide-react";

/**
 * Local Logo replica using react-router-dom Link.
 * Kept here so we don't have to edit the original Logo file in this change.
 */
function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        className="text-primary"
      >
        <path
          d="M12 2L21 7v10l-9 5-9-5V7l9-5z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="2.2" fill="currentColor" />
      </svg>
      <span className="font-display text-[13px] font-semibold tracking-[0.18em] text-primary">
        CRYPTOINSIGHT HUB
      </span>
    </Link>
  );
}

const nav = [
  { to: "/learning", label: "Learning" },
  { to: "/roadmap", label: "Roadmap" },
  { to: "/analysis", label: "Analysis" },
  { to: "/prices", label: "Prices" },
] as const;

export function Header() {
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
        <div className="flex items-center gap-4 text-muted-foreground">
          <button
            aria-label="Account"
            className="rounded-full p-1 hover:text-foreground"
          >
            <UserCircle2 className="h-5 w-5" />
          </button>
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
