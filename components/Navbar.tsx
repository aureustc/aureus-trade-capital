"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

const NAV = [
  { href: "#home", label: "Home", id: "home" },
  { href: "#about", label: "About", id: "about" },
  { href: "#bot-features", label: "Bot Features", id: "bot-features" },
  { href: "#pricing", label: "Pricing", id: "pricing" },
  { href: "#faq", label: "FAQ", id: "faq" },
  { href: "#contact", label: "Contact", id: "contact" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("home");

  useEffect(() => {
    const update = () => {
      setScrolled(window.scrollY > 20);
      const y = window.scrollY + 160;
      let current = "home";
      for (const { id } of NAV) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top <= y) current = id;
      }
      setActive(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-[var(--card-border)] bg-[var(--bg-primary)]/95 backdrop-blur-xl shadow-[var(--shadow-card)]"
          : "border-b border-transparent bg-[var(--bg-primary)]/70 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        <Link
          href="#home"
          className="group flex items-center gap-2.5"
          onClick={() => setOpen(false)}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--accent-hover)] to-[var(--accent-deep)] font-heading text-sm font-bold text-[var(--on-accent)] shadow-[var(--glow)]">
            ATC
          </span>
          <div className="hidden leading-tight sm:block">
            <span className="block font-heading text-sm font-bold text-[var(--text-primary)]">
              Aureus Trade Capital
            </span>
            <span className="text-[10px] font-medium text-[var(--accent)]">
              AI Forex Bot
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-4 lg:flex lg:gap-5">
          {NAV.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`text-sm font-medium transition hover:text-[var(--accent-hover)] ${
                active === item.id ? "text-[var(--accent)]" : "text-[var(--text-secondary)]"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
          <Link
            href="#pricing"
            className="btn-primary inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-semibold"
          >
            Get the Bot
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex rounded-lg border border-[var(--card-border)] p-2 text-[var(--text-primary)]"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-[var(--card-border)] bg-[var(--bg-secondary)] lg:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {NAV.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium ${
                    active === item.id
                      ? "bg-[var(--accent-soft-md)] text-[var(--accent-deep)]"
                      : "text-[var(--text-secondary)]"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="text-xs font-medium text-[var(--text-secondary)]">Theme</span>
                <ThemeToggle showLabel />
              </div>
              <Link
                href="#pricing"
                onClick={() => setOpen(false)}
                className="btn-primary mt-2 inline-flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold"
              >
                Get the Bot
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
