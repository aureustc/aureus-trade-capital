"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

type Props = {
  className?: string;
  showLabel?: boolean;
};

export function ThemeToggle({ className = "", showLabel = false }: Props) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`theme-toggle inline-flex items-center gap-2 rounded-full border border-[var(--card-border)] bg-[var(--bg-card)] p-2 text-[var(--text-primary)] shadow-[var(--shadow-card)] transition hover:border-[var(--accent-soft-strong)] hover:shadow-[var(--glow)] sm:px-3 ${className}`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      <span className="relative flex h-5 w-5 items-center justify-center">
        <Sun
          className={`absolute h-4 w-4 text-[var(--accent)] transition-all duration-300 ${
            isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
          }`}
        />
        <Moon
          className={`absolute h-4 w-4 text-[var(--accent-hover)] transition-all duration-300 ${
            isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
          }`}
        />
      </span>
      {showLabel && (
        <span className="hidden text-xs font-semibold sm:inline">
          {isDark ? "Light" : "Dark"}
        </span>
      )}
    </button>
  );
}
