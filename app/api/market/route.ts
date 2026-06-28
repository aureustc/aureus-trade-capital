import { NextResponse } from "next/server";

export const revalidate = 60;

type PairQuote = {
  pair: string;
  rate: number;
  change: number;
  direction: "up" | "down" | "flat";
};

async function fetchForex(): Promise<PairQuote[]> {
  const quotes: PairQuote[] = [];

  try {
    const [eurRes, gbpRes, jpyRes] = await Promise.all([
      fetch("https://api.frankfurter.app/latest?from=EUR&to=USD", {
        next: { revalidate: 60 },
      }),
      fetch("https://api.frankfurter.app/latest?from=GBP&to=USD", {
        next: { revalidate: 60 },
      }),
      fetch("https://api.frankfurter.app/latest?from=USD&to=JPY", {
        next: { revalidate: 60 },
      }),
    ]);

    if (eurRes.ok) {
      const d = await eurRes.json();
      const rate = d.rates?.USD as number;
      if (rate) quotes.push({ pair: "EUR/USD", rate, change: 0, direction: "flat" });
    }
    if (gbpRes.ok) {
      const d = await gbpRes.json();
      const rate = d.rates?.USD as number;
      if (rate) quotes.push({ pair: "GBP/USD", rate, change: 0, direction: "flat" });
    }
    if (jpyRes.ok) {
      const d = await jpyRes.json();
      const rate = d.rates?.JPY as number;
      if (rate) quotes.push({ pair: "USD/JPY", rate, change: 0, direction: "flat" });
    }
  } catch {
    /* fallback below */
  }

  return quotes;
}

async function fetchGold(): Promise<PairQuote | null> {
  try {
    const res = await fetch("https://api.gold-api.com/price/XAU/USD", {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const rate = typeof data.price === "number" ? data.price : null;
    if (!rate) return null;
    return { pair: "XAU/USD", rate, change: 0, direction: "flat" };
  } catch {
    return null;
  }
}

export async function GET() {
  const [forex, gold] = await Promise.all([fetchForex(), fetchGold()]);

  const pairs: PairQuote[] = [...forex];
  if (gold) pairs.unshift(gold);

  if (pairs.length === 0) {
    return NextResponse.json({
      pairs: [
        { pair: "XAU/USD", rate: 2338.37, change: -0.02, direction: "down" },
        { pair: "EUR/USD", rate: 1.0849, change: 0.01, direction: "down" },
        { pair: "GBP/USD", rate: 1.2683, change: 0.02, direction: "up" },
        { pair: "USD/JPY", rate: 154.22, change: 0.05, direction: "up" },
      ],
      updatedAt: new Date().toISOString(),
      source: "fallback",
    });
  }

  return NextResponse.json({
    pairs,
    updatedAt: new Date().toISOString(),
    source: "live",
  });
}
