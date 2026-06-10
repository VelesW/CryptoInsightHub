import { SiteLayout } from "@/components/site/SiteLayout";
import { usePageMeta } from "@/hooks/usePageMeta";
import { ArrowDown, ArrowUp, Star } from "lucide-react";

const rows = [
  { sym: "BTC", name: "Bitcoin", price: "$67,420.12", ch: "+2.4%", up: true, cap: "$1.32T" },
  { sym: "ETH", name: "Ethereum", price: "$3,512.88", ch: "+1.8%", up: true, cap: "$422B" },
  { sym: "SOL", name: "Solana", price: "$172.04", ch: "-3.1%", up: false, cap: "$78B" },
  { sym: "ARB", name: "Arbitrum", price: "$1.24", ch: "+5.7%", up: true, cap: "$3.2B" },
  { sym: "OP", name: "Optimism", price: "$2.08", ch: "-1.2%", up: false, cap: "$2.4B" },
  { sym: "AVAX", name: "Avalanche", price: "$36.12", ch: "+0.6%", up: true, cap: "$14B" },
];

export default function PricesPage() {
  usePageMeta(
    "Live Prices — CryptoInsight Hub",
    "Live cryptocurrency prices and 24h market movement.",
  );
  return (
    <SiteLayout>
      <section className="border-b border-border/70 bg-surface/30">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <h1 className="font-display text-4xl font-semibold tracking-tight">Live Prices</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Live market data across the most-tracked assets on the network.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="panel overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-surface-2/40 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-4">Asset</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">24h</th>
                <th className="px-6 py-4">Market Cap</th>
                <th className="px-6 py-4 text-right">Watch</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.sym}
                  className="border-b border-border/40 transition hover:bg-surface-2/30 last:border-0"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/15 font-mono text-xs font-semibold text-primary">
                        {r.sym.slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-display font-semibold">{r.name}</div>
                        <div className="font-mono text-xs text-muted-foreground">{r.sym}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono">{r.price}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 font-mono ${r.up ? "text-bullish" : "text-bearish"}`}
                    >
                      {r.up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                      {r.ch}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-muted-foreground">{r.cap}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-muted-foreground transition hover:text-amber">
                      <Star className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </SiteLayout>
  );
}
