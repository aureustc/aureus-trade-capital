"use client";

import Link from "next/link";
import { Camera, Link2, Send, Users } from "lucide-react";

const links = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Bot Features", href: "#bot-features" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
  { label: "Privacy Policy", href: "#" },
  { label: "Terms & Conditions", href: "#" },
] as const;

const socials = [
  { label: "LinkedIn", href: "#", icon: Link2 },
  { label: "Instagram", href: "#", icon: Camera },
  { label: "Facebook", href: "#", icon: Users },
  { label: "Telegram", href: "#", icon: Send },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-[var(--card-border)] bg-[#060a14] py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <Link href="#home" className="flex items-center gap-3">
              <span className="pro-card-icon-ring flex h-10 w-10 items-center justify-center font-heading text-lg font-semibold text-[var(--accent-deep)]">
                ATC
              </span>
              <span className="font-heading text-lg font-semibold text-[var(--text-primary)]">
                Aureus Trade Capital
              </span>
            </Link>
            <p className="mt-4 text-sm text-[var(--text-secondary)]">
              Smart Bot. Smarter Trading.
            </p>
            <div className="mt-6 flex gap-3">
              {socials.map(({ label, href, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--card-border)] text-[var(--text-secondary)] transition hover:border-[var(--accent)]/40 hover:text-[var(--accent-hover)] hover:shadow-[var(--glow)]"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          <div className="md:col-span-1 lg:col-span-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
              Links
            </h3>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
              {links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-[var(--text-secondary)] transition hover:text-[var(--accent-hover)]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-10 text-xs leading-relaxed text-[var(--text-secondary)]">
          Forex trading involves substantial risk. The ATC bot automates execution but
          does not guarantee profits. Aureus Trade Capital does not manage client funds or
          act as a broker. Trade responsibly.
        </p>
        <p className="mt-4 text-xs text-[var(--text-secondary)]/80">
          © 2026 Aureus Trade Capital. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
