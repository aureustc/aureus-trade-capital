"use client";

import {
  Check,
  CreditCard,
  Landmark,
  Smartphone,
  ArrowRight,
  ShieldCheck,
  X,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { SectionReveal } from "./SectionReveal";
import {
  PaymentDetailsPanel,
  PaymentScreenshotNotice,
} from "./PaymentDetailsPanel";
import { amountByPeriod, PAYMENT_EMAIL, periodLabels, UPI, UPI_QR_IMAGE } from "@/lib/paymentDetails";
import type { PaymentMethod, Period } from "@/lib/paymentTypes";
import { isRazorpayPublicReady } from "@/lib/razorpay-config";
import { openRazorpayCheckout } from "@/lib/razorpay-client";
import { savePendingPayment } from "@/lib/licenses";
import { useState } from "react";

const periods: { id: Period; label: string }[] = [
  { id: "three", label: "3 Months" },
  { id: "six", label: "6 Months" },
  { id: "yearly", label: "Yearly" },
  { id: "lifetime", label: "Lifetime" },
];

const prices: Record<
  Period,
  { display: string; suffix: string; note: string | null }
> = {
  three: { display: "₹6,999", suffix: "", note: null },
  six: { display: "₹10,999", suffix: "", note: null },
  yearly: { display: "₹14,999", suffix: "", note: null },
  lifetime: { display: "₹49,999", suffix: "", note: "one-time" },
};

const features = [
  "ATC Bot License for MetaTrader 5",
  "Works with any MT5-supported broker",
  "Multi-currency pairs incl. XAU/USD",
  "AI-assisted automation & risk controls",
  "Setup guide + email support",
  "Free updates during license period",
] as const;

const activePaymentMethods: {
  id: PaymentMethod;
  label: string;
  icon: typeof Smartphone;
  description: string;
}[] = [
  {
    id: "upi",
    label: "UPI",
    icon: Smartphone,
    description: "QR code & UPI ID",
  },
  {
    id: "card",
    label: "Credit / Debit Card",
    icon: CreditCard,
    description: "Visa, Mastercard, RuPay",
  },
];

const razorpayReady = isRazorpayPublicReady();
const razorpayKey = razorpayReady ? process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID : undefined;

export function Pricing() {
  const router = useRouter();
  const { user } = useUser();
  const [period, setPeriod] = useState<Period>("three");
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [step, setStep] = useState<"plans" | "payment" | "confirm">("plans");
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [razorpayPaymentId, setRazorpayPaymentId] = useState<string | null>(null);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [copied, setCopied] = useState(false);

  const price = prices[period];
  const amountInr = amountByPeriod[period];
  const chosenPayment = activePaymentMethods.find((p) => p.id === selectedPayment);

  function handleProceed() {
    setPayError(null);
    setStep("payment");
  }

  function handleReset() {
    setStep("plans");
    setSelectedPayment(null);
    setPayError(null);
    setRazorpayPaymentId(null);
    setPaymentVerified(false);
    setPaying(false);
    setCopied(false);
  }

  function handleConfirmContinue() {
    if (!selectedPayment) return;

    if (selectedPayment === "card") {
      void handleRazorpayPay();
      return;
    }

    setStep("confirm");
  }

  async function copyUpiId() {
    try {
      await navigator.clipboard.writeText(UPI.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  async function handleRazorpayPay() {
    if (!razorpayReady || !razorpayKey) {
      setPayError(
        "Card payments are not available yet. Please pay via UPI or try again later.",
      );
      return;
    }

    setPaying(true);
    setPayError(null);

    try {
      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountInr,
          plan: "ATC Bot License",
          period,
        }),
      });
      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        setPayError(orderData.error ?? "Could not start checkout.");
        setPaying(false);
        return;
      }

      const opened = await openRazorpayCheckout({
        checkout: {
          key: razorpayKey,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "Aureus Trade Capital",
          description: `ATC Bot · ${periodLabels[period]}`,
          order_id: orderData.orderId,
          image: "/logo2.png",
          prefill: {
            email: user?.emailAddresses?.[0]?.emailAddress ?? "",
            name: user?.fullName ?? "",
          },
          theme: { color: "#c9a227" },
        },
        onSuccess: async (response) => {
          setPaying(false);

          const verifyRes = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan: "atc_bot",
              period,
              amount: amountInr,
            }),
          });
          const verifyData = await verifyRes.json();

          if (!verifyRes.ok || !verifyData.verified) {
            setPayError(verifyData.error ?? "Payment verification failed. Contact support.");
            return;
          }

          if (user) {
            router.push("/dashboard?payment=success");
            return;
          }

          savePendingPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            period,
            amountInr,
          });
          router.push("/sign-up?redirect=dashboard&payment=success");
        },
        onDismiss: () => setPaying(false),
        onFailure: (message) => {
          setPayError(message);
          setPaying(false);
        },
      });

      if (!opened) {
        setPayError("Could not load Razorpay checkout. Please try again.");
        setPaying(false);
      }
    } catch {
      setPayError("Something went wrong. Please try again.");
      setPaying(false);
    }
  }

  return (
    <SectionReveal
      id="pricing"
      data-nav="pricing"
      className="section-scroll relative bg-[var(--bg-secondary)]/40 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-3xl font-semibold text-[var(--text-primary)] sm:text-4xl lg:text-5xl">
            Get the ATC Bot
          </h2>
          <p className="mt-4 text-base text-[var(--text-secondary)] sm:text-lg">
            One license. MT5 only. Pay via UPI or credit / debit card.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === "plans" && (
            <motion.div
              key="plans"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-2 rounded-full border border-[var(--card-border)] bg-[var(--bg-secondary)] p-1.5">
                {periods.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPeriod(p.id)}
                    className={`relative min-w-[88px] flex-1 rounded-full px-3 py-2.5 text-sm font-semibold transition sm:min-w-[110px] ${
                      period === p.id
                        ? "text-[var(--on-accent)]"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    {period === p.id && (
                      <motion.span
                        layoutId="pricing-tab"
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-[var(--accent-hover)] to-[var(--accent)] shadow-[var(--glow)]"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-[1]">{p.label}</span>
                  </button>
                ))}
              </div>

              <div className="mx-auto mt-10 max-w-lg">
                <div className="glass-panel-strong pro-card-accent relative rounded-2xl p-8 shadow-[var(--glow-strong)]">
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[var(--accent-hover)] to-[var(--accent)] px-4 py-1 text-xs font-bold uppercase tracking-wide text-[var(--on-accent)]">
                    MT5 Bot License
                  </span>

                  <h3 className="font-heading text-center text-xl font-semibold text-[var(--text-primary)]">
                    Aureus Trade Capital Bot
                  </h3>
                  <p className="mt-1 text-center text-xs text-[var(--text-secondary)]">
                    MetaTrader 5 only · Not compatible with MT4
                  </p>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={period}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="mt-8 text-center"
                    >
                      <p className="font-heading text-4xl font-bold text-[var(--accent)] sm:text-5xl">
                        {price.display}
                        {price.suffix && (
                          <span className="text-lg font-normal text-[var(--text-secondary)]">
                            {" "}
                            {price.suffix}
                          </span>
                        )}
                      </p>
                      {price.note && (
                        <p className="mt-1 text-sm text-[var(--accent-hover)]">({price.note})</p>
                      )}
                      <p className="mt-2 text-sm text-[var(--text-secondary)]">
                        {periodLabels[period]} access
                      </p>
                    </motion.div>
                  </AnimatePresence>

                  <ul className="mt-8 space-y-3">
                    {features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2 text-sm text-[var(--text-secondary)]"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={handleProceed}
                    className="btn-primary group mt-8 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-base font-semibold"
                  >
                    Proceed to Payment
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>

              <p className="mx-auto mt-6 max-w-md text-center text-xs text-[var(--text-secondary)]">
                UPI payments are verified within 30 minutes · Card checkout is instant
              </p>
            </motion.div>
          )}

          {step === "payment" && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="mt-14"
            >
              <div className="pro-card mx-auto max-w-2xl p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
                  Order Summary
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="font-heading text-lg font-semibold text-[var(--text-primary)]">
                      ATC Bot · {periodLabels[period]}
                    </p>
                    <p className="text-sm text-[var(--text-secondary)]">MetaTrader 5</p>
                  </div>
                  <p className="font-heading text-2xl font-bold text-[var(--accent)]">
                    {price.display}
                  </p>
                </div>
              </div>

              <div className="mx-auto mt-8 max-w-2xl">
                <p className="text-center text-sm font-medium text-[var(--text-secondary)]">
                  Choose your payment method
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  {activePaymentMethods.map((method) => {
                    const isChosen = selectedPayment === method.id;
                    const isCardDisabled = method.id === "card" && !razorpayReady;
                    return (
                      <motion.button
                        key={method.id}
                        type="button"
                        whileHover={isCardDisabled ? undefined : { y: -3 }}
                        onClick={() => {
                          if (isCardDisabled) return;
                          setSelectedPayment(method.id);
                          setPayError(null);
                        }}
                        disabled={isCardDisabled}
                        className={`relative flex flex-col items-center gap-3 rounded-2xl border p-6 transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
                          isChosen
                            ? "border-[var(--accent)] bg-[var(--accent-soft-md)] ring-1 ring-[var(--accent)]"
                            : "border-[var(--card-border)] bg-[var(--bg-card)]"
                        }`}
                      >
                        {isCardDisabled && (
                          <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-[var(--card-border)] bg-[var(--bg-secondary)] px-3 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">
                            Coming Soon
                          </span>
                        )}
                        {isChosen && (
                          <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--accent)]">
                            <Check className="h-3 w-3 text-[var(--on-accent)]" />
                          </div>
                        )}
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                            isChosen ? "bg-[var(--accent)]" : "bg-[var(--accent-soft)]"
                          }`}
                        >
                          <method.icon
                            className={`h-6 w-6 ${isChosen ? "text-[var(--on-accent)]" : "text-[var(--accent)]"}`}
                          />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-[var(--text-primary)]">
                            {method.label}
                          </p>
                          <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                            {method.description}
                          </p>
                        </div>
                      </motion.button>
                    );
                  })}

                  <div
                    aria-disabled
                    className="relative flex cursor-not-allowed select-none flex-col items-center gap-3 rounded-2xl border border-[var(--card-border)] bg-[var(--bg-card)] p-6 opacity-50"
                  >
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full border border-[var(--card-border)] bg-[var(--bg-secondary)] px-3 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">
                      Coming Soon
                    </span>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent-soft)]">
                      <Landmark className="h-6 w-6 text-[var(--text-secondary)]" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-[var(--text-secondary)]">
                        Bank Transfer
                      </p>
                      <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                        NEFT / RTGS / IMPS
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {selectedPayment === "upi" && (
                <div className="mx-auto mt-6 max-w-sm rounded-2xl border border-[var(--card-border)] bg-[var(--bg-card)] p-6 text-center">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                    Scan to Pay
                  </p>
                  <div className="mx-auto mb-4 w-48 overflow-hidden rounded-xl border border-[var(--card-border)] bg-white p-2">
                    <Image
                      src={UPI_QR_IMAGE}
                      alt="UPI QR Code"
                      width={192}
                      height={192}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <div className="space-y-2 rounded-xl border border-[var(--card-border)] bg-[var(--bg-secondary)] p-4 text-left">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-[var(--text-secondary)]">Pay to</span>
                      <span className="text-right text-xs font-semibold text-[var(--text-primary)]">
                        {UPI.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="shrink-0 text-xs text-[var(--text-secondary)]">UPI ID</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-[var(--accent-hover)]">
                          {UPI.id}
                        </span>
                        <button
                          type="button"
                          onClick={copyUpiId}
                          className="rounded-md border border-[var(--card-border)] bg-[var(--bg-card)] px-2 py-0.5 text-[10px] text-[var(--accent)] transition hover:bg-[var(--bg-card-hover)]"
                        >
                          {copied ? "Copied!" : "Copy"}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[var(--text-secondary)]">Amount</span>
                      <span className="text-xs font-bold text-[var(--accent)]">
                        ₹{amountInr.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-[var(--text-secondary)]">
                    After payment, click &quot;I&apos;ve Paid&quot; below and send your payment
                    screenshot to{" "}
                    <a
                      href={`mailto:${PAYMENT_EMAIL}`}
                      className="text-[var(--accent-hover)] hover:underline"
                    >
                      {PAYMENT_EMAIL}
                    </a>{" "}
                    with your registered email. Your license will be activated within 30 minutes.
                  </p>
                </div>
              )}

              {selectedPayment === "card" && (
                <PaymentDetailsPanel
                  method="card"
                  amountInr={amountInr}
                  amountDisplay={price.display}
                  periodLabel={periodLabels[period]}
                />
              )}

              {payError && (
                <p className="mx-auto mt-4 max-w-2xl rounded-lg border border-[var(--card-border)] bg-[var(--bg-card)] px-4 py-3 text-center text-sm text-[var(--negative)]">
                  {payError}
                </p>
              )}

              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={() => setStep("plans")}
                  disabled={paying}
                  className="rounded-full border border-[var(--card-border)] px-6 py-3 text-sm font-medium text-[var(--text-secondary)] disabled:opacity-50"
                >
                  ← Back
                </button>
                {selectedPayment && (
                  selectedPayment === "upi" ? (
                    <button
                      type="button"
                      onClick={() => setStep("confirm")}
                      className="btn-primary group flex items-center gap-3 rounded-full px-8 py-3.5 text-sm font-bold shadow-[var(--glow-strong)] transition-all hover:scale-105"
                    >
                      I&apos;ve Paid — Confirm Order
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleConfirmContinue}
                      disabled={paying}
                      className="btn-primary group flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold disabled:opacity-70"
                    >
                      {paying ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Opening checkout…
                        </>
                      ) : (
                        <>
                          Confirm &amp; Continue
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  )
                )}
              </div>
            </motion.div>
          )}

          {step === "confirm" && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-14"
            >
              <div className="pro-card-accent mx-auto max-w-lg rounded-2xl p-8 text-center shadow-[var(--glow-strong)]">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent)]">
                  <ShieldCheck className="h-8 w-8 text-[var(--on-accent)]" />
                </div>
                <h3 className="mt-5 font-heading text-2xl font-semibold text-[var(--text-primary)]">
                  {paymentVerified ? "Payment successful!" : selectedPayment === "upi" ? "Order noted!" : "Almost there!"}
                </h3>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">
                  {paymentVerified
                    ? "Your card payment is confirmed. We will email your MT5 license shortly."
                    : selectedPayment === "upi"
                      ? "Your order has been noted. Please send your payment screenshot to aureustradecapital@gmail.com with your registered email address."
                      : "Complete the last step so we can activate your license."}
                </p>

                {!paymentVerified && selectedPayment !== "upi" && (
                  <div className="mt-6 text-left">
                    <PaymentScreenshotNotice compact />
                  </div>
                )}

                {selectedPayment === "upi" && !paymentVerified && (
                  <p className="mt-4 text-xs leading-relaxed text-[var(--text-secondary)]">
                    Your license key will be activated and emailed to you within 30 minutes of
                    payment confirmation.
                  </p>
                )}

                <div className="mt-6 space-y-3 rounded-xl border border-[var(--card-border)] bg-[var(--bg-secondary)] p-5 text-left text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">License</span>
                    <span className="font-semibold text-[var(--text-primary)]">
                      ATC Bot · {periodLabels[period]}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Duration</span>
                    <span className="font-semibold text-[var(--text-primary)]">
                      {periodLabels[period]}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Amount</span>
                    <span className="font-bold text-[var(--accent)]">
                      ₹{amountInr.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Payment via</span>
                    <span className="font-semibold text-[var(--text-primary)]">
                      {selectedPayment === "upi"
                        ? `UPI (${UPI.id})`
                        : chosenPayment?.label ?? "—"}
                    </span>
                  </div>
                  {razorpayPaymentId && (
                    <div className="flex justify-between gap-4 border-t border-[var(--card-border)] pt-3">
                      <span className="text-[var(--text-secondary)]">Payment ID</span>
                      <span className="truncate font-mono text-xs font-semibold text-[var(--text-primary)]">
                        {razorpayPaymentId}
                      </span>
                    </div>
                  )}
                </div>
                <p className="mt-5 text-xs leading-relaxed text-[var(--text-secondary)]">
                  {paymentVerified ? (
                    <>
                      Save your payment ID above. Your license key and MT5 setup guide will be sent
                      to your email within minutes. Questions?{" "}
                      <a
                        href={`mailto:${PAYMENT_EMAIL}`}
                        className="font-medium text-[var(--accent-deep)] hover:underline"
                      >
                        {PAYMENT_EMAIL}
                      </a>
                    </>
                  ) : selectedPayment === "upi" ? (
                    <>
                      Email your screenshot to{" "}
                      <a
                        href={`mailto:${PAYMENT_EMAIL}?subject=ATC%20Bot%20Payment%20-%20${encodeURIComponent(periodLabels[period])}`}
                        className="font-medium text-[var(--accent-deep)] hover:underline"
                      >
                        {PAYMENT_EMAIL}
                      </a>{" "}
                      and include the email you used to register on this site.
                    </>
                  ) : (
                    <>
                      Send your payment screenshot to{" "}
                      <a
                        href={`mailto:${PAYMENT_EMAIL}?subject=ATC%20Bot%20Payment%20-%20${encodeURIComponent(periodLabels[period])}`}
                        className="font-medium text-[var(--accent-deep)] hover:underline"
                      >
                        {PAYMENT_EMAIL}
                      </a>
                      . After verification, your license key and MT5 setup guide are emailed within
                      minutes.
                    </>
                  )}
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--card-border)] py-3 text-sm text-[var(--accent)]"
                >
                  <X className="h-4 w-4" />
                  Start Over
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12 flex items-center justify-center gap-2 text-xs text-[var(--text-secondary)]">
          <ShieldCheck className="h-4 w-4 text-[var(--accent)]" />
          Secure UPI &amp; card checkout · MT5 bot only · We never hold your trading funds
        </div>
      </div>
    </SectionReveal>
  );
}
