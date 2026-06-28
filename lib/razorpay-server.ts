import Razorpay from "razorpay";
import { amountByPeriod } from "@/lib/paymentDetails";
import { isRazorpayConfigured } from "@/lib/razorpay-config";

const VALID_PERIODS = new Set(Object.keys(amountByPeriod));

export { isRazorpayConfigured, isRazorpayPublicReady, isRazorpayKeyValid } from "@/lib/razorpay-config";

export function getRazorpayClient() {
  if (!isRazorpayConfigured()) return null;
  const keyId = process.env.RAZORPAY_KEY_ID!;
  const keySecret = process.env.RAZORPAY_KEY_SECRET!;
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

export function getAmountPaise(period: string): number | null {
  if (!VALID_PERIODS.has(period)) return null;
  const inr = amountByPeriod[period];
  return inr * 100;
}
