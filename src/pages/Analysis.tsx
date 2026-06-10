import { TerminalLayout } from "@/components/site/TerminalLayout";
import { usePageMeta } from "@/hooks/usePageMeta";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Bot,
  BrainCircuit,
  Clock,
  Download,
  LineChart as LineChartIcon,
  RefreshCcw,
  Search,
  TrendingUp,
} from "lucide-react";


const kpis = [
  { label: "Total Market Cap", value: "$2.45T", delta: "+4.2%", up: true },
  { label: "24h Volume", value: "$84.2B", delta: "-1.8%", up: false },
  { label: "BTC Dominance", value: "52.4%", delta: "+0.5%", up: true },
  { label: "ETH Gas (Avg)", value: "24 gwei", delta: "0%", up: null as boolean | null },
];

function MarketChart() {
  // smooth curve
  const points = [
    [0, 70],
    [10, 68],
    [20, 60],
    [30, 50],
    [40, 35],
    [50, 32],
    [60, 45],
    [70, 60],
    [75, 70],
    [82, 60],
    [88, 35],
    [92, 18],
    [96, 12],
    [100, 70],
  ];
  const w = 800;
  const h = 220;
  const path = points
    .map(([x, y], i) => {
      const X = (x / 100) * w;
      const Y = (y / 100) * h;
      return `${i === 0 ? "M" : "L"}${X.toFixed(1)} ${Y.toFixed(1)}`;
    })
    .join(" ");
  const area = `${path} L${w} ${h} L0 ${h} Z`;
  return (
    <div className="relative h-64 w-full">
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="h-full w-full">
        <defs>
          <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.82 0.13 235)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="oklch(0.82 0.13 235)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#area)" />
        <path d={path} fill="none" stroke="oklch(0.82 0.13 235)" strokeWidth="2.5" />
      </svg>
      <div className="pointer-events-none absolute inset-y-0 left-2 flex flex-col justify-between py-2 font-mono text-[10px] text-muted-foreground">
        <span>$3.0T</span>
        <span>$2.5T</span>
        <span>$2.0T</span>
      </div>
      <div className="pointer-events-none absolute inset-x-2 bottom-1 flex justify-between font-mono text-[10px] text-muted-foreground">
        {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
    </div>
  );
}

function SentimentGauge() {
  // half-circle gauge
  const value = 78;
  const angle = (value / 100) * 180 - 90; // -90..90
  const r = 70;
  const cx = 100;
  const cy = 100;
  const rad = (a: number) => (a * Math.PI) / 180;
  const start = { x: cx + r * Math.cos(rad(180)), y: cy + r * Math.sin(rad(180)) };
  const end = { x: cx + r * Math.cos(rad(0)), y: cy + r * Math.sin(rad(0)) };
  const valEnd = {
    x: cx + r * Math.cos(rad(180 - (value / 100) * 180)),
    y: cy + r * Math.sin(rad(180 - (value / 100) * 180)),
  };
  return (
    <div className="relative mx-auto h-32 w-48">
      <svg viewBox="0 0 200 120" className="h-full w-full">
        <path
          d={`M${start.x} ${start.y} A${r} ${r} 0 0 1 ${end.x} ${end.y}`}
          stroke="oklch(0.3 0.03 250)"
          strokeWidth="14"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d={`M${start.x} ${start.y} A${r} ${r} 0 0 1 ${valEnd.x} ${valEnd.y}`}
          stroke="oklch(0.75 0.18 145)"
          strokeWidth="14"
          fill="none"
          strokeLinecap="round"
        />
        <g transform={`rotate(${angle} ${cx} ${cy})`}>
          <line x1={cx} y1={cy} x2={cx} y2={cy - r + 8} stroke="white" strokeWidth="2" />
          <circle cx={cx} cy={cy} r="6" fill="white" />
          <circle cx={cx} cy={cy} r="3" fill="oklch(0.18 0.04 250)" />
        </g>
      </svg>
      <div className="absolute inset-x-0 bottom-1 text-center font-mono text-[10px] tracking-[0.2em] text-bullish">
        GREED
      </div>
    </div>
  );
}

const feedItems = [
  {
    tag: "REGULATION",
    tagTone: "primary" as const,
    time: "2h ago",
    signal: { label: "Bullish", tone: "bullish" as const, Icon: TrendingUp },
    title: "SEC Approves Alternative Trading Systems for Tokenized Equities",
    desc: "The regulatory body has issued new guidelines permitting registered ATS platforms to facilitate secondary market trading of security tokens, providing a...",
  },
  {
    tag: "DEFI",
    tagTone: "amber" as const,
    time: "5h ago",
    signal: { label: "High Risk", tone: "bearish" as const, Icon: AlertTriangle },
    title: "Major Lending Protocol Suffers $12M Flash Loan Exploit",
    desc: "An attacker manipulated oracle price feeds across multiple pools. The core team has paused contracts. AI analysis suggests minimal contagion risk to wider Layer...",
  },
  {
    tag: "INFRASTRUCTURE",
    tagTone: "violet" as const,
    time: "12h ago",
    signal: { label: "Neutral", tone: "neutral" as const, Icon: () => <span>—</span> },
    title: "ZK-Rollup Network 'Nova' Announces Mainnet Phase 2",
    desc: "The upgrade introduces decentralized sequencing and proof generation. Benchmarks indicate a 40% reduction in L1 calldata costs. Developer adoption...",
  },
];

