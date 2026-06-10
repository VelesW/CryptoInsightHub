import { Link } from "react-router-dom";
import { TerminalLayout } from "@/components/site/TerminalLayout";
import { usePageMeta } from "@/hooks/usePageMeta";
import { ArrowRight, Check, Clock, Code2, Key, Lock, Play } from "lucide-react";

type NodeState = "done" | "active" | "locked";

type RoadmapNode = {
  title: string;
  status: string;
  Icon: typeof Check;
  x: number;
  y: number;
  state: NodeState;
};

const nodes: RoadmapNode[] = [
  {
    title: "Blockchain Basics",
    status: "COMPLETED",
    Icon: Check,
    x: 12,
    y: 14,
    state: "done",
  },
  {
    title: "Cryptography",
    status: "COMPLETED",
    Icon: Key,
    x: 36,
    y: 46,
    state: "done",
  },
  {
    title: "Smart Contracts",
    status: "Module 201 • 65%",
    Icon: Code2,
    x: 58,
    y: 74,
    state: "active",
  },
  {
    title: "Advanced DeFi",
    status: "LOCKED",
    Icon: Lock,
    x: 84,
    y: 30,
    state: "locked",
  },
];

const edgeStyles: Record<
  NodeState,
  { stroke: string; strokeWidth: number; dash?: string }
> = {
  done: { stroke: "oklch(0.82 0.13 235 / 0.45)", strokeWidth: 1.5 },
  active: { stroke: "oklch(0.82 0.13 235)", strokeWidth: 2 },
  locked: { stroke: "oklch(0.45 0.03 250)", strokeWidth: 1.5, dash: "5 4" },
};

function curvePath(a: RoadmapNode, b: RoadmapNode) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const cp1x = a.x + dx * 0.5;
  const cp1y = a.y + dy * 0.1;
  const cp2x = a.x + dx * 0.5;
  const cp2y = a.y + dy * 0.9;
  return `M ${a.x} ${a.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${b.x} ${b.y}`;
}

function nodeRingClass(state: NodeState) {
  if (state === "active") {
    return "border-primary bg-primary/20 text-primary shadow-[0_0_30px_oklch(0.82_0.13_235/0.4)]";
  }
  if (state === "done") {
    return "border-primary/60 bg-background text-primary";
  }
  return "border-border bg-background text-muted-foreground";
}

function nodeLabelClass(state: NodeState) {
  if (state === "active") return "text-primary";
  if (state === "locked") return "text-muted-foreground";
  return "text-foreground";
}

function RoadmapDiagram() {
  return (
    <div className="relative mt-6 h-[420px] w-full">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {nodes.slice(0, -1).map((from, i) => {
          const to = nodes[i + 1];
          const style = edgeStyles[to.state];
          return (
            <path
              key={`${from.title}->${to.title}`}
              d={curvePath(from, to)}
              stroke={style.stroke}
              strokeWidth={style.strokeWidth}
              strokeDasharray={style.dash}
              strokeLinecap="round"
              fill="none"
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>

      {nodes.map((n) => (
        <div
          key={n.title}
          className="absolute -translate-x-1/2 -translate-y-1/2 text-center"
          style={{ top: `${n.y}%`, left: `${n.x}%` }}
        >
          <div
            className={`mx-auto grid h-14 w-14 place-items-center rounded-full border-2 ${nodeRingClass(
              n.state,
            )}`}
          >
            <n.Icon className="h-5 w-5" />
          </div>
          <div
            className={`mt-3 font-display text-sm font-semibold ${nodeLabelClass(
              n.state,
            )}`}
          >
            {n.title}
          </div>
          <div className="mt-0.5 font-mono text-[10px] tracking-wider text-muted-foreground">
            {n.status}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function RoadmapPage() {
  usePageMeta(
    "Learning Roadmap — CryptoInsight Hub",
    "Trace your evolution from foundational ledger mechanics to engineering advanced decentralized protocols.",
  );
  return (
    <TerminalLayout>
      <div className="relative">
        <div className="absolute inset-0 glow-aurora-soft pointer-events-none" />
        <div className="relative mx-auto max-w-6xl px-8 py-10">
          <div className="flex items-center gap-3 font-mono text-xs">
            <Link to="/analysis" className="text-primary hover:underline">
              PATHWAYS
            </Link>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">Web3 Developer Core</span>
          </div>
          <h1 className="mt-3 font-display text-5xl font-semibold tracking-tight text-foreground/90">
            Learning Roadmap
          </h1>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground">
            Trace your evolution from foundational ledger mechanics to engineering advanced
            decentralized protocols.
          </p>

          <div className="mt-10 grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="panel relative h-[520px] overflow-hidden p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold">Ecosystem Topology</h2>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" /> Active
                </span>
              </div>

              <RoadmapDiagram />
            </div>

            <aside className="panel flex flex-col p-6">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-[0.2em] text-primary">
                  MODULE 201
                </span>
                <span className="inline-flex items-center gap-1 rounded-md border border-border bg-surface-2/60 px-2 py-1 text-[10px] text-muted-foreground">
                  <Clock className="h-3 w-3" /> 2h 15m remaining
                </span>
              </div>
              <h3 className="mt-3 font-display text-3xl font-semibold leading-tight">
                Smart
                <br />
                Contracts
              </h3>

              <div className="mt-6">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Progress Updates</span>
                  <span className="font-display text-lg font-semibold text-primary">65%</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
                  <div className="h-full w-[65%] rounded-full bg-primary" />
                </div>
              </div>

              <div className="mt-6">
                <div className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
                  COMPLETED BLOCKS
                </div>
                <div className="mt-3 space-y-3">
                  {[
                    { t: "Solidity Syntax", d: "Variables, functions, and modifiers." },
                    {
                      t: "Gas Optimization",
                      d: "Storage pointers and execution cost limits.",
                    },
                  ].map((b) => (
                    <div
                      key={b.t}
                      className="rounded-lg border border-border bg-background/60 p-3"
                    >
                      <div className="flex items-center gap-2">
                        <span className="grid h-5 w-5 place-items-center rounded-full bg-primary text-primary-foreground">
                          <Check className="h-3 w-3" />
                        </span>
                        <span className="text-sm font-medium">{b.t}</span>
                      </div>
                      <p className="mt-1 pl-7 text-xs text-muted-foreground">{b.d}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 rounded-lg border border-border bg-surface-2/40 p-4">
                <div className="font-mono text-[10px] tracking-[0.2em] text-amber">UP NEXT</div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-sm font-semibold">Security Audits</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <button className="mt-5 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:brightness-110">
                <Play className="h-4 w-4 fill-current" /> Resume Module
              </button>
            </aside>
          </div>
        </div>
      </div>
    </TerminalLayout>
  );
}
