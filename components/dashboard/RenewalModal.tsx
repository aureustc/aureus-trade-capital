"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isRazorpayPublicReady } from "@/lib/razorpay-config";
import { openRazorpayCheckout } from "@/lib/razorpay-client";
import { amountByPeriod, periodLabels } from "@/lib/paymentDetails";
import type { Period } from "@/lib/paymentTypes";

const periods: { id: Period; label: string }[] = [
  { id: "three", label: "3 Months" },
  { id: "six", label: "6 Months" },
  { id: "yearly", label: "Yearly" },
  { id: "lifetime", label: "Lifetime" },
];

const prices: Record<Period, string> = {
  three: "₹6,999",
  six: "₹10,999",
  yearly: "₹14,999",
  lifetime: "₹49,999",
};

type RenewalModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export function RenewalModal({ open, onClose, onSuccess }: RenewalModalProps) {
  const [period, setPeriod] = useState<Period>("three");
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const razorpayReady = isRazorpayPublicReady();
  const razorpayKey = razorpayReady ? process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID : undefined;

  if (!open) return null;

  async function handlePay() {
    if (!razorpayReady || !razorpayKey) {
      setError("Razorpay is not configured. Contact support to renew.");
      return;
    }

    setPaying(true);
    setError(null);
    const amountInr = amountByPeriod[period];

    try {
      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountInr, plan: "ATC Bot License", period }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        setError(orderData.error ?? "Could not start checkout.");
        setPaying(false);
        return;
      }

      await openRazorpayCheckout({
        checkout: {
          key: razorpayKey,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "Aureus Trade Capital",
          description: `ATC Bot Renewal · ${periodLabels[period]}`,
          order_id: orderData.orderId,
          image: "/logo2.png",
          theme: { color: "#c9a227" },
        },
        onSuccess: async (response) => {
          const fulfillRes = await fetch("/api/licenses/fulfill", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...response,
              period,
              renew: true,
            }),
          });
          if (!fulfillRes.ok) {
            const data = await fulfillRes.json();
            setError(data.error ?? "Payment verified but renewal failed.");
            setPaying(false);
            return;
          }
          setPaying(false);
          onSuccess();
          onClose();
        },
        onDismiss: () => setPaying(false),
        onFailure: (msg) => {
          setError(msg);
          setPaying(false);
        },
      });
    } catch {
      setError("Something went wrong.");
      setPaying(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="pro-card w-full max-w-md rounded-2xl p-6">
        <h3 className="font-heading text-xl font-semibold text-[var(--text-primary)]">
          Renew / Upgrade License
        </h3>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Select a billing period to extend your license.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {periods.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPeriod(p.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                period === p.id
                  ? "bg-[var(--accent)] text-[var(--on-accent)]"
                  : "border border-[var(--card-border)] text-[var(--text-secondary)]"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <p className="mt-4 font-heading text-2xl font-bold text-[var(--accent)]">
          {prices[period]}
        </p>

        {error && (
          <p className="mt-3 text-sm text-[var(--negative)]">{error}</p>
        )}

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={paying}
            className="flex-1 rounded-xl border border-[var(--card-border)] py-2.5 text-sm text-[var(--text-secondary)] transition hover:border-[var(--accent-soft-strong)] hover:text-[var(--text-primary)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handlePay}
            disabled={paying}
            className="btn-primary flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold disabled:opacity-70"
          >
            {paying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Pay with Razorpay"}
          </button>
        </div>
      </div>
    </div>
  );
}