function tagClasses(tone: "primary" | "amber" | "violet") {
  if (tone === "amber") return "bg-amber/15 text-amber border-amber/30";
  if (tone === "violet") return "bg-[oklch(0.7_0.15_290)]/15 text-[oklch(0.78_0.15_290)] border-[oklch(0.7_0.15_290)]/30";
  return "bg-primary/15 text-primary border-primary/30";
}

function signalClasses(tone: "bullish" | "bearish" | "neutral") {
  if (tone === "bullish") return "text-bullish";
  if (tone === "bearish") return "text-bearish";
  return "text-muted-foreground";
}

export default function AnalysisPage() {
  usePageMeta(
    "Market Intelligence — CryptoInsight Hub",
    "Real-time macro analysis and AI-synthesized market signals for the decentralized ecosystem.",
  );
  return (
    <TerminalLayout>
      <div className="relative">
        <div className="absolute inset-0 glow-aurora-soft pointer-events-none" />
        <div className="relative mx-auto max-w-6xl px-8 py-10">
          {/* Header bar */}
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="font-display text-4xl font-semibold tracking-tight">
                Market Intelligence
              </h1>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                Real-time macro analysis and AI-synthesized market signals for the decentralized
                ecosystem.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  className="w-64 rounded-md border border-border bg-surface-2/60 px-9 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  placeholder="Search protocol, token..."
                />
              </div>
              <button className="inline-flex items-center gap-2 rounded-md border border-border bg-surface-2/60 px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
                <Download className="h-4 w-4" /> Export Data
              </button>
              <button className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:brightness-110">
                <RefreshCcw className="h-4 w-4" /> Refresh
              </button>
            </div>
          </div>

          {/* Global Market Overview */}
          <section className="panel mt-8 p-6">
            <div className="flex items-center justify-between">
              <h2 className="inline-flex items-center gap-2 font-display text-lg font-semibold">
                <LineChartIcon className="h-4 w-4 text-primary" /> Global Market Overview
              </h2>
              <div className="flex rounded-md border border-border bg-surface-2/60 p-1 text-xs">
                {["24h", "7d", "30d"].map((p, i) => (
                  <button
                    key={p}
                    className={`rounded px-3 py-1 ${
                      i === 0 ? "bg-primary/15 text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {kpis.map((k) => (
                <div
                  key={k.label}
                  className="rounded-lg border border-border bg-surface-2/40 p-4"
                >
                  <div className="text-xs text-muted-foreground">{k.label}</div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-display text-2xl font-semibold">{k.value}</span>
                    <span
                      className={`inline-flex items-center text-xs ${
                        k.up === true
                          ? "text-bullish"
                          : k.up === false
                            ? "text-bearish"
                            : "text-muted-foreground"
                      }`}
                    >
                      {k.up === true ? (
                        <ArrowUp className="h-3 w-3" />
                      ) : k.up === false ? (
                        <ArrowDown className="h-3 w-3" />
                      ) : null}
                      {k.delta}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-lg border border-border bg-background/60 p-4">
              <MarketChart />
            </div>
          </section>

          {/* AI Feed + Sentiment */}
          <section className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="panel p-6">
              <div className="flex items-center justify-between">
                <h2 className="inline-flex items-center gap-2 font-display text-lg font-semibold">
                  <Bot className="h-4 w-4 text-primary" /> AI Synthesizer
                </h2>
                <a href="#" className="text-sm text-primary hover:underline">
                  View Full Feed
                </a>
              </div>
              <div className="mt-5 space-y-4">
                {feedItems.map((item) => (
                  <article
                    key={item.title}
                    className="rounded-lg border border-border bg-surface-2/40 p-5 transition hover:border-primary/40"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span
                          className={`rounded-md border px-2 py-0.5 font-mono text-[10px] tracking-wider ${tagClasses(item.tagTone)}`}
                        >
                          {item.tag}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" /> {item.time}
                        </span>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 text-xs ${signalClasses(item.signal.tone)}`}
                      >
                        <item.signal.Icon className="h-3.5 w-3.5" /> {item.signal.label}
                      </span>
                    </div>
                    <h3 className="mt-3 font-display text-base font-semibold leading-snug">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {item.desc}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="panel p-6">
                <h2 className="inline-flex items-center gap-2 font-display text-lg font-semibold">
                  <BrainCircuit className="h-4 w-4 text-primary" /> Market Sentiment
                </h2>
                <SentimentGauge />
                <div className="mt-4 space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Social Volume</span>
                      <span className="text-foreground">High</span>
                    </div>
                    <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-surface-2">
                      <div className="h-full w-[82%] rounded-full bg-primary" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Volatility</span>
                      <span className="text-amber">Elevated</span>
                    </div>
                    <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-surface-2">
                      <div className="h-full w-[60%] rounded-full bg-amber" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-amber/40 bg-amber/5 p-5">
                <h3 className="inline-flex items-center gap-2 font-display font-semibold text-amber">
                  <AlertTriangle className="h-4 w-4" /> Active Alerts
                </h3>
                <ul className="mt-4 space-y-4 text-sm">
                  <li>
                    <div className="flex items-center gap-2 font-medium text-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber" />
                      High Network Congestion
                    </div>
                    <p className="mt-1 pl-3.5 text-xs leading-relaxed text-amber/80">
                      Ethereum base fee &gt; 50 gwei. Consider delaying non-urgent txs.
                    </p>
                  </li>
                  <li>
                    <div className="flex items-center gap-2 font-medium text-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-bearish" />
                      Stablecoin Depeg Risk
                    </div>
                    <p className="mt-1 pl-3.5 text-xs leading-relaxed text-bearish/80">
                      Minor algorithmic stablecoin showing 0.6% deviation from peg.
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </TerminalLayout>
  );
}
