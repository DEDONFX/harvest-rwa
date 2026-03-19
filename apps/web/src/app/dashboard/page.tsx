"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, TrendingUp, Wallet, BarChart2, Calendar, Sparkles, ArrowRight, Clock, MapPin } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import { MOCK_USER, MOCK_PORTFOLIO, MOCK_ASSETS } from "@/lib/mock-data";

function buildStatCards(nextPayoutStr: string) {
  return [
    { label: "Portfolio Value", value: "$1,042.50", delta: "+$52.40 (5.3%)", positive: true, icon: Wallet, color: "text-accent2" },
    { label: "Total Yield Earned", value: "$52.20", delta: "+$34.20 this month", positive: true, icon: TrendingUp, color: "text-green" },
    { label: "Avg Annual Yield", value: "9.1%", delta: "Across 3 assets", positive: true, icon: BarChart2, color: "text-gold" },
    { label: "Active Investments", value: String(MOCK_PORTFOLIO.length), delta: `Next payout ${nextPayoutStr}`, positive: true, icon: Calendar, color: "text-accent" },
  ];
}
import { formatUSD, formatNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis } from "recharts";

const CHART_DATA = [
  { month: "Oct", value: 820 },
  { month: "Nov", value: 850 },
  { month: "Dec", value: 900 },
  { month: "Jan", value: 920 },
  { month: "Feb", value: 980 },
  { month: "Mar", value: 1042 },
];


function CountUp({ target, decimals = 2, prefix = "" }: { target: number; decimals?: number; prefix?: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const step = target / 50;
    let cur = 0;
    const t = setInterval(() => {
      cur += step;
      if (cur >= target) { setVal(target); clearInterval(t); }
      else setVal(cur);
    }, 20);
    return () => clearInterval(t);
  }, [target]);
  return <>{prefix}{val.toFixed(decimals)}</>;
}

