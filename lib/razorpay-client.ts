import type { PaymentMethod } from "./paymentTypes";

export type { PaymentMethod };

export type RazorpaySuccessResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

export type RazorpayCheckoutOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
};

export type RazorpayInstance = {
  open: () => void;
  on: (event: string, handler: (response: { error: { description: string } }) => void) => void;
};

declare global {
  interface Window {
    Razorpay?: new (
      options: RazorpayCheckoutOptions & {
        handler: (response: RazorpaySuccessResponse) => void;
        modal?: { ondismiss?: () => void };
      },
    ) => RazorpayInstance;
  }
}

const SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

let scriptPromise: Promise<boolean> | null = null;

export function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve(Boolean(window.Razorpay));
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  return scriptPromise;
}

export async function openRazorpayCheckout(opts: {
  checkout: RazorpayCheckoutOptions;
  onSuccess: (response: RazorpaySuccessResponse) => void | Promise<void>;
  onDismiss?: () => void;
  onFailure?: (message: string) => void;
}): Promise<boolean> {
  const loaded = await loadRazorpayScript();
  if (!loaded || !window.Razorpay) return false;

  const rzp = new window.Razorpay({
    ...opts.checkout,
    handler: (response) => {
      void opts.onSuccess(response);
    },
    modal: {
      ondismiss: () => opts.onDismiss?.(),
    },
  });

  rzp.on("payment.failed", (response) => {
    opts.onFailure?.(response.error?.description ?? "Payment failed. Please try again.");
  });

  rzp.open();
  return true;
}
