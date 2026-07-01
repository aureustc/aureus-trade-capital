import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeScript } from "@/components/ThemeScript";
import { ComplianceBanner } from "@/components/ComplianceBanner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aureus Trade Capital | AI-Assisted Forex Trading Bot for MT5",
  description:
    "Buy the ATC algorithmic Forex trading bot for MetaTrader 5. Plug into your MT5 broker account for systematic, rule-based execution. Trade Smarter. Profit Wiser.*",
  keywords: [
    "Forex bot",
    "MT5 bot",
    "MetaTrader 5 bot",
    "algorithmic trading bot",
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
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} h-full scroll-smooth`} suppressHydrationWarning>
        <head>
          <ThemeScript />
        </head>
        <body className="min-h-full bg-[var(--bg-primary)] font-sans text-[var(--text-primary)] antialiased">
          <ThemeProvider>
            {children}
            <ComplianceBanner />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
