"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Plus, Search, Wallet, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";
import HarvestLogo from "@/components/HarvestLogo";
import { cn } from "@/lib/utils";
import { MOCK_USER, MOCK_PORTFOLIO } from "@/lib/mock-data";

const NAV_ITEMS = [
  { label: "Launchpad", href: "/" },
  { label: "Feed", href: "/feed" },
];

interface TopBarProps {
  isLoggedIn?: boolean;
  onGate?: (feature: string) => void;
}

export default function TopBar({ isLoggedIn = true, onGate }: TopBarProps) {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  const gate = (feature: string, e: React.MouseEvent) => {
    if (!isLoggedIn && onGate) {
      e.preventDefault();
      onGate(feature);
    }
  };

  return (
    <header
      className={cn(
        "fixed left-0 right-0 z-40 flex items-center gap-4 px-6 h-14 border-b border-border",
        "bg-surface/90 backdrop-blur-md",
        "top-[28px]"
      )}
    >
      {/* Brand */}
      <Link href="/" className="shrink-0 mr-2">
        <HarvestLogo variant="inline" size={28} />
      </Link>

      {/* Nav */}
      <nav className="hidden md:flex items-center gap-1">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
              pathname === item.href
                ? "text-white bg-accent/10"
                : "text-muted hover:text-offwhite"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Search */}
      <div className="flex-1 hidden md:flex items-center max-w-xs">
        <div className="relative w-full">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted2" />
          <input
            placeholder="Search launches..."
            className="w-full bg-card border border-border rounded-btn pl-8 pr-3 py-1.5 text-sm text-offwhite placeholder:text-muted2 focus:border-accent focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Live stats */}
      <div className="hidden lg:flex items-center gap-4 text-xs text-muted shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
          <span className="text-offwhite font-mono">$4.28M</span>
          <span>TVL</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-gold font-mono">8</span>
          <span>Live</span>
        </div>
        {/* Multichain pill */}
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold"
          style={{ background: "rgba(59,158,255,0.06)", borderColor: "rgba(59,158,255,0.2)" }}>
          <span style={{ color: "#3B9EFF" }}>M</span>
          <span className="text-muted2">·</span>
          <span style={{ color: "#9945FF" }}>◎</span>
        </div>
      </div>

      <div className="flex-1" />

      {/* Auth state */}
      {isLoggedIn ? (
        <div className="flex items-center gap-2">
          {/* List Asset */}
          <Link href="/list">
            <Button variant="outline" size="sm" className="hidden md:inline-flex gap-1">
              <Plus size={12} />
              List Asset
            </Button>
          </Link>

          {/* Wallet balance */}
          <Link href="/wallet" onClick={(e) => gate("access your wallet", e)}>
            <button className="flex items-center gap-1.5 bg-card border border-border rounded-btn px-3 py-1.5 text-sm hover:border-accent transition-colors">
              <Wallet size={13} className="text-accent2" />
              <span className="font-mono text-accent2 font-medium">
                ${(MOCK_USER.balance + MOCK_PORTFOLIO.reduce((s, h) => s + h.currentValue, 0)).toFixed(2)}
              </span>
            </button>
          </Link>

          {/* AI Advisor quick access */}
          <Link href="/advisor">
            <button className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-btn bg-[rgba(249,168,37,0.08)] border border-gold/20 hover:border-gold/50 transition-colors">
              <Sparkles size={12} className="text-gold" />
              <span className="text-xs text-gold font-medium">AI</span>
            </button>
          </Link>

          {/* Notifications */}
          <Link href="/notifications">
            <button className="relative w-8 h-8 flex items-center justify-center rounded-btn hover:bg-card2 transition-colors text-muted hover:text-offwhite">
              <Bell size={16} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent" />
            </button>
          </Link>

          {/* Avatar */}
          <Link href="/dashboard" onClick={(e) => gate("view your dashboard", e)}>
            <button className="w-8 h-8 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-accent text-xs font-black font-syne hover:bg-accent/30 transition-colors">
              AJ
            </button>
          </Link>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Link href="/signin">
            <Button variant="ghost" size="sm">Sign In</Button>
          </Link>
          <Link href="/signup">
            <Button variant="primary" size="sm">Get Started Free</Button>
          </Link>
        </div>
      )}
    </header>
  );
}
