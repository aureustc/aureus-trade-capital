import type { ReactNode } from "react";
import Link from "next/link";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { ComplianceBanner } from "./ComplianceBanner";

type Section = {
  title: string;
  content: ReactNode;
};

type LegalPageShellProps = {
  title: string;
  subtitle?: string;
  sections: Section[];
};

export function LegalPageShell({ title, subtitle, sections }: LegalPageShellProps) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[var(--bg-primary)] pb-24 pt-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-hover)]"
          >
            ← Back to home
          </Link>
          <h1 className="font-heading mt-6 text-3xl font-semibold text-[var(--text-primary)] sm:text-4xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-3 text-sm text-[var(--text-secondary)]">{subtitle}</p>
          )}
          <div className="mt-10 space-y-10">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="font-heading text-xl font-semibold text-[var(--text-primary)]">
                  {section.title}
                </h2>
                <div className="mt-4 space-y-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                  {section.content}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <ComplianceBanner />
    </>
  );
}
