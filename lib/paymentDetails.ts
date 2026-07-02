/** Placeholder payment details — replace with real credentials before going live */

export const PAYMENT_EMAIL = "aureustradecapital@gmail.com";

export const UPI = {
  id: "9175861071@ybl",
  name: "Radhey Sai Construction and Transport",
} as const;

export const UPI_QR_IMAGE = "/qr-code.jpeg";

export const BANK = {
  accountName: "Aureus Trade Capital",
  accountNumber: "4521879630215487",
  bankName: "HDFC Bank",
  branch: "Mumbai Main Branch",
  ifsc: "HDFC0001234",
} as const;

/** Build UPI deep link for QR (amount in INR, no paise decimals in string) */
export function buildUpiPayUrl(amountInr: number) {
  const params = new URLSearchParams({
    pa: UPI.id,
    pn: UPI.name,
    am: String(amountInr),
    cu: "INR",
  });
  return `upi://pay?${params.toString()}`;
}

export function upiQrImageUrl(amountInr: number, size = 200) {
  const data = encodeURIComponent(buildUpiPayUrl(amountInr));
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${data}&bgcolor=ffffff&color=1c1917`;
}

export const amountByPeriod: Record<string, number> = {
  three: 6999,
  six: 10999,
  yearly: 14999,
  lifetime: 49999,
};

export const periodLabels: Record<string, string> = {
  three: "3 Months",
  six: "6 Months",
  yearly: "Yearly",
  lifetime: "Lifetime",
};
