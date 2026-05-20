import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { LayoutGrid, GraduationCap, Star, Users, Settings } from "lucide-react";

type NavItem = {
  to: "/analysis" | "/roadmap";
  label: string;
  icon: typeof LayoutGrid;
  exact?: boolean;
  soon?: boolean;
};

const sidebarLinks: NavItem[] = [
  { to: "/analysis", label: "Overview", icon: LayoutGrid, exact: true },
  { to: "/roadmap", label: "Learning Paths", icon: GraduationCap },
  { to: "/analysis", label: "Watchlist", icon: Star, soon: true },
  { to: "/analysis", label: "Community", icon: Users, soon: true },
];

export function TerminalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <aside className="hidden w-64 shrink-0 flex-col justify-between border-r border-border/70 bg-surface/40 px-5 py-7 lg:flex">
          <div>
            <div>
              <div className="font-display text-lg font-semibold text-primary">Terminal</div>
              <div className="font-mono text-xs text-muted-foreground">v1.0.2-beta</div>
            </div>
            <nav className="mt-8 flex flex-col gap-1">
              {sidebarLinks.map((l, i) => {
                const Icon = l.icon;
                return (
                  <Link
                    key={i}
                    to={l.to}
                    activeOptions={l.exact ? { exact: true } : undefined}
                    activeProps={{ className: "active" }}
                    className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-surface-2/60 hover:text-foreground ${
                      l.soon ? "opacity-50" : ""
                    } [&.active]:bg-primary/10 [&.active]:text-primary [&.active]:border [&.active]:border-primary/30`}
                  >
                    <Icon className="h-4 w-4" />
                    {l.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex flex-col gap-3">
            <button className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
              <Settings className="h-4 w-4" /> Settings
            </button>
            <button className="rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:brightness-110">
              Upgrade Pro
            </button>
          </div>
        </aside>
        <main className="flex-1 overflow-x-hidden">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
