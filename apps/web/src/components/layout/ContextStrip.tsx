"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getIsLoggedIn } from "@/lib/auth";
import { MOCK_PORTFOLIO, MOCK_USER } from "@/lib/mock-data";
import { formatUSD } from "@/lib/utils";
import { Plus, Search, ListPlus, Sparkles } from "lucide-react";

export default function ContextStrip() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => { setIsLoggedIn(getIsLoggedIn()); }, []);

  const tokenTotal = MOCK_PORTFOLIO.reduce((s, h) => s + h.currentValue, 0);
  const netWorth = tokenTotal + MOCK_USER.balance;
  const totalYield = MOCK_PORTFOLIO.reduce((s, h) => s + h.yieldEarned, 0);
  const monthlyYield = totalYield / 12;
  const nextPayoutDate = MOCK_PORTFOLIO.reduce<Date | null>((earliest, h) => {
    const d = new Date(h.nextPayout);
    return !earliest || d < earliest ? d : earliest;
  }, null);
  const nextPayoutStr = nextPayoutDate
    ? nextPayoutDate.toLocaleDateString("en-GB", { day: "numeric", month: "short" })
    : "—";

  return (
    <aside className="hidden xl:flex flex-col w-[180px] shrink-0 border-r border-border bg-surface overflow-y-auto sticky top-[84px] h-[calc(100vh-84px)] py-3 px-2.5 gap-4">
      {/* Portfolio section - only when logged in */}
      {isLoggedIn && (
        <div>
          <p className="text-[9px] font-bold text-muted uppercase tracking-widest mb-2">Your Portfolio</p>
          {/* Total Value */}
          <div className="bg-card border border-border rounded-xl p-2.5 mb-1.5">
            <p className="font-mono font-bold text-white text-base leading-tight">{formatUSD(netWorth)}</p>
            <p className="text-[9px] text-muted mt-0.5">Total Value</p>
          </div>
          {/* Earned this month */}
          <div className="bg-card border border-border rounded-xl p-2.5 mb-1.5">
            <p className="font-mono font-bold text-green text-sm leading-tight">+{formatUSD(monthlyYield)}</p>
            <p className="text-[9px] text-muted mt-0.5">Earned this month</p>
          </div>
          {/* Sparkline */}
          <div className="bg-card border border-border rounded-xl p-2 mb-1.5 h-9 overflow-hidden">
            <svg viewBox="0 0 160 24" preserveAspectRatio="none" className="w-full h-full">
              <defs>
                <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C8872A" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#C8872A" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,18 C20,16 30,14 50,11 C70,8 80,12 100,7 C120,2 140,5 160,2 L160,24 L0,24 Z" fill="url(#sg)" />
              <path d="M0,18 C20,16 30,14 50,11 C70,8 80,12 100,7 C120,2 140,5 160,2" fill="none" stroke="#C8872A" strokeWidth="1.5" />
            </svg>
          </div>
          {/* Annualised yield */}
          <div className="bg-card border border-border rounded-xl p-2.5">
            <p className="font-mono font-bold text-accent2 text-sm leading-tight">8.4%</p>
            <p className="text-[9px] text-muted mt-0.5">Annualised yield</p>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <p className="text-[9px] font-bold text-muted uppercase tracking-widest mb-2">Quick Actions</p>
        <div className="flex flex-col gap-1">
          {[
            { icon: Plus, label: "Add Funds", href: "/wallet" },
            { icon: Search, label: "Browse Assets", href: "/discover" },
            { icon: ListPlus, label: "List an Asset", href: "/list" },
            { icon: Sparkles, label: "Ask AI Adviser", href: "/advisor" },
          ].map(({ icon: Icon, label, href }) => (
            <Link key={label} href={href}>
              <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-2.5 py-2 text-[11px] font-medium text-muted hover:text-offwhite hover:border-accent/30 transition-all cursor-pointer">
                <Icon size={11} className="shrink-0" />
                {label}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Market Snapshot */}
      <div>
        <p className="text-[9px] font-bold text-muted uppercase tracking-widest mb-2">Market Snapshot</p>
        <div className="flex flex-col divide-y divide-border">
          {[
            { cat: "Real Estate", yield: "7.8%", count: "12 live" },
            { cat: "Infrastructure", yield: "10.2%", count: "8 live" },
            { cat: "Business Yield", yield: "17.1%", count: "6 live" },
            { cat: "Commodities", yield: "13.4%", count: "4 live" },
          ].map(({ cat, yield: y, count }) => (
            <div key={cat} className="py-2">
              <p className="text-[11px] font-semibold text-offwhite">{cat}</p>
              <p className="text-[10px] text-muted">Avg {y} · {count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Health */}
      <div>
        <p className="text-[9px] font-bold text-muted uppercase tracking-widest mb-2">Platform Health</p>
        <div className="flex flex-col divide-y divide-border">
          <div className="py-2">
            <p className="text-[11px] font-semibold text-offwhite">Mantle Network</p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse shrink-0" />
              <p className="text-[10px] text-green">Operational</p>
            </div>
          </div>
          <div className="py-2">
            <p className="text-[11px] font-semibold text-offwhite">P2P Merchants</p>
            <p className="text-[10px] text-muted">24 online now</p>
          </div>
          <div className="py-2">
            <p className="text-[11px] font-semibold text-offwhite">Next Payouts</p>
            <p className="text-[10px] text-muted">{nextPayoutStr} · {MOCK_PORTFOLIO.length} assets</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