export default function DashboardPage() {
  const user = MOCK_USER;
  const portfolio = MOCK_PORTFOLIO;
  const recommendedAssets = MOCK_ASSETS.filter((a) => a.status === "live").slice(0, 3);
  const nearestPayout = MOCK_PORTFOLIO.reduce<Date | null>((earliest, h) => {
    const d = new Date(h.nextPayout);
    return !earliest || d < earliest ? d : earliest;
  }, null);
  const nextPayoutStr = nearestPayout
    ? nearestPayout.toLocaleDateString("en-GB", { day: "numeric", month: "short" })
    : "—";
  const STAT_CARDS = buildStatCards(nextPayoutStr);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Greeting */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-syne font-black text-2xl text-white mb-1">
              Good morning, {user.name.split(" ")[0]}
            </h1>
            <p className="text-sm text-muted">
              Your portfolio is up <span className="text-green font-medium">+5.3%</span> this month
            </p>
          </div>
          <div className="flex items-center gap-2">
            {user.kycTier === 0 && (
              <Button variant="outline" size="sm" className="text-gold border-gold/40 hover:bg-gold/10">
                Complete KYC
              </Button>
            )}
            <Link href="/discover">
              <Button variant="primary" size="sm">
                Discover Assets <ArrowRight size={12} />
              </Button>
            </Link>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STAT_CARDS.map((stat) => (
            <div key={stat.label} className="bg-card border border-border rounded-card p-5">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs text-muted uppercase tracking-wide font-dm">{stat.label}</span>
                <stat.icon size={14} className={stat.color} />
              </div>
              <div className={cn("font-mono font-bold text-2xl mb-1", stat.color)}>
                {stat.value}
              </div>
              <div className={cn("text-xs font-dm", stat.positive ? "text-green" : "text-red")}>
                {stat.delta}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Portfolio chart */}
          <div className="lg:col-span-2 bg-card border border-border rounded-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-syne font-bold text-white">Portfolio Growth</h2>
              <div className="flex gap-1">
                {["1M", "3M", "6M", "1Y"].map((p) => (
                  <button key={p} className={cn(
                    "px-3 py-1.5 rounded text-xs font-medium transition-colors min-h-[32px]",
                    p === "6M" ? "bg-accent/15 text-accent" : "text-muted hover:text-offwhite"
                  )}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={CHART_DATA}>
                <XAxis dataKey="month" tick={{ fill: "#7A7A9D", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "#16161F", border: "1px solid #1E1E2E", borderRadius: 10, fontSize: 12 }}
                  itemStyle={{ color: "#00D2FF" }}
                  formatter={(v: number) => [formatUSD(v), "Value"]}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#6C5CE7"
                  strokeWidth={2}
                  dot={{ fill: "#6C5CE7", r: 3 }}
                  activeDot={{ r: 5, fill: "#00D2FF" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* AI Monthly Report */}
          <div className="bg-card border border-border rounded-card p-5 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={14} className="text-gold" />
              <h2 className="text-sm font-medium text-white">AI Monthly Report</h2>
              <span className="ml-auto text-[10px] text-muted">March 2026</span>
            </div>
            <div className="flex-1 bg-[rgba(249,168,37,0.05)] border border-gold/20 rounded-xl p-4">
              <p className="text-sm text-muted leading-relaxed">
                This month your portfolio earned{" "}
                <span className="text-green font-medium">$34.20</span>. Brazil Solar is running{" "}
                <span className="text-green font-medium">12% above projection</span> due to strong solar irradiance in Q1.
                Your Lisbon property had a minor dip but occupancy has recovered to 91%.
                Overall annualised yield:{" "}
                <span className="text-accent2 font-mono font-medium">9.1%</span> — above your 7% target.
              </p>
            </div>
            <div className="mt-3 text-[10px] text-muted/60 text-center">AI-generated · Updated 1st of each month</div>
          </div>
        </div>

        {/* Holdings */}
        <div className="bg-card border border-border rounded-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-syne font-bold text-white">Your Holdings</h2>
            <Link href="/portfolio">
              <Button variant="ghost" size="sm">View Portfolio <ArrowRight size={12} /></Button>
            </Link>
          </div>

          <div className="divide-y divide-border">
            {portfolio.map((holding) => {
              const raisedPct = (holding.currentValue / holding.purchaseValue - 1) * 100;
              return (
                <div key={holding.assetId} className="px-5 py-4 flex items-center gap-4 hover:bg-card2/50 transition-colors">
                  <div className="w-10 h-10 rounded-xl overflow-hidden relative shrink-0">
                    <Image src={holding.assetImage} alt={holding.assetName} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{holding.assetName}</p>
                    <p className="text-xs text-muted font-mono">{holding.tokens} tokens</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-mono font-medium text-offwhite">{formatUSD(holding.currentValue)}</p>
                    <p className="text-xs text-green font-mono">+{formatUSD(holding.yieldEarned)} yield</p>
                  </div>
                  <div className="text-right shrink-0 hidden sm:block">
                    <p className="text-sm font-bold text-accent2 font-mono">{holding.annualYieldPercent}%</p>
                    <p className="text-[10px] text-muted">APY</p>
                  </div>
                  <div className="shrink-0 hidden md:flex flex-col items-end gap-1">
                    <p className="text-[10px] text-muted">Next payout</p>
                    <p className="text-xs text-offwhite font-mono flex items-center gap-1">
                      <Clock size={9} />
                      {new Date(holding.nextPayout).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommended */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-syne font-bold text-white">Recommended For You</h2>
              <p className="text-xs text-muted mt-0.5">Based on your balanced risk profile</p>
            </div>
            <Link href="/discover">
              <Button variant="ghost" size="sm">See All</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {recommendedAssets.map((asset) => (
              <Link key={asset.id} href={`/asset/${asset.id}`}>
                <div className="bg-card border border-border rounded-card p-4 hover:border-accent transition-all hover:-translate-y-0.5 cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <span className="flex items-center gap-1 text-xs text-muted"><MapPin size={10} className="shrink-0" />{asset.country}</span>
                    <span className="text-xs font-mono text-accent2 font-bold">{asset.annualYieldPercent}% APY</span>
                  </div>
                  <p className="text-sm font-bold text-white font-syne mb-2 line-clamp-2">{asset.name}</p>
                  <ProgressBar value={(asset.raisedAmount / asset.raiseTarget) * 100} height={4} />
                  <div className="flex justify-between mt-2 text-[10px] text-muted">
                    <span className="font-mono">{((asset.raisedAmount / asset.raiseTarget) * 100).toFixed(0)}% raised</span>
                    <span className="text-gold font-mono">Risk {asset.riskScore}/10</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
