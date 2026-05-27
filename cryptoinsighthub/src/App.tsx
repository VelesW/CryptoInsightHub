import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import { SiteLayout } from "@/components/site/SiteLayout";
import { usePageMeta } from "@/hooks/usePageMeta";
import AnalysisPage from "@/pages/Analysis";
import LearningPage from "@/pages/Learning";
import PricesPage from "@/pages/Prices";
import RoadmapPage from "@/pages/Roadmap";
import LoginPage from "@/pages/Login";
import RegisterPage from "@/pages/Register";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Clock,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";

const stats = [
  { label: "Total Volume (24h)", value: "$42.8B", tone: "primary" as const },
  { label: "Active Nodes", value: "12,492", tone: "fg" as const },
  { label: "Protocols Tracked", value: "845", tone: "fg" as const },
  { label: "Global Market Cap", value: "$1.6T", tone: "amber" as const },
];

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/70">
      <div className="absolute inset-0 glow-aurora opacity-60" />
      <div className="relative mx-auto max-w-7xl px-6 pt-24 pb-16 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2/60 px-4 py-1.5 text-[11px] font-medium tracking-[0.18em] text-muted-foreground">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
          V2.4 TERMINAL LIVE
        </span>
        <h1 className="mt-8 font-display text-5xl font-semibold tracking-tight text-foreground md:text-6xl">
          Navigate Complexity with{" "}
          <span className="text-gradient-sky">Clarity</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Advanced blockchain analytics and educational pathways tailored for
          the next generation of decentralized finance pioneers. Master the
          ledger, anticipate the market.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/learning"
            className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:brightness-110"
          >
            Start Learning
          </Link>
          <Link
            to="/analysis"
            className="rounded-md border border-primary/70 px-6 py-3 text-sm font-medium text-primary transition hover:bg-primary/10"
          >
            Explore Analytics
          </Link>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border/60 md:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-surface/60 px-6 py-6 text-left backdrop-blur"
            >
              <div className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground">
                {s.label.toUpperCase()}
              </div>
              <div
                className={`mt-2 font-display text-3xl font-semibold ${
                  s.tone === "primary"
                    ? "text-primary"
                    : s.tone === "amber"
                      ? "text-amber"
                      : "text-foreground"
                }`}
              >
                {s.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeedCard({
  tag,
  tagTone = "primary",
  title,
  description,
  meta,
  icon,
  className = "",
}: {
  tag: string;
  tagTone?: "primary" | "amber" | "muted";
  title: string;
  description: string;
  meta?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}) {
  const tagClass =
    tagTone === "amber"
      ? "border-amber/40 bg-amber/10 text-amber"
      : tagTone === "muted"
        ? "border-border bg-surface-2 text-muted-foreground"
        : "border-primary/30 bg-primary/10 text-primary";
  return (
    <article
      className={`panel relative flex flex-col gap-5 p-6 transition hover:border-primary/40 ${className}`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`rounded-full border px-3 py-1 text-[11px] font-medium ${tagClass}`}
        >
          {tag}
        </span>
        <div className="text-muted-foreground">{icon}</div>
      </div>
      <div className="flex-1">
        <h3 className="font-display text-lg font-semibold leading-snug text-foreground">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
      {meta && (
        <div className="flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
          {meta}
        </div>
      )}
    </article>
  );
}

function SentimentCard() {
  return (
    <article className="panel flex flex-col gap-4 p-6">
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-full bg-surface-2 text-primary">
          <Activity className="h-4 w-4" />
        </div>
        <div>
          <div className="text-sm font-semibold text-foreground">
            Market Sentiment
          </div>
          <div className="text-xs text-muted-foreground">
            Aggregated from 50+ sources
          </div>
        </div>
      </div>
      <div>
        <div className="flex items-baseline gap-2">
          <span className="font-display text-5xl font-semibold text-primary">
            78
          </span>
          <span className="text-sm text-muted-foreground">/ 100</span>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full"
            style={{
              width: "78%",
              background:
                "linear-gradient(90deg, var(--amber), var(--primary))",
            }}
          />
        </div>
        <div className="mt-2 flex justify-end text-xs text-muted-foreground">
          Greed
        </div>
      </div>
    </article>
  );
}

function IntelligenceFeed() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-display text-3xl font-semibold tracking-tight">
            Intelligence Feed
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Real-time AI-synthesized insights across networks.
          </p>
        </div>
        <Link
          to="/analysis"
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          View All <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <FeedCard
          className="lg:col-span-2"
          tag="Layer 1"
          title="Ethereum 'Dencun' Upgrade Imminent: What It Means for Rollup Fees"
          description="The upcoming hard fork is expected to significantly reduce transaction costs for Layer 2 networks through proto-danksharding."
          meta={
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> 12m ago
            </span>
          }
        />
        <FeedCard
          tag="DeFi"
          tagTone="amber"
          icon={<TrendingUp className="h-4 w-4 text-bullish" />}
          title="DEX Volume Surges 40% Amid Market Volatility"
          description="Decentralized exchanges see massive inflow as traders seek self-custody solutions during recent centralized platform outages."
          meta={
            <>
              <span>AI Confidence: 92%</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> 1h ago
              </span>
            </>
          }
        />
        <FeedCard
          tag="Security"
          tagTone="amber"
          icon={<ShieldAlert className="h-4 w-4 text-amber" />}
          title="New Smart Contract Vulnerability Pattern Detected"
          description="Our AI models have identified a novel reentrancy vector affecting older forks."
        />
        <SentimentCard />
        <FeedCard
          tag="Macro"
          tagTone="muted"
          icon={<ArrowUpRight className="h-4 w-4" />}
          title="Institutional Inflows Stabilize Ahead of Q2"
          description="ETF volume shows consistent baseline support."
        />
      </div>
    </section>
  );
}

function HomePage() {
  usePageMeta(
    "CryptoInsight Hub — Navigate Complexity with Clarity",
    "AI-synthesized blockchain intelligence, real-time market analytics, and structured Web3 learning paths.",
  );
  return (
    <SiteLayout>
      <Hero />
      <IntelligenceFeed />
    </SiteLayout>
  );
}

function DashboardPage() {
  usePageMeta("Dashboard — CryptoInsight Hub");
  const { user } = useAuth();
  return (
    <SiteLayout>
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h1 className="font-display text-3xl font-semibold">
          Welcome, {user?.username}
        </h1>
        <p className="mt-4 text-muted-foreground">
          This route is protected — only authenticated users can see it.
        </p>
      </section>
    </SiteLayout>
  );
}

function NotFoundPage() {
  usePageMeta("404 — CryptoInsight Hub");
  return (
    <SiteLayout>
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h1 className="font-display text-3xl font-semibold">
          404 — Not Found
        </h1>
        <p className="mt-4 text-muted-foreground">
          No matching route for:{" "}
          <span className="font-mono">{window.location.pathname}</span>
        </p>
        <p className="mt-6">
          <Link to="/" className="text-primary underline">
            Return home
          </Link>
        </p>
      </section>
    </SiteLayout>
  );
}

function ScrollToTopOnNavigation() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTopOnNavigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
          <Route path="/prices" element={<PricesPage />} />
          <Route path="/learning" element={<LearningPage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
