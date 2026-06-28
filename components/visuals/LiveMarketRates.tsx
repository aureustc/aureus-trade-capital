"use client";

import { useEffect, useRef, useState } from "react";

type Quote = {
  pair: string;
  rate: number;
  change: number;
  direction: "up" | "down" | "flat";
};

function formatRate(pair: string, rate: number) {
  if (pair === "XAU/USD") return rate.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (pair === "USD/JPY") return rate.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return rate.toFixed(4);
}

export function LiveMarketRates() {
  const [pairs, setPairs] = useState<Quote[]>([]);
  const [updatedAt, setUpdatedAt] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const prevRatesRef = useRef<Record<string, number>>({});

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/market");
        const data = await res.json();
        const raw: Quote[] = data.pairs ?? [];
        const prev = prevRatesRef.current;

        const enriched = raw.map((q) => {
          const old = prev[q.pair];
          if (old === undefined) return { ...q, change: 0, direction: "flat" as const };
          const pct = ((q.rate - old) / old) * 100;
          const change = Math.round(Math.abs(pct) * 100) / 100;
          const direction: Quote["direction"] =
            pct > 0.001 ? "up" : pct < -0.001 ? "down" : "flat";
          return { ...q, change, direction };
        });

        setPairs(enriched);
        prevRatesRef.current = Object.fromEntries(raw.map((q) => [q.pair, q.rate]));
        setUpdatedAt(data.updatedAt ?? "");
      } catch {
        setPairs([]);
      } finally {
        setLoading(false);
      }
    }
    load();
    const id = setInterval(load, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="widget-card overflow-hidden p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-[var(--text-primary)]">Live Market Rates</p>
          <p className="text-[10px] text-[var(--text-secondary)]">
            Forex pairs &amp; XAU/USD · refreshes every 30s
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-soft-md)] px-2.5 py-1 text-[10px] font-semibold text-[var(--accent-deep)]">
          <span
            className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]"
            style={{ animation: "pulse-live 2s ease-in-out infinite" }}
          />
          LIVE
        </span>
      </div>

      <div className="mt-4 space-y-2">
        {loading && pairs.length === 0 ? (
          <p className="py-6 text-center text-sm text-[var(--text-secondary)]">Loading rates…</p>
        ) : (
          pairs.map((q) => (
            <div
              key={q.pair}
              className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
                q.pair === "XAU/USD"
                  ? "border-[var(--accent-soft-strong)] bg-[var(--accent-soft)]"
                  : "border-[var(--card-border)] bg-[var(--bg-primary)]"
              }`}
            >
              <div>
                <p className="text-xs font-semibold text-[var(--text-primary)]">{q.pair}</p>
                {q.pair === "XAU/USD" && (
                  <p className="text-[10px] text-[var(--text-secondary)]">Gold · Safe haven</p>
                )}
              </div>
              <div className="text-right">
                <p className="font-heading text-lg font-bold text-[var(--text-primary)]">
                  {formatRate(q.pair, q.rate)}
                </p>
                <p
                  className={`text-xs font-medium ${
                    q.direction === "up"
                      ? "text-[var(--positive)]"
                      : q.direction === "down"
                        ? "text-[var(--negative)]"
                        : "text-[var(--text-secondary)]"
                  }`}
                >
                  {q.direction === "up" ? "▲" : q.direction === "down" ? "▼" : "—"}{" "}
                  {q.change > 0 ? `${q.change}%` : "0.00%"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {updatedAt && (
        <p className="mt-3 text-center text-[10px] text-[var(--text-secondary)]">
          Updated {new Date(updatedAt).toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}
