import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import "./dashboard.css";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div data-theme="dark" className="dashboard-theme min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <header className="flex items-center justify-between border-b border-[var(--card-border)] bg-[#060a14] px-4 py-3 lg:hidden">
        <Link href="/">
          <Image src="/logo2.png" alt="ATC" width={80} height={80} className="h-8 w-auto" />
        </Link>
        <Link href="/" className="text-xs text-[var(--text-secondary)]">
          ← Home
        </Link>
      </header>
      {children}
    </div>
  );
}
