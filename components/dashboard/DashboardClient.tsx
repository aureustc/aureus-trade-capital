"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import {
  Copy,
  CreditCard,
  Download,
  Eye,
  EyeOff,
  FileText,
  LayoutDashboard,
  KeyRound,
  LifeBuoy,
  Loader2,
  LogOut,
  User,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { RenewalModal } from "@/components/dashboard/RenewalModal";
import {
  clearPendingPayment,
  daysRemaining,
  formatLicenseDate,
  isLicenseActive,
  loadPendingPayment,
  maskLicenseKey,
  type LicenseRecord,
} from "@/lib/licenses";
import { PAYMENT_EMAIL, periodLabels } from "@/lib/paymentDetails";

type Tab = "overview" | "license" | "downloads" | "billing" | "support" | "account";

type Ticket = {
  id: string;
  subject: string;
  category: string;
  status: string;
  created_at: string;
};

const TICKET_CATEGORIES = [
  "Installation Help",
  "License Issue",
  "Payment Issue",
  "Strategy Config",
  "General Inquiry",
] as const;

const NAV: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "license", label: "My License", icon: KeyRound },
  { id: "downloads", label: "Downloads", icon: Download },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "support", label: "Support", icon: LifeBuoy },
  { id: "account", label: "Account", icon: User },
];

function sidebarNavClass(active: boolean) {
  return active
    ? "border-l-2 border-[var(--accent)] bg-[var(--accent-soft-md)] text-[var(--accent)]"
    : "border-l-2 border-transparent text-[#c4bfb8] hover:bg-[rgba(219,185,74,0.12)] hover:text-[#f5f3ef]";
}

function mobileNavClass(active: boolean) {
  return active ? "text-[var(--accent)]" : "text-[#a8a29e]";
}

const FIELD =
  "dashboard-field mt-1 w-full rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)]";
const OUTLINE_BTN =
  "dashboard-outline-btn rounded-xl px-4 py-2.5 text-sm font-medium text-[var(--text-primary)]";

