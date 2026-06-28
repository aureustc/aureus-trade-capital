/** Shared Razorpay key checks (safe for client + server). */

export function isRazorpayKeyValid(key: string | undefined): boolean {
  if (!key || key.length < 8) return false;
  if (/placeholder|your_|xxxxxxxx/i.test(key)) return false;
  return key.startsWith("rzp_test_") || key.startsWith("rzp_live_");
}

export function isRazorpayPublicReady(publicKey?: string) {
  const key = publicKey ?? process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  return isRazorpayKeyValid(key);
}

export function isRazorpaySecretValid(secret: string | undefined): boolean {
  if (!secret || secret.length < 8) return false;
  return !/placeholder|your_secret/i.test(secret);
}

export function isRazorpayConfigured() {
  return (
    isRazorpayKeyValid(process.env.RAZORPAY_KEY_ID) &&
    isRazorpayKeyValid(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) &&
    isRazorpaySecretValid(process.env.RAZORPAY_KEY_SECRET)
  );
}
