"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { CheckCircle2, Loader2, XCircle, Download } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ComplianceBanner } from "@/components/ComplianceBanner";
import { PAYMENT_EMAIL, periodLabels } from "@/lib/paymentDetails";

type VerifyState = "loading" | "success" | "failed";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const [state, setState] = useState<VerifyState>("loading");
  const [paymentId, setPaymentId] = useState<string | null>(null);

  const period = searchParams.get("period") ?? "";
  const amount = searchParams.get("amount") ?? "";
  const plan = searchParams.get("plan") ?? "ATC Bot License";
  const periodLabel = periodLabels[period] ?? (period || "Selected plan");

  useEffect(() => {
    const razorpay_order_id = searchParams.get("order_id");
    const razorpay_payment_id = searchParams.get("payment_id");
    const razorpay_signature = searchParams.get("signature");

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      setState("failed");
      return;
    }

    async function verify() {
      try {
        const res = await fetch("/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
          }),
        });
        const data = await res.json();

        if (res.ok && data.verified) {
          setPaymentId(data.paymentId ?? razorpay_payment_id);
          setState("success");
        } else {
          setState("failed");
        }
      } catch {
        setState("failed");
      }
    }

    void verify();
  }, [searchParams]);

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] pb-24 pt-24">
      <div className="mx-auto max-w-lg px-4 sm:px-6">
        {state === "loading" && (
          <div className="pro-card flex flex-col items-center p-10 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-[var(--accent)]" />
            <p className="mt-4 text-sm text-[var(--text-secondary)]">
              Verifying your payment…
            </p>
          </div>
        )}

        {state === "failed" && (
          <div className="pro-card flex flex-col items-center p-10 text-center">
            <XCircle className="h-16 w-16 text-[var(--negative)]" />
            <h1 className="font-heading mt-5 text-2xl font-semibold text-[var(--text-primary)]">
              Verification Failed
            </h1>
            <p className="mt-3 text-sm text-[var(--text-secondary)]">
              We could not verify your payment. If money was deducted, contact us with your
              payment reference.
            </p>
            <Link href="/#pricing" className="btn-primary mt-6 rounded-full px-6 py-3 text-sm font-semibold">
              Back to Pricing
            </Link>
          </div>
        )}

        {state === "success" && (
          <div className="pro-card-accent rounded-2xl p-8 text-center shadow-[var(--glow-strong)]">
            <CheckCircle2 className="mx-auto h-16 w-16 text-[var(--positive)]" />
            <h1 className="font-heading mt-5 text-2xl font-semibold text-[var(--text-primary)]">
              Payment Successful
            </h1>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Thank you for purchasing the ATC Bot license.
            </p>

            <div className="mt-6 space-y-3 rounded-xl border border-[var(--card-border)] bg-[var(--bg-secondary)] p-5 text-left text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-[var(--text-secondary)]">Plan</span>
                <span className="font-semibold text-[var(--text-primary)]">{plan}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-[var(--text-secondary)]">Period</span>
                <span className="font-semibold text-[var(--text-primary)]">{periodLabel}</span>
              </div>
              {amount && (
                <div className="flex justify-between gap-4">
                  <span className="text-[var(--text-secondary)]">Amount paid</span>
                  <span className="font-bold text-[var(--accent)]">₹{Number(amount).toLocaleString("en-IN")}</span>
                </div>
              )}
              {paymentId && (
                <div className="flex justify-between gap-4 border-t border-[var(--card-border)] pt-3">
                  <span className="text-[var(--text-secondary)]">Payment ID</span>
                  <span className="truncate font-mono text-xs font-semibold text-[var(--text-primary)]">
                    {paymentId}
                  </span>
                </div>
              )}
            </div>

            <p className="mt-6 text-sm leading-relaxed text-[var(--text-secondary)]">
              Your bot license key and setup guide will be sent to{" "}
              <a
                href={`mailto:${PAYMENT_EMAIL}`}
                className="font-medium text-[var(--accent-deep)] hover:underline"
              >
                {PAYMENT_EMAIL}
              </a>{" "}
              within 30 minutes.
            </p>

            <button
              type="button"
              disabled
              className="mt-6 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-[var(--card-border)] bg-[var(--bg-secondary)] py-3 text-sm text-[var(--text-secondary)] opacity-60"
            >
              <Download className="h-4 w-4" />
              Download Setup Guide (Coming Soon)
            </button>

            <p className="mt-5 text-xs text-[var(--text-secondary)]">
              Questions?{" "}
              <a
                href={`mailto:${PAYMENT_EMAIL}`}
                className="font-medium text-[var(--accent-deep)] hover:underline"
              >
                {PAYMENT_EMAIL}
              </a>
            </p>

            <Link
              href="/"
              className="mt-6 inline-block text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-hover)]"
            >
              ← Back to home
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <>
      <Navbar />
      <Suspense
        fallback={
          <main className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)] pt-24">
            <Loader2 className="h-10 w-10 animate-spin text-[var(--accent)]" />
          </main>
        }
      >
        <OrderSuccessContent />
      </Suspense>
      <Footer />
      <ComplianceBanner />
    </>
  );
}
