"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "atc-risk-notice-dismissed";

export function ComplianceBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(STORAGE_KEY);
      if (!dismissed) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] border-t border-[var(--accent)]/20 bg-[#060a14] px-4 py-3 shadow-[0_-4px_24px_rgba(0,0,0,0.4)] sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-white sm:text-sm">
          <span aria-hidden>⚠ </span>
          Forex trading involves significant risk. The ATC bot automates execution but does not
          guarantee profits. Trade responsibly.
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 rounded-full bg-[var(--accent)] px-5 py-2 text-xs font-semibold text-[var(--on-accent)] transition hover:bg-[var(--accent-hover)] sm:text-sm"
        >
          I Understand
        </button>
      </div>
    </div>
  );
}