export function DashboardClient() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const searchParams = useSearchParams();
  const paymentSuccess = searchParams.get("payment") === "success";

  const [tab, setTab] = useState<Tab>("overview");
  const [license, setLicense] = useState<LicenseRecord | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [renewOpen, setRenewOpen] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloadModal, setDownloadModal] = useState<string | null>(null);

  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketCategory, setTicketCategory] = useState<string>(TICKET_CATEGORIES[0]);
  const [ticketMessage, setTicketMessage] = useState("");
  const [ticketSuccess, setTicketSuccess] = useState(false);
  const [ticketSubmitting, setTicketSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const userEmail = user?.emailAddresses[0]?.emailAddress ?? "";
  const displayName =
    user?.firstName ||
    user?.fullName ||
    userEmail.split("@")[0] ||
    "Trader";

  const loadData = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard");
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const data = await res.json();
      setLicense(data.license ?? null);
      setTickets(data.tickets ?? []);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoaded && user) void loadData();
    if (isLoaded && !user) setLoading(false);
  }, [isLoaded, user, loadData]);

  useEffect(() => {
    if (paymentSuccess && user) {
      void loadData();
    }
  }, [paymentSuccess, user, loadData]);

  useEffect(() => {
    async function fulfillPending() {
      if (!user) return;
      const pending = loadPendingPayment();
      if (!pending) return;

      const res = await fetch("/api/licenses/fulfill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id: pending.razorpay_order_id,
          razorpay_payment_id: pending.razorpay_payment_id,
          razorpay_signature: pending.razorpay_signature,
          period: pending.period,
        }),
      });

      if (res.ok) {
        clearPendingPayment();
        void loadData();
      }
    }

    void fulfillPending();
  }, [user, loadData]);

  function handleSignOut() {
    signOut({ redirectUrl: "/" });
  }

  async function handleCopyKey() {
    if (!license?.license_key) return;
    await navigator.clipboard.writeText(license.license_key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleSubmitTicket(e: React.FormEvent) {
    e.preventDefault();
    if (ticketMessage.length < 20) return;
    setTicketSubmitting(true);
    setTicketSuccess(false);

    const res = await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: ticketSubject,
        category: ticketCategory,
        message: ticketMessage,
      }),
    });

    setTicketSubmitting(false);
    if (!res.ok) return;

    setTicketSuccess(true);
    setTicketSubject("");
    setTicketMessage("");
    void loadData();
  }

  async function handleDeleteAccount() {
    const res = await fetch("/api/account/delete", { method: "POST" });
    if (res.ok) {
      signOut({ redirectUrl: "/" });
    }
  }

  if (!isLoaded || loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-[var(--bg-primary)]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--accent)]" />
      </div>
    );
  }

  const active = license && isLicenseActive(license);
  const openTickets = tickets.filter((t) => t.status === "open" || t.status === "in_progress").length;
  const remaining = license ? daysRemaining(license.expires_at) : null;

  return (
    <>
      <div className="flex min-h-[calc(100vh-4rem)] flex-col lg:flex-row">
        <aside className="hidden w-64 shrink-0 flex-col border-r border-[var(--card-border)] bg-[#060a14] lg:flex">
          <div className="border-b border-[var(--card-border)] p-5">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo2.png" alt="ATC" width={80} height={80} className="h-8 w-auto" />
            </Link>
          </div>
          <nav className="flex-1 space-y-1 p-4">
            {NAV.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${sidebarNavClass(tab === id)}`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${tab === id ? "text-[var(--accent)]" : "text-current"}`} />
                {label}
              </button>
            ))}
          </nav>
          <div className="border-t border-[var(--card-border)] p-4">
            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#a8a29e] transition-colors hover:bg-[rgba(248,113,113,0.1)] hover:text-[#fca5a5]"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </aside>

        <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-[var(--card-border)] bg-[#060a14] lg:hidden">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] transition-colors ${mobileNavClass(tab === id)}`}
            >
              <Icon className="h-4 w-4" />
              <span className="max-w-[4.5rem] truncate">{label}</span>
            </button>
          ))}
        </nav>

        <main className="flex-1 overflow-y-auto p-6 pb-24 lg:p-8">
          {paymentSuccess && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
              <span className="text-emerald-400">✓</span>
              <div>
                <p className="text-sm font-semibold text-emerald-400">Payment Successful!</p>
                <p className="text-xs text-[var(--text-secondary)]">
                  Your license is now active. Check the My License tab for your license key.
                </p>
              </div>
            </div>
          )}

          {tab === "overview" && (
            <div>
              <h1 className="font-heading text-2xl font-semibold text-[var(--text-primary)]">
                Welcome back, {displayName}
              </h1>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">Your ATC Bot dashboard</p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="pro-card p-5">
                  <p className="text-xs font-medium uppercase text-[var(--text-secondary)]">
                    License Status
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        active ? "bg-[var(--positive)]" : license ? "bg-[var(--negative)]" : "bg-gray-500"
                      }`}
                    />
                    <span className="font-semibold text-[var(--text-primary)]">
                      {!license ? "No License" : active ? "Active" : "Expired"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[var(--text-secondary)]">
                    {license ? "ATC Bot License" : "Purchase to activate"}
                  </p>
                </div>

                <div className="pro-card p-5">
                  <p className="text-xs font-medium uppercase text-[var(--text-secondary)]">
                    Expiry Date
                  </p>
                  <p className="mt-2 font-semibold text-[var(--text-primary)]">
                    {license ? formatLicenseDate(license.expires_at) : "—"}
                  </p>
                  {remaining !== null && (
                    <p className="mt-1 text-xs text-[var(--text-secondary)]">
                      {remaining} days remaining
                    </p>
                  )}
                  {license && !license.expires_at && (
                    <p className="mt-1 text-xs text-[var(--text-secondary)]">Lifetime access</p>
                  )}
                </div>

                <div className="pro-card p-5">
                  <p className="text-xs font-medium uppercase text-[var(--text-secondary)]">
                    Open Tickets
                  </p>
                  <p className="mt-2 font-heading text-2xl font-bold text-[var(--accent)]">
                    {openTickets}
                  </p>
                  <button
                    type="button"
                    onClick={() => setTab("support")}
                    className="mt-1 text-xs font-medium text-[var(--accent)] hover:underline"
                  >
                    View tickets
                  </button>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setDownloadModal("guide")}
                  className={OUTLINE_BTN}
                >
                  Download Setup Guide
                </button>
                <button
                  type="button"
                  onClick={() => setTab("support")}
                  className={OUTLINE_BTN}
                >
                  Submit Support Ticket
                </button>
                <button
                  type="button"
                  onClick={() => setRenewOpen(true)}
                  className="btn-primary rounded-xl px-4 py-2.5 text-sm font-semibold"
                >
                  Renew / Upgrade
                </button>
              </div>
            </div>
          )}

          {tab === "license" && (
            <div>
              <h1 className="font-heading text-2xl font-semibold text-[var(--text-primary)]">
                My License
              </h1>

              {!license || !active ? (
                <div className="pro-card mt-8 p-8 text-center">
                  <p className="text-[var(--text-secondary)]">No active license found</p>
                  <Link
                    href="/#pricing"
                    className="btn-primary mt-4 inline-block rounded-xl px-6 py-2.5 text-sm font-semibold"
                  >
                    Get Your License
                  </Link>
                </div>
              ) : (
                <>
                  <div className="pro-card mt-6 p-5">
                    <p className="text-xs font-medium uppercase text-[var(--text-secondary)]">
                      License Key
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <code className="flex-1 rounded-lg bg-[#060a14] px-4 py-3 font-mono text-sm text-[var(--accent)]">
                        {showKey ? license.license_key : maskLicenseKey(license.license_key)}
                      </code>
                      <button
                        type="button"
                        onClick={() => setShowKey((v) => !v)}
                        className={`dashboard-outline-btn flex items-center gap-1 rounded-lg px-3 py-2 text-xs text-[var(--text-primary)]`}
                      >
                        {showKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        {showKey ? "Hide" : "Show"}
                      </button>
                      <button
                        type="button"
                        onClick={handleCopyKey}
                        className={`dashboard-outline-btn flex items-center gap-1 rounded-lg px-3 py-2 text-xs text-[var(--text-primary)]`}
                      >
                        <Copy className="h-3.5 w-3.5" />
                        {copied ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  </div>

                  <div className="pro-card mt-4 overflow-x-auto">
                    <table className="w-full min-w-[480px] text-left text-sm">
                      <thead>
                        <tr className="border-b border-[var(--card-border)] text-[var(--text-secondary)]">
                          <th className="p-3 font-medium">Plan</th>
                          <th className="p-3 font-medium">Period</th>
                          <th className="p-3 font-medium">Status</th>
                          <th className="p-3 font-medium">Purchase Date</th>
                          <th className="p-3 font-medium">Expiry</th>
                          <th className="p-3 font-medium">Amount Paid</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="text-[var(--text-primary)]">
                          <td className="p-3">ATC Bot</td>
                          <td className="p-3">{periodLabels[license.period] ?? license.period}</td>
                          <td className="p-3 capitalize">{license.status}</td>
                          <td className="p-3">{formatLicenseDate(license.purchased_at)}</td>
                          <td className="p-3">{formatLicenseDate(license.expires_at)}</td>
                          <td className="p-3">
                            {license.amount_paid
                              ? `₹${(license.amount_paid / 100).toLocaleString("en-IN")}`
                              : "—"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setDownloadModal("bot")}
                      className="btn-primary flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
                    >
                      <Download className="h-4 w-4" />
                      Download ATC Bot (.ex5)
                    </button>
                    <button
                      type="button"
                      onClick={() => setDownloadModal("guide")}
                      className={OUTLINE_BTN}
                    >
                      Download Setup Guide (PDF)
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {tab === "downloads" && (
            <div>
              <h1 className="font-heading text-2xl font-semibold text-[var(--text-primary)]">
                Downloads
              </h1>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Bot files, setup guides, and documentation
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="pro-card p-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-[var(--accent-soft)] p-3">
                      <Download className="h-5 w-5 text-[var(--accent)]" />
                    </div>
                    <div className="flex-1">
                      <h2 className="font-heading font-semibold text-[var(--text-primary)]">
                        ATC Bot (.ex5)
                      </h2>
                      <p className="mt-1 text-sm text-[var(--text-secondary)]">
                        MetaTrader 5 Expert Advisor — requires an active license
                      </p>
                      <button
                        type="button"
                        disabled={!active}
                        onClick={() => setDownloadModal("bot")}
                        className="btn-primary mt-4 rounded-xl px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {active ? "Download Bot" : "License Required"}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pro-card p-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-[var(--accent-soft)] p-3">
                      <FileText className="h-5 w-5 text-[var(--accent)]" />
                    </div>
                    <div className="flex-1">
                      <h2 className="font-heading font-semibold text-[var(--text-primary)]">
                        Setup Guide (PDF)
                      </h2>
                      <p className="mt-1 text-sm text-[var(--text-secondary)]">
                        Step-by-step MT5 installation and license activation
                      </p>
                      <button
                        type="button"
                        onClick={() => setDownloadModal("guide")}
                        className="mt-4 rounded-xl border border-[var(--card-border)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] transition hover:border-[var(--accent-soft-strong)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
                      >
                        Download Guide
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pro-card mt-6 p-6">
                <h2 className="font-heading text-lg font-semibold text-[var(--text-primary)]">
                  Quick Start
                </h2>
                <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-[var(--text-secondary)]">
                  <li>Install MetaTrader 5 on your VPS or local machine</li>
                  <li>Download and attach the ATC Bot to your chart</li>
                  <li>Enter your license key from the My License tab</li>
                  <li>Enable Algo Trading and verify your broker connection</li>
                </ol>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href="/risk-disclosure"
                    className="text-sm font-medium text-[var(--accent)] hover:underline"
                  >
                    Risk Disclosure
                  </Link>
                  <Link
                    href="/terms-and-conditions"
                    className="text-sm font-medium text-[var(--accent)] hover:underline"
                  >
                    Terms & Conditions
                  </Link>
                  <button
                    type="button"
                    onClick={() => setTab("support")}
                    className="text-sm font-medium text-[var(--accent)] hover:underline"
                  >
                    Need help? Open a ticket
                  </button>
                </div>
              </div>
            </div>
          )}

          {tab === "billing" && (
            <div>
              <h1 className="font-heading text-2xl font-semibold text-[var(--text-primary)]">
                Billing
              </h1>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Plans, payments, and renewals
              </p>

              {!license ? (
                <div className="pro-card mt-8 p-8 text-center">
                  <p className="text-[var(--text-secondary)]">No purchase history yet</p>
                  <Link
                    href="/#pricing"
                    className="btn-primary mt-4 inline-block rounded-xl px-6 py-2.5 text-sm font-semibold"
                  >
                    View Plans & Pricing
                  </Link>
                </div>
              ) : (
                <div className="pro-card mt-8 p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-medium uppercase text-[var(--text-secondary)]">
                        Current Plan
                      </p>
                      <p className="mt-1 font-heading text-xl font-semibold text-[var(--text-primary)]">
                        ATC Bot — {periodLabels[license.period] ?? license.period}
                      </p>
                      <p className="mt-1 text-sm text-[var(--text-secondary)]">
                        Status:{" "}
                        <span className={active ? "text-[var(--positive)]" : "text-[var(--negative)]"}>
                          {active ? "Active" : "Expired"}
                        </span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setRenewOpen(true)}
                      className="btn-primary rounded-xl px-5 py-2.5 text-sm font-semibold"
                    >
                      Renew / Upgrade
                    </button>
                  </div>

                  <dl className="mt-6 grid gap-4 border-t border-[var(--card-border)] pt-6 sm:grid-cols-2">
                    <div>
                      <dt className="text-xs font-medium uppercase text-[var(--text-secondary)]">
                        Purchase Date
                      </dt>
                      <dd className="mt-1 text-sm font-medium text-[var(--text-primary)]">
                        {formatLicenseDate(license.purchased_at)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium uppercase text-[var(--text-secondary)]">
                        Expiry Date
                      </dt>
                      <dd className="mt-1 text-sm font-medium text-[var(--text-primary)]">
                        {license.expires_at ? formatLicenseDate(license.expires_at) : "Lifetime"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium uppercase text-[var(--text-secondary)]">
                        Amount Paid
                      </dt>
                      <dd className="mt-1 text-sm font-medium text-[var(--text-primary)]">
                        {license.amount_paid
                          ? `₹${(license.amount_paid / 100).toLocaleString("en-IN")}`
                          : "—"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium uppercase text-[var(--text-secondary)]">
                        Payment ID
                      </dt>
                      <dd className="mt-1 font-mono text-xs text-[var(--text-primary)]">
                        {license.razorpay_payment_id?.slice(0, 16) ?? "—"}…
                      </dd>
                    </div>
                  </dl>
                </div>
              )}

              <div className="pro-card mt-6 p-6">
                <h2 className="font-heading text-lg font-semibold text-[var(--text-primary)]">
                  Billing Support
                </h2>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">
                  For invoices, refunds, or payment issues, email{" "}
                  <a href={`mailto:${PAYMENT_EMAIL}`} className="text-[var(--accent)] hover:underline">
                    {PAYMENT_EMAIL}
                  </a>{" "}
                  or{" "}
                  <button
                    type="button"
                    onClick={() => setTab("support")}
                    className="font-medium text-[var(--accent)] hover:underline"
                  >
                    open a support ticket
                  </button>
                  .
                </p>
                <Link
                  href="/refund-policy"
                  className="mt-3 inline-block text-sm font-medium text-[var(--accent)] hover:underline"
                >
                  View Refund Policy
                </Link>
              </div>
            </div>
          )}

          {tab === "support" && (
            <div>
              <h1 className="font-heading text-2xl font-semibold text-[var(--text-primary)]">
                Support
              </h1>

              <form onSubmit={handleSubmitTicket} className="pro-card mt-6 space-y-4 p-6">
                <h2 className="font-heading text-lg font-semibold text-[var(--text-primary)]">
                  Submit New Ticket
                </h2>
                <label className="block">
                  <span className="text-sm text-[var(--text-secondary)]">Subject</span>
                  <input
                    required
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    className={FIELD}
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-[var(--text-secondary)]">Category</span>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value)}
                    className={FIELD}
                  >
                    {TICKET_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm text-[var(--text-secondary)]">Message</span>
                  <textarea
                    required
                    minLength={20}
                    rows={4}
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    className={FIELD}
                  />
                </label>
                {ticketSuccess && (
                  <p className="text-sm text-[var(--positive)]">
                    Ticket submitted. We&apos;ll respond within 24 hours at {PAYMENT_EMAIL}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={ticketSubmitting}
                  className="btn-primary rounded-xl px-6 py-2.5 text-sm font-semibold disabled:opacity-70"
                >
                  {ticketSubmitting ? "Submitting…" : "Submit Ticket"}
                </button>
              </form>

              <div className="pro-card mt-8 overflow-x-auto p-6">
                <h2 className="font-heading text-lg font-semibold text-[var(--text-primary)]">
                  My Tickets
                </h2>
                {tickets.length === 0 ? (
                  <p className="mt-4 text-sm text-[var(--text-secondary)]">
                    No tickets submitted yet
                  </p>
                ) : (
                  <table className="dashboard-table mt-4 w-full min-w-[520px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-[var(--card-border)] text-[var(--text-secondary)]">
                        <th className="pb-2 font-medium">Ticket ID</th>
                        <th className="pb-2 font-medium">Subject</th>
                        <th className="pb-2 font-medium">Category</th>
                        <th className="pb-2 font-medium">Status</th>
                        <th className="pb-2 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.map((t) => (
                        <tr key={t.id} className="border-b border-[var(--card-border)]/50">
                          <td className="py-3 font-mono text-xs text-[var(--text-primary)]">
                            {t.id.slice(0, 8)}…
                          </td>
                          <td className="py-3 text-[var(--text-primary)]">{t.subject}</td>
                          <td className="py-3 text-[var(--text-primary)]">{t.category}</td>
                          <td className="py-3">
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                t.status === "open"
                                  ? "bg-yellow-500/20 text-yellow-300"
                                  : t.status === "in_progress"
                                    ? "bg-blue-500/20 text-blue-300"
                                    : "bg-green-500/20 text-green-300"
                              }`}
                            >
                              {t.status.replace("_", " ")}
                            </span>
                          </td>
                          <td className="py-3 text-[var(--text-primary)]">
                            {formatLicenseDate(t.created_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {tab === "account" && (
            <div className="max-w-lg space-y-8">
              <h1 className="font-heading text-2xl font-semibold text-[var(--text-primary)]">
                Account
              </h1>

              <div className="pro-card space-y-4 p-6">
                <h2 className="font-heading text-lg font-semibold text-[var(--text-primary)]">
                  Profile
                </h2>
                <div>
                  <p className="text-sm text-[var(--text-secondary)]">Name</p>
                  <p className="mt-1 text-sm font-medium text-[var(--text-primary)]">
                    {user?.fullName ?? displayName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[var(--text-secondary)]">Email</p>
                  <p className="mt-1 text-sm font-medium text-[var(--text-primary)]">{userEmail}</p>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">
                  Update your profile and password via the account menu in the navbar.
                </p>
              </div>

              <div className="pro-card space-y-3 border border-red-400/30 p-6">
                <h2 className="font-heading text-lg font-semibold text-red-300">Danger Zone</h2>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="dashboard-outline-btn w-full rounded-xl py-2.5 text-sm text-[var(--text-primary)]"
                >
                  Sign Out
                </button>
                {!deleteConfirm ? (
                  <button
                    type="button"
                    onClick={() => setDeleteConfirm(true)}
                    className="w-full rounded-xl border border-red-400/50 py-2.5 text-sm text-red-300 transition hover:border-red-400 hover:bg-red-500/10"
                  >
                    Delete Account
                  </button>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs text-[var(--text-secondary)]">
                      This permanently deletes your account, licenses, and tickets. Are you sure?
                    </p>
                    <button
                      type="button"
                      onClick={handleDeleteAccount}
                      className="w-full rounded-xl bg-[var(--negative)] py-2.5 text-sm font-semibold text-white"
                    >
                      Confirm Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirm(false)}
                      className="w-full text-xs text-[var(--text-secondary)]"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      <RenewalModal
        open={renewOpen}
        onClose={() => setRenewOpen(false)}
        onSuccess={() => void loadData()}
      />

      {downloadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="pro-card max-w-sm rounded-2xl p-6 text-center">
            <p className="text-sm text-[var(--text-secondary)]">
              Your {downloadModal === "bot" ? "bot file" : "setup guide"} will be sent to your
              registered email. Contact{" "}
              <a href={`mailto:${PAYMENT_EMAIL}`} className="text-[var(--accent)]">
                {PAYMENT_EMAIL}
              </a>{" "}
              if not received.
            </p>
            <button
              type="button"
              onClick={() => setDownloadModal(null)}
              className="btn-primary mt-4 rounded-xl px-6 py-2 text-sm font-semibold"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}
