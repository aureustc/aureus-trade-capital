import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeScript } from "@/components/ThemeScript";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aureus Trade Capital | AI Forex Trading Bot for MT5",
  description:
    "Buy the ATC AI Forex trading bot for MetaTrader 5. Plug into your MT5 broker account for automated, emotion-free trading. Trade Smarter. Profit Wiser.",
  keywords: [
    "Forex bot",
    "MT5 bot",
    "MetaTrader 5 bot",
    "AI trading bot",
    "Aureus Trade Capital",
    "ATC",
    "XAU/USD bot",
  ],
  openGraph: {
    title: "Aureus Trade Capital — ATC Forex Bot (MT5)",
    description: "Smart Bot. Smarter Trading. MT5 only.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full scroll-smooth`} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-full bg-[var(--bg-primary)] font-sans text-[var(--text-primary)] antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
