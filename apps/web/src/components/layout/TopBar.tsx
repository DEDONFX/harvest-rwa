"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Plus, Search, Wallet, Sparkles, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Button from "@/components/ui/Button";
import HarvestLogo from "@/components/HarvestLogo";
import { cn } from "@/lib/utils";
import { MOCK_USER, MOCK_PORTFOLIO } from "@/lib/mock-data";

const NAV_ITEMS = [
  { label: "Launchpad", href: "/" },
  { label: "Feed", href: "/feed" },
];

const SUPPORTED_CHAINS = [
  { name: "Mantle",     tag: "ERC-1400 · ZK Rollup",  color: "#00C896", assets: 5, logo: "/mantle-logo.png"     },
  { name: "Solana",     tag: "SPL Token · 400ms",       color: "#9945FF", assets: 3, logo: "/solana-logo.png"     },
  { name: "Ethereum",   tag: "ERC-1400 · Mainnet",      color: "#627EEA", assets: 3, logo: "/eth-logo.png"        },
  { name: "BNB Chain",  tag: "BEP-20 · BSC",            color: "#F3BA2F", assets: 3, logo: "/bnb-logo.png"        },
  { name: "Base",       tag: "ERC-1400 · L2",           color: "#0052FF", assets: 3, logo: "/base-logo.svg"       },
  { name: "AssetChain", tag: "RWA Native · XRP-EVM",    color: "#2B7EF7", assets: 3, logo: "/assetchain-logo.png" },
];

function MultichainDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold transition-all",
          open
            ? "bg-card2 border-accent/30 text-offwhite"
            : "bg-card border-border text-muted hover:text-offwhite hover:border-accent/20"
        )}
      >
        {/* Stacked chain logos — first 4 */}
        <div className="flex items-center -space-x-1.5">
          {SUPPORTED_CHAINS.slice(0, 4).map((c, i) => (
            <div
              key={c.name}
              className="w-4 h-4 rounded-full flex items-center justify-center"
              style={{ background: `${c.color}20`, border: `1px solid ${c.color}40`, zIndex: 10 - i }}
            >
              <img src={c.logo} alt={c.name} width={10} height={10} style={{ width: 10, height: 10, objectFit: "contain" }} />
            </div>
          ))}
        </div>
        <span>Multichain</span>
        <ChevronDown size={11} className={cn("transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-[240px] bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50">
          <div className="px-3 py-2 border-b border-border">
            <p className="text-[10px] text-muted uppercase tracking-widest font-bold">6 Active Networks</p>
          </div>

          {SUPPORTED_CHAINS.map((chain) => (
            <div key={chain.name} className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-card2 transition-colors">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `${chain.color}18`, border: `1px solid ${chain.color}30` }}>
                <img src={chain.logo} alt={chain.name} width={18} height={18} style={{ width: 18, height: 18, objectFit: "contain" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-offwhite">{chain.name}</p>
                <p className="text-[10px] text-muted truncate">{chain.tag}</p>
              </div>
              <div className="flex flex-col items-end gap-0.5 shrink-0">
                <div className="flex items-center gap-1 text-[9px] font-bold text-green">
                  <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
                  Live
                </div>
                <p className="text-[9px] text-muted">{chain.assets} assets</p>
              </div>
            </div>
          ))}

          <div className="border-t border-border px-3 py-2 bg-card2/50">
            <p className="text-[10px] text-muted text-center">More chains added every quarter</p>
          </div>
        </div>
      )}
    </div>
  );
}

interface TopBarProps {
  isLoggedIn?: boolean;
  onGate?: (feature: string) => void;
}

export default function TopBar({ isLoggedIn = true, onGate }: TopBarProps) {
  const pathname = usePathname();

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
          <span className="text-gold font-mono">20</span>
          <span>Assets</span>
        </div>
        <MultichainDropdown />
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
