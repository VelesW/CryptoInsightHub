import { SiteLayout } from "@/components/site/SiteLayout";
import { usePageMeta } from "@/hooks/usePageMeta";
import {
  ArrowRight,
  Boxes,
  Code2,
  GraduationCap,
  Search,
  ShieldCheck,
  Wallet,
} from "lucide-react";

const modules = [
  {
    code: "101",
    title: "Blockchain Basics",
    desc: "Understand distributed ledgers, consensus mechanisms, and the foundational cryptography powering Web3.",
    icon: Boxes,
    count: "4 Modules",
  },
  {
    code: "201",
    title: "DeFi & Smart Contracts",
    desc: "Dive into automated market makers, liquidity pools, and executing complex programmable logic.",
    icon: Code2,
    count: "6 Modules",
  },
  {
    code: "301",
    title: "Web3 Security",
    desc: "Identify common vulnerabilities, wallet hygiene, and audit principles to protect digital assets.",
    icon: ShieldCheck,
    count: "3 Modules",
  },
];

const glossary = [
  {
    term: "Impermanent Loss",
    def: "The temporary loss of funds experienced by liquidity providers due to volatility in a trading pair.",
  },
  {
    term: "MEV (Maximal Extractable Value)",
    def: "The maximum value that can be extracted from block production in excess of standard block rewards and gas fees.",
  },
  {
    term: "Zero-Knowledge Proof",
    def: "A cryptographic method by which one party can prove to another that a given statement is true without conveying any other information.",
  },
  {
    term: "Slashing",
    def: "A mechanism built into Proof of Stake blockchains to punish validators for malicious behavior or downtime.",
  },
];

export default function LearningPage() {
  usePageMeta(
    "Education Center — CryptoInsight Hub",
    "Structured learning paths, technical glossary, and verifiable on-chain credentials for Web3 builders.",
  );
  return (
    <SiteLayout>
      <section className="relative overflow-hidden border-b border-border/70">
        <div className="absolute inset-0 glow-aurora-soft" />
        <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-14 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2/60 px-4 py-1.5 text-[11px] font-medium tracking-[0.18em] text-primary">
            <GraduationCap className="h-3.5 w-3.5" /> ACADEMY PORTAL
          </span>
          <h1 className="mt-6 font-display text-5xl font-semibold tracking-tight">
            Master the Decentralized Future
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Structured learning paths, comprehensive technical glossaries, and verifiable credentials
            to elevate your blockchain expertise.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold">Learning Modules</h2>
          <a href="#" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
            View All Paths <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {modules.map((m) => (
            <article
              key={m.code}
              className="panel group flex flex-col gap-5 p-6 transition hover:border-primary/50"
            >
              <div className="flex items-start justify-between">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-amber/15 text-amber">
                  <m.icon className="h-5 w-5" />
                </div>
                <span className="rounded-md border border-border bg-surface-2 px-2 py-0.5 font-mono text-xs text-muted-foreground">
                  {m.code}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-display text-xl font-semibold">{m.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{m.desc}</p>
              </div>
              <div className="flex items-center justify-between border-t border-border/60 pt-4">
                <span className="text-xs text-muted-foreground">{m.count}</span>
                <button className="rounded-md border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary/20">
                  Start Path
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="panel grid gap-8 p-8 lg:grid-cols-[1fr_2fr]">
          <div>
            <h2 className="font-display text-2xl font-semibold">Terminal Glossary</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Quickly decode industry jargon and technical parameters.
            </p>
            <div className="relative mt-5">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                className="w-full rounded-md border border-border bg-surface-2/60 px-9 py-2.5 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                placeholder="Search terms (e.g. 'Slippage', 'MEV')..."
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {["All Terms", "DeFi", "Consensus", "L2"].map((t, i) => (
                <button
                  key={t}
                  className={`rounded-full border px-3 py-1 text-xs ${
                    i === 0
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {glossary.map((g) => (
              <div
                key={g.term}
                className="rounded-lg border border-border bg-surface-2/40 p-5 transition hover:border-primary/40"
              >
                <h4 className="font-display font-semibold text-primary">{g.term}</h4>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{g.def}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="flex flex-col justify-center">
            <span className="inline-flex items-center gap-2 text-xs font-medium text-amber">
              <ShieldCheck className="h-4 w-4" /> Proof of Knowledge
            </span>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight">
              On-Chain Credentials
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              Upon completing a learning path, mint a soulbound NFT certificate to your connected
              wallet. Your achievements are cryptographically verifiable and permanent.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <button className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:brightness-110">
                <Wallet className="h-4 w-4" /> Connect Wallet
              </button>
              <a href="#" className="text-sm text-foreground underline-offset-4 hover:underline">
                View Contracts
              </a>
            </div>
          </div>
          <div className="panel relative overflow-hidden p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground">
                  CERTIFICATE OF COMPLETION
                </div>
                <div className="mt-1 font-display text-2xl font-semibold">DeFi Architecture</div>
              </div>
              <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/15 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </div>
            <div className="relative mt-6 grid aspect-[16/9] place-items-center overflow-hidden rounded-xl border border-border bg-background">
              <div className="absolute inset-0 glow-aurora opacity-40" />
              <svg
                className="absolute inset-0 h-full w-full opacity-30"
                viewBox="0 0 400 220"
                fill="none"
              >
                {Array.from({ length: 14 }).map((_, i) => {
                  const a = { x: 50 + ((i * 37) % 300), y: 30 + ((i * 53) % 160) };
                  const b = {
                    x: 60 + ((i * 71 + 40) % 300),
                    y: 40 + ((i * 91 + 30) % 160),
                  };
                  return (
                    <g key={i}>
                      <line
                        x1={a.x}
                        y1={a.y}
                        x2={b.x}
                        y2={b.y}
                        stroke="currentColor"
                        className="text-primary"
                        strokeWidth="0.5"
                      />
                      <circle cx={a.x} cy={a.y} r="2" className="fill-primary" />
                    </g>
                  );
                })}
              </svg>
              <div className="relative text-center">
                <div className="font-display text-6xl font-semibold text-primary">201</div>
                <div className="mt-1 text-[11px] font-medium tracking-[0.2em] text-muted-foreground">
                  ADVANCED MODULE
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between text-xs">
              <div>
                <div className="text-muted-foreground">Issued to</div>
                <div className="font-mono text-foreground">0x71C...39bA</div>
              </div>
              <div className="text-right">
                <div className="text-muted-foreground">Date</div>
                <div className="font-mono text-foreground">Oct 24, 2024</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
