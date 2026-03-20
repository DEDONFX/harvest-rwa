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
    "The world's first AI-powered Real World Asset launchpad on Mantle. Invest in tokenized real estate, infrastructure, and business yield from $10.",
  keywords: ["RWA", "real world assets", "tokenization", "Mantle", "DeFi", "yield", "ERC-1400"],
  openGraph: {
    title: "Harvest.rwa",
    description: "AI-powered Real World Asset Launchpad — Built on Mantle",
    type: "website",
  },
  other: {
    "talentapp:project_verification": "cd646f60d08e233c57294f675714cfe85054c503756b12eb273c142b207944bcbdeebe1db6d2f33c74b62a9e256b34f53353b03a519d7a21f034eb1c0e113380",
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
