import type { Period } from "@/lib/paymentTypes";

export type LicenseRecord = {
  id: string;
  user_id: string;
  plan: string;
  period: string;
  license_key: string;
  status: string;
  purchased_at: string;
  expires_at: string | null;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  amount_paid: number | null;
};

export function generateLicenseKey(): string {
  const seg = () =>
    Math.random().toString(36).substring(2, 6).toUpperCase().padEnd(4, "0");
  return `ATC-${seg()}-${seg()}-${seg()}-${seg()}`;
}

export function computeExpiry(period: Period, from: Date = new Date()): Date | null {
  const d = new Date(from);
  switch (period) {
    case "three":
      d.setMonth(d.getMonth() + 3);
      return d;
    case "six":
      d.setMonth(d.getMonth() + 6);
      return d;
    case "yearly":
      d.setFullYear(d.getFullYear() + 1);
      return d;
    case "lifetime":
      return null;
    default:
      return d;
  }
}

export function extendExpiry(
  current: Date | null,
  period: Period,
  now: Date = new Date(),
): Date | null {
  if (period === "lifetime") return null;
  const base =
    current && current > now ? current : now;
  return computeExpiry(period, base);
}

export function formatLicenseDate(iso: string | null): string {
  if (!iso) return "Lifetime";
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function daysRemaining(expiresAt: string | null): number | null {
  if (!expiresAt) return null;
  const diff = new Date(expiresAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function maskLicenseKey(key: string): string {
  const parts = key.split("-");
  if (parts.length < 5) return key;
  return `${parts[0]}-${parts[1]}-${parts[2]}-••••-••••`;
}

export function isLicenseActive(license: LicenseRecord): boolean {
  if (license.status !== "active") return false;
  if (!license.expires_at) return true;
  return new Date(license.expires_at) > new Date();
}

export const PENDING_PAYMENT_KEY = "atc_pending_payment";

export type PendingPayment = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  period: Period;
  amountInr: number;
};

export function savePendingPayment(data: PendingPayment) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(PENDING_PAYMENT_KEY, JSON.stringify(data));
}

export function loadPendingPayment(): PendingPayment | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(PENDING_PAYMENT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PendingPayment;
  } catch {
    return null;
  }
}

export function clearPendingPayment() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(PENDING_PAYMENT_KEY);
}
