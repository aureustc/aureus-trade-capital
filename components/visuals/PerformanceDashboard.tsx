const metrics = [
  { label: "Win rate", value: "68%", width: "68%" },
  { label: "Avg. execution", value: "98ms", width: "92%" },
  { label: "Risk score", value: "Low", width: "35%" },
  { label: "Uptime", value: "99.8%", width: "99%" },
] as const;

const pairs = [
  { pair: "XAU/USD", pnl: "+2.4%", positive: true },
  { pair: "EUR/USD", pnl: "+0.8%", positive: true },
  { pair: "GBP/USD", pnl: "-0.3%", positive: false },
] as const;

export function PerformanceDashboard() {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--bg-card)] shadow-[var(--glow-strong)]">
      <div className="flex items-center justify-between border-b border-[var(--card-border)] px-4 py-3 sm:px-5">
        <div>
          <p className="text-xs font-semibold text-[var(--text-primary)]">
            ATC Performance Overview
          </p>
          <p className="text-[10px] text-[var(--text-secondary)]">Last 30 days · Demo stats</p>
        </div>
        <span className="rounded-lg bg-[var(--accent-soft-md)] px-2.5 py-1 text-[10px] font-semibold text-[var(--accent-deep)]">
          Live sync
        </span>
      </div>

      <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5">
        <div className="space-y-3">
          {metrics.map((m) => (
            <div key={m.label}>
              <div className="flex justify-between text-[10px] sm:text-xs">
                <span className="text-[var(--text-secondary)]">{m.label}</span>
                <span className="font-semibold text-[var(--text-primary)]">{m.value}</span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[var(--bg-primary)]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)]"
                  style={{ width: m.width }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col justify-center rounded-xl border border-[var(--card-border)] bg-[var(--bg-card)] p-4">
          <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-secondary)]">
            Equity curve
          </p>
          <svg viewBox="0 0 200 100" className="mt-3 h-24 w-full sm:h-28" aria-hidden>
            <path
              d="M8,85 L40,78 L72,70 L104,58 L136,48 L168,38 L192,28"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M8,85 L40,78 L72,70 L104,58 L136,48 L168,38 L192,28 L192,92 L8,92 Z"
              fill="var(--accent-soft-md)"
            />
          </svg>
          <p className="mt-2 text-center text-lg font-semibold text-[var(--positive)]">+12.8%</p>
          <p className="text-center text-[10px] text-[var(--text-secondary)]">
            Portfolio growth
          </p>
        </div>
      </div>

      <div className="border-t border-[var(--card-border)] px-4 py-3 sm:px-5">
        <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-[var(--text-secondary)]">
          Pair breakdown
        </p>
        <div className="space-y-2">
          {pairs.map((p) => (
            <div
              key={p.pair}
              className="flex items-center justify-between rounded-lg bg-[var(--bg-card)] px-3 py-2"
            >
              <span className="text-xs font-medium text-[var(--text-primary)]">{p.pair}</span>
              <span
                className={`text-xs font-semibold ${
                  p.positive ? "text-[var(--positive)]" : "text-[var(--negative)]"
                }`}
              >
                {p.pnl}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
