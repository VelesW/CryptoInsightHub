import { Link } from "@tanstack/react-router";
import { Bell, UserCircle2 } from "lucide-react";
import { Logo } from "./Logo";

const nav = [
  { to: "/learning", label: "Learning" },
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
            <Link
              key={n.to}
              to={n.to}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground [&.active]:text-primary [&.active]:underline [&.active]:underline-offset-[10px]"
              activeProps={{ className: "active" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4 text-muted-foreground">
          <button aria-label="Account" className="rounded-full p-1 hover:text-foreground">
            <UserCircle2 className="h-5 w-5" />
          </button>
          <button aria-label="Notifications" className="rounded-full p-1 hover:text-foreground">
            <Bell className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
