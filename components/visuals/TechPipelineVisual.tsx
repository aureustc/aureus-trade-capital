function FlowArrow({ vertical = false }: { vertical?: boolean }) {
  if (vertical) {
    return (
      <div className="flex justify-center py-1 sm:hidden">
        <svg width="24" height="40" viewBox="0 0 24 40" aria-hidden>
          <defs>
            <marker id="arrowDown" markerWidth="8" markerHeight="8" refX="4" refY="7" orient="auto">
              <path d="M0,0 L4,8 L8,0 Z" fill="#c9a227" />
            </marker>
          </defs>
          <line
            x1="12"
            y1="4"
            x2="12"
            y2="32"
            stroke="#c9a227"
            strokeWidth="2.5"
            strokeLinecap="round"
            markerEnd="url(#arrowDown)"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="relative hidden shrink-0 items-center justify-center px-2 sm:flex">
      <svg width="56" height="28" viewBox="0 0 56 28" aria-hidden>
        <defs>
          <linearGradient id="arrowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c9a227" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#dbb94a" />
          </linearGradient>
          <marker
            id="arrowHead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="5"
            orient="auto"
          >
            <path d="M0,0 L10,5 L0,10 Z" fill="#c9a227" />
          </marker>
        </defs>
        <line
          x1="6"
          y1="14"
          x2="46"
          y2="14"
          stroke="url(#arrowGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          markerEnd="url(#arrowHead)"
        />
        <circle cx="20" cy="14" r="3" fill="#93c5fd">
          <animate attributeName="cx" values="16;42;16" dur="2.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;1;0.5" dur="2.2s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
}

const nodes = [
  { label: "Live Market Data", sub: "Ticks & spreads" },
  { label: "ATC AI Engine", sub: "ML + patterns" },
  { label: "Your MT5", sub: "Local execution" },
] as const;

function PipelineNode({ label, sub }: { label: string; sub: string }) {
  return (
    <div className="flex w-full flex-col rounded-xl border border-[var(--card-border)] bg-[var(--bg-card)] px-4 py-4 text-center shadow-[var(--shadow-card)] sm:min-h-[88px] sm:flex-1 sm:justify-center">
      <p className="text-xs font-semibold leading-snug text-[var(--text-primary)] sm:text-sm">
        {label}
      </p>
      <p className="mt-1 text-[10px] text-[var(--text-secondary)] sm:text-xs">{sub}</p>
    </div>
  );
}

export function TechPipelineVisual() {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--bg-card)] p-4 sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          Bot architecture
        </span>
        <span className="text-[10px] font-medium text-[var(--accent-hover)]">
          Real-time pipeline
        </span>
      </div>

      {/* Desktop: horizontal with arrows between */}
      <div className="hidden items-center sm:flex">
        {nodes.map((node, i) => (
          <div key={node.label} className="flex flex-1 items-center">
            <PipelineNode label={node.label} sub={node.sub} />
            {i < nodes.length - 1 && <FlowArrow />}
          </div>
        ))}
      </div>

      {/* Mobile: vertical stack */}
      <div className="flex flex-col sm:hidden">
        {nodes.map((node, i) => (
          <div key={node.label}>
            <PipelineNode label={node.label} sub={node.sub} />
            {i < nodes.length - 1 && <FlowArrow vertical />}
          </div>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
        {["Ingest", "Analyze", "Execute"].map((step) => (
          <div
            key={step}
            className="rounded-lg border border-[var(--card-border)] bg-[var(--bg-primary)] py-2.5 text-center text-[10px] font-semibold text-[var(--accent-hover)] sm:text-xs"
          >
            {step}
          </div>
        ))}
      </div>
    </div>
  );
}
