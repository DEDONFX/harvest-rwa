import type { Metadata } from "next";
import { Syne, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Harvest.rwa — Real World Asset Launchpad",
  description:
    "The world's first AI-powered multichain Real World Asset launchpad. Invest in tokenized real estate, infrastructure, and business yield from $10 — on Mantle and Solana.",
  keywords: ["RWA", "real world assets", "tokenization", "Mantle", "Solana", "multichain", "DeFi", "yield"],
  openGraph: {
    title: "Harvest.rwa",
    description: "AI-powered Multichain Real World Asset Launchpad — Mantle + Solana",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-ink text-offwhite font-dm antialiased">
        {children}
      </body>
    </html>
  );
}
