"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { MOCK_ACTIVITY } from "@/lib/mock-data";
import type { ActivityItem } from "@/types";
import { timeAgo, cn } from "@/lib/utils";

const eventConfig = {
  LAUNCHED: { color: "text-gold", bg: "bg-[rgba(249,168,37,0.1)]", dot: "bg-gold", label: "LAUNCHED" },
  INVESTED: { color: "text-green", bg: "bg-[rgba(0,200,150,0.08)]", dot: "bg-green", label: "INVESTED" },
  YIELD: { color: "text-accent2", bg: "bg-[rgba(0,210,255,0.08)]", dot: "bg-accent2", label: "YIELD" },
  MILESTONE: { color: "text-gold", bg: "bg-[rgba(249,168,37,0.08)]", dot: "bg-gold", label: "MILESTONE" },
  COMPLETE: { color: "text-green", bg: "bg-[rgba(0,200,150,0.1)]", dot: "bg-green", label: "COMPLETE" },
};

export default function RightRail() {
  const [items, setItems] = useState<ActivityItem[]>(MOCK_ACTIVITY);
  const [newId, setNewId] = useState<string | null>(null);

  // Simulate live activity
  useEffect(() => {
    const NEW_EVENTS: ActivityItem[] = [
      { id: `live-${Date.now()}`, eventType: "INVESTED", headline: "Someone invested $75 in Dubai Logistics", subtitle: "30.5% raised · 11d left", createdAt: new Date(), assetId: "asset-004" },
      { id: `live-${Date.now()+1}`, eventType: "INVESTED", headline: "Someone invested $500 in Lisbon Property", subtitle: "69.1% raised · 4d left", createdAt: new Date(), assetId: "asset-001" },
      { id: `live-${Date.now()+2}`, eventType: "YIELD", headline: "Brazil Solar distributed $128.40", subtitle: "$0.041/token · 1,342 holders", createdAt: new Date(), assetId: "asset-002" },
      { id: `live-${Date.now()+3}`, eventType: "LAUNCHED", headline: "Manila Data Centre passed 65%", subtitle: "$389K raised of $600K", createdAt: new Date(), assetId: "asset-006" },
    ];

    let index = 0;
    const interval = setInterval(() => {
      const newItem = { ...NEW_EVENTS[index % NEW_EVENTS.length], id: `live-${Date.now()}`, createdAt: new Date() };
      setItems((prev) => [newItem, ...prev.slice(0, 11)]);
      setNewId(newItem.id);
      setTimeout(() => setNewId(null), 600);
      index++;
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <aside className="hidden xl:flex flex-col w-[268px] shrink-0 sticky top-[84px] h-[calc(100vh-84px)] overflow-y-auto overscroll-contain scrollbar-none">
      <div className="flex flex-col gap-3 pb-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-medium uppercase tracking-widest text-muted font-dm">
            Live Activity
          </h3>
          <span className="flex items-center gap-1 text-[10px] text-green">
            <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
            Live
          </span>
        </div>

        {/* Activity list */}
        <div className="flex flex-col gap-1.5 overflow-hidden">
          {items.slice(0, 10).map((item) => {
            const cfg = eventConfig[item.eventType];
            const card = (
              <div
                className={cn(
                  "rounded-xl p-3 border border-border/50 transition-all duration-300",
                  newId === item.id ? "activity-new border-gold/30" : "bg-card/50",
                  item.assetId && "hover:border-accent/40 cursor-pointer"
                )}
              >
                <div className="flex items-start justify-between gap-2 mb-0.5">
                  <span className={cn("text-[9px] font-bold tracking-widest uppercase", cfg.color)}>
                    {cfg.label}
                  </span>
                  <span className="text-[10px] text-muted shrink-0">{timeAgo(item.createdAt)}</span>
                </div>
                <p className="text-[12px] font-medium text-offwhite leading-tight">{item.headline}</p>
                <p className="text-[10px] text-muted mt-0.5">{item.subtitle}</p>
              </div>
            );
            return item.assetId ? (
              <Link key={item.id} href={`/asset/${item.assetId}`}>{card}</Link>
            ) : (
              <div key={item.id}>{card}</div>
            );
          })}
        </div>

        {/* AI Advisor card */}
        <Link href="/advisor">
          <div className="mt-1 rounded-xl border border-gold/20 p-3 bg-[rgba(249,168,37,0.04)] hover:border-gold/40 transition-colors cursor-pointer">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={13} className="text-gold" />
              <p className="text-[11px] font-medium text-white">AI Portfolio Advisor</p>
            </div>
            <p className="text-[10px] text-muted leading-relaxed mb-2">
              Ask Claude about your portfolio, yield forecast, or get asset recommendations tailored to your profile.
            </p>
            <div className="flex items-center gap-1 text-[10px] text-gold font-medium">
              Ask now <ArrowRight size={10} />
            </div>
          </div>
        </Link>

        {/* Multichain badge */}
        <div className="rounded-xl border border-border p-3 bg-card/50">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-semibold text-offwhite">Multichain Infrastructure</p>
            <div className="flex items-center gap-1 text-[10px] text-green">
              <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
              Live
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[10px] font-bold"
              style={{ background: "rgba(59,158,255,0.08)", borderColor: "rgba(59,158,255,0.2)", color: "#3B9EFF" }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                <defs><linearGradient id="rr-mnt" x1="0.5" y1="0" x2="0.5" y2="1"><stop offset="0%" stopColor="#ffffff" stopOpacity="0.95"/><stop offset="100%" stopColor="#00C896"/></linearGradient></defs>
                {[0,45,90,135,180,225,270,315].map((a,i)=>{const r=(a-90)*Math.PI/180,h=4.8,w=2.4,cx=12,cy=12,ir=3.6;return(<rect key={i} x={cx+Math.cos(r)*(ir+h/2)-w/2} y={cy+Math.sin(r)*(ir+h/2)-h/2} width={w} height={h} rx={0.6} fill="url(#rr-mnt)" transform={`rotate(${a},${cx},${cy})`}/>);})}
              </svg>
              Mantle
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[10px] font-bold"
              style={{ background: "rgba(153,69,255,0.08)", borderColor: "rgba(153,69,255,0.2)", color: "#9945FF" }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                <path d="M6.5 15.5h9l-2 2h-9l2-2z" fill="#9945FF"/>
                <path d="M6.5 11.5h9l-2 2h-9l2-2z" fill="#9945FF" fillOpacity="0.7"/>
                <path d="M6.5 7.5h9l-2 2h-9l2-2z" fill="#14F195"/>
              </svg>
              Solana
            </div>
            <p className="text-[9px] text-muted ml-auto">All txns on-chain</p>
          </div>
        </div>

        {/* AI Market Pulse */}
        <div className="rounded-xl border border-accent/20 bg-accent/5 p-3">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-bold text-white">AI Market Pulse</p>
            <span className="text-[9px] font-bold bg-accent/15 text-accent2 px-2 py-0.5 rounded-full uppercase tracking-wide">AI</span>
          </div>
          <div className="space-y-2">
            {[
              { text: "Brazil Solar is the most invested asset in the last hour — 23 transactions" },
              { text: "4 assets closing within 24 hours — Manchester Housing at 83%" },
              { text: "Real estate yields averaged 8.4% across 12 assets this week" },
              { text: "Lagos Invoice Pool yield running 12% above its 90-day average" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent2 mt-1 shrink-0" />
                <p className="text-[10px] text-muted leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Network Stats */}
        <div className="rounded-xl border border-border p-3 bg-card/50">
          <p className="text-[9px] font-bold text-muted uppercase tracking-widest mb-2">Network Stats</p>
          <div className="space-y-1.5">
            <div className="bg-card2 rounded-lg px-3 py-2">
              <p className="font-mono font-bold text-white text-sm">$4,247,382</p>
              <p className="text-[9px] text-muted">Total Yield Distributed</p>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <div className="bg-card2 rounded-lg px-2 py-1.5 text-center">
                <p className="font-mono font-bold text-white text-sm">30</p>
                <p className="text-[9px] text-muted">Live Assets</p>
              </div>
              <div className="bg-card2 rounded-lg px-2 py-1.5 text-center">
                <p className="font-mono font-bold text-white text-sm">12.8k</p>
                <p className="text-[9px] text-muted">Investors</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div>
          <p className="text-[9px] font-bold text-muted uppercase tracking-widest mb-2">Top Performers</p>
          <div className="flex flex-col gap-1.5">
            {[
              { yield: "7.2%", name: "Lisbon Property", raised: "68% raised", id: "asset-001" },
              { yield: "11.4%", name: "Brazil Solar", raised: "79% raised", id: "asset-002" },
              { yield: "8.9%", name: "Dubai Logistics", raised: "30% raised", id: "asset-004" },
            ].map((a) => (
              <Link key={a.id} href={`/asset/${a.id}`}>
                <div className="flex items-center gap-2 bg-card border border-border rounded-xl p-2 hover:border-accent/30 transition-colors cursor-pointer">
                  <span className="font-mono text-[11px] font-bold text-accent2 w-10 shrink-0">{a.yield}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold text-offwhite truncate">{a.name}</p>
                    <p className="text-[9px] text-muted">{a.raised}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
