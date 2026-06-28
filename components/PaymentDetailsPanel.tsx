"use client";

import { useState } from "react";
import { Copy, Check, Landmark, Smartphone, Upload, Mail, Zap, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BANK, PAYMENT_EMAIL, UPI, upiQrImageUrl } from "@/lib/paymentDetails";
import type { PaymentMethod } from "@/lib/paymentTypes";

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-[var(--card-border)] bg-[var(--bg-primary)] px-4 py-3">
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          {label}
        </p>
        <p className="mt-0.5 truncate font-mono text-sm font-medium text-[var(--text-primary)]">
          {value}
        </p>
      </div>
      <button
        type="button"
        onClick={copy}
        className="shrink-0 rounded-lg border border-[var(--card-border)] p-2 text-[var(--accent)] transition hover:bg-[var(--accent-soft)]"
        aria-label={`Copy ${label}`}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
}

export function PaymentScreenshotNotice({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`rounded-xl border border-[var(--accent-soft-strong)] bg-[var(--accent-soft)] ${
        compact ? "p-4" : "p-5"
      }`}
    >
      <div className="flex gap-3">
        <div className="pro-card-icon-ring flex h-10 w-10 shrink-0 items-center justify-center">
          <Upload className="h-5 w-5 text-[var(--accent-deep)]" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--text-primary)]">
            After payment — send screenshot
          </p>
          <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">
            Once you have paid, email a clear{" "}
            <strong className="text-[var(--text-primary)]">screenshot of the payment</strong> to{" "}
            <a
              href={`mailto:${PAYMENT_EMAIL}`}
              className="font-medium text-[var(--accent-deep)] hover:underline"
            >
              {PAYMENT_EMAIL}
            </a>
            . Include your name, plan duration, and payment method. We verify and send your MT5
            license within minutes.
          </p>
        </div>
      </div>
    </div>
  );
}

type Props = {
  method: PaymentMethod;
  amountInr: number;
  amountDisplay: string;
  periodLabel: string;
};

export function PaymentDetailsPanel({
  method,
  amountInr,
  amountDisplay,
  periodLabel,
}: Props) {
  const qrUrl = upiQrImageUrl(amountInr, 220);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={method}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3 }}
        className="mx-auto mt-6 max-w-2xl space-y-5"
      >
        <div className="pro-card p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
            Pay {amountDisplay} · {periodLabel}
          </p>

          {method === "razorpay" && (
            <div className="mt-5">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-[var(--accent-deep)]" />
                <h4 className="font-heading text-base font-semibold text-[var(--text-primary)]">
                  Pay online with Razorpay
                </h4>
                <span className="rounded-full bg-[var(--accent-soft-md)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--accent-deep)]">
                  Recommended
                </span>
              </div>
              <p className="mt-2 text-xs text-[var(--text-secondary)]">
                Instant, secure checkout — no manual screenshot needed. Settlement to our bank in
                ~2 business days.
              </p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {[
                  { icon: CreditCard, text: "Credit & debit cards (Visa, Mastercard, RuPay)" },
                  { icon: Smartphone, text: "UPI — GPay, PhonePe, Paytm" },
                  { icon: Landmark, text: "Net banking" },
                  { icon: Zap, text: "Wallets & instant confirmation" },
                ].map(({ icon: Icon, text }) => (
                  <li
                    key={text}
                    className="flex items-start gap-2 rounded-lg border border-[var(--card-border)] bg-[var(--bg-primary)] px-3 py-2.5 text-xs text-[var(--text-secondary)]"
                  >
                    <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--accent)]" />
                    {text}
                  </li>
                ))}
              </ul>
              <p className="mt-4 rounded-lg bg-[var(--bg-secondary)] px-3 py-2.5 text-center text-sm">
                <span className="text-[var(--text-secondary)]">Amount due: </span>
                <span className="font-bold text-[var(--accent)]">{amountDisplay}</span>
              </p>
              <p className="mt-3 text-[10px] text-[var(--text-secondary)]">
                ~2% payment gateway fee applies · Powered by Razorpay
              </p>
            </div>
          )}

          {method === "upi" && (
            <div className="mt-5">
              <div className="flex items-center gap-2 text-[var(--accent-deep)]">
                <Smartphone className="h-5 w-5" />
                <h4 className="font-heading text-base font-semibold text-[var(--text-primary)]">
                  UPI Payment
                </h4>
              </div>
              <p className="mt-2 text-xs text-[var(--text-secondary)]">
                Scan the QR code or pay manually using the UPI ID below (GPay, PhonePe, Paytm,
                etc.).
              </p>

              <div className="mt-5 flex flex-col items-center gap-5 sm:flex-row sm:items-start">
                <div className="rounded-2xl border border-[var(--card-border)] bg-white p-3 shadow-[var(--shadow-card)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrUrl}
                    alt="UPI QR code for payment"
                    width={220}
                    height={220}
                    className="h-[200px] w-[200px] sm:h-[220px] sm:w-[220px]"
                  />
                </div>
                <div className="w-full flex-1 space-y-3">
                  <CopyField label="UPI ID" value={UPI.id} />
                  <CopyField label="Payee name" value={UPI.name} />
                  <p className="rounded-lg bg-[var(--bg-secondary)] px-3 py-2 text-center text-sm font-bold text-[var(--accent)]">
                    Amount: {amountDisplay}
                  </p>
                </div>
              </div>
            </div>
          )}

          {method === "bank" && (
            <div className="mt-5">
              <div className="flex items-center gap-2">
                <Landmark className="h-5 w-5 text-[var(--accent-deep)]" />
                <h4 className="font-heading text-base font-semibold text-[var(--text-primary)]">
                  Bank Transfer (NEFT / RTGS / IMPS)
                </h4>
              </div>
              <p className="mt-2 text-xs text-[var(--text-secondary)]">
                Transfer the exact amount to the account below. Use the same name as on your ID
                in the transfer remarks if possible.
              </p>
              <div className="mt-4 space-y-3">
                <CopyField label="Account name" value={BANK.accountName} />
                <CopyField label="Account number" value={BANK.accountNumber} />
                <CopyField label="Bank" value={BANK.bankName} />
                <CopyField label="Branch" value={BANK.branch} />
                <CopyField label="IFSC code" value={BANK.ifsc} />
                <p className="rounded-lg bg-[var(--bg-secondary)] px-3 py-2 text-center text-sm font-bold text-[var(--accent)]">
                  Amount: {amountDisplay}
                </p>
              </div>
            </div>
          )}

          {method !== "razorpay" && <PaymentScreenshotNotice />}

          {method !== "razorpay" && (
            <p className="flex items-center justify-center gap-2 text-center text-[10px] text-[var(--text-secondary)]">
              <Mail className="h-3.5 w-3.5 shrink-0" />
              Subject line example: ATC Bot Payment — {periodLabel} — [Your Name]
            </p>
          )}
        </div>

        {method === "razorpay" && (
          <p className="text-center text-[10px] text-[var(--text-secondary)]">
            Click <strong className="text-[var(--text-primary)]">Pay with Razorpay</strong> below
            to open the secure checkout window.
          </p>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
