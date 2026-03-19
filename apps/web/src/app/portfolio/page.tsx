"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  TrendingUp, Clock, ArrowUpRight, Send, ShoppingCart, BarChart2,
  Sparkles, ArrowRight, Shield, Zap, PieChart, RefreshCw
} from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import { MOCK_PORTFOLIO, MOCK_ASSETS, MOCK_USER, CATEGORY_LABELS } from "@/lib/mock-data";
import { formatUSD, formatNumber } from "@/lib/utils";
import { useAuthGuard } from "@/components/AuthGuard";
import { cn } from "@/lib/utils";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell
} from "recharts";

const YIELD_HISTORY = [
  { month: "Oct", yield: 42, value: 8800 },
  { month: "Nov", yield: 86, value: 9200 },
  { month: "Dec", yield: 104, value: 9400 },
  { month: "Jan", yield: 128, value: 9700 },
  { month: "Feb", yield: 186, value: 10120 },
  { month: "Mar", yield: 916, value: 10120 },
];

const PIE_COLORS = ["#6C5CE7", "#00D2FF", "#F9A825", "#00C896"];

function buildAiInsights(ukPayoutStr: string, solarPayoutStr: string, daysToNext: number) {
  return [
    { icon: TrendingUp, color: "text-green", bg: "bg-green/10", title: "Portfolio outperforming", body: "Your weighted APY of 9.4% beats the platform average of 8.1%. Brazil Solar is up 12% above projection this quarter." },
    { icon: Shield, color: "text-accent", bg: "bg-accent/10", title: "Risk profile: Balanced", body: "Your portfolio risk score is 5.4/10 — in line with your stated preference. Consider adding a low-risk (1–3) asset to balance Brazil Solar's exposure." },
    { icon: Zap, color: "text-gold", bg: "bg-gold/10", title: `Next payout in ${daysToNext} days`, body: `UK Private Credit Fund distributes quarterly yield on ${ukPayoutStr}. Estimated: $121.50. Brazil Solar pays monthly — $47.50 due ${solarPayoutStr}.` },
    { icon: PieChart, color: "text-accent2", bg: "bg-[rgba(0,210,255,0.1)]", title: "Diversification tip", body: "You have 49% in infrastructure — consider adding a business yield or commodities asset to reduce sector concentration." },
  ];
}

function CountUp({ target, prefix = "", decimals = 2 }: { target: number; prefix?: string; decimals?: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const step = target / 50;
    let cur = 0;
    const t = setInterval(() => {
      cur = Math.min(cur + step, target);
      setVal(cur);
      if (cur >= target) clearInterval(t);
    }, 20);
    return () => clearInterval(t);
  }, [target]);
  return <>{prefix}{val.toFixed(decimals)}</>;
}

export default function PortfolioPage() {
  const blocked = useAuthGuard("/portfolio");
  const [view, setView] = useState<"cards" | "list">("cards");
  const [chartPeriod, setChartPeriod] = useState("6M");
  const [aiInsightIdx, setAiInsightIdx] = useState(0);

  if (blocked) return null;

  const tokenValue = MOCK_PORTFOLIO.reduce((s, h) => s + h.currentValue, 0);
  const totalValue = tokenValue + MOCK_USER.balance; // net worth = tokens + USDC
  const totalYield = MOCK_PORTFOLIO.reduce((s, h) => s + h.yieldEarned, 0);
  const avgAPY = MOCK_PORTFOLIO.reduce((s, h) => s + h.annualYieldPercent, 0) / MOCK_PORTFOLIO.length;
  const totalInvested = MOCK_PORTFOLIO.reduce((s, h) => s + h.purchaseValue, 0);
  const pnl = tokenValue - totalInvested;

  const nearestPayout = MOCK_PORTFOLIO.reduce<Date | null>((earliest, h) => {
    const d = new Date(h.nextPayout);
    return !earliest || d < earliest ? d : earliest;
  }, null);
  const daysToNext = nearestPayout ? Math.max(1, Math.ceil((nearestPayout.getTime() - Date.now()) / 86400000)) : 0;
  const ukHolding = MOCK_PORTFOLIO[0];
  const solarHolding = MOCK_PORTFOLIO[1];
  const fmtDate = (h: typeof ukHolding) => new Date(h.nextPayout).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  const AI_INSIGHTS = buildAiInsights(fmtDate(ukHolding), fmtDate(solarHolding), daysToNext);

  const pieData = MOCK_PORTFOLIO.map((h) => ({
    name: h.assetName.split(" ").slice(0, 2).join(" "),
    value: h.currentValue,
  }));

  const insight = AI_INSIGHTS[aiInsightIdx];
  const InsightIcon = insight.icon;

  return (
    <AppShell>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-syne font-black text-3xl text-white mb-1">Portfolio</h1>
            <p className="text-sm text-muted">{MOCK_PORTFOLIO.length} active holdings · Updated just now</p>
          </div>
          <Link href="/discover">
            <Button variant="primary" size="sm">
              <TrendingUp size={12} /> Buy More Assets
            </Button>
          </Link>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Net worth — spans visually but is one cell */}
          <div className="bg-card border border-accent/20 rounded-card p-5 col-span-2 lg:col-span-1">
            <p className="text-xs text-muted uppercase tracking-wide mb-2">Net Worth</p>
            <p className="font-mono font-black text-2xl text-accent2">
              <CountUp target={totalValue} prefix="$" decimals={2} />
            </p>
            <div className="flex items-center gap-3 mt-2 text-[10px] text-muted font-mono">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
                Tokens {formatUSD(tokenValue)}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-accent2 inline-block" />
                USDC {formatUSD(MOCK_USER.balance)}
              </span>
            </div>
          </div>
          {[
            { label: "Total Yield Earned", value: totalYield, prefix: "$", color: "text-green", decimals: 2 },
            { label: "Avg Annual Yield", value: avgAPY, prefix: "", suffix: "%", color: "text-gold", decimals: 1 },
            { label: "Unrealised P&L", value: pnl, prefix: pnl >= 0 ? "+$" : "-$", color: pnl >= 0 ? "text-green" : "text-red", decimals: 2 },
          ].map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-card p-5">
              <p className="text-xs text-muted uppercase tracking-wide mb-2">{s.label}</p>
              <p className={cn("font-mono font-black text-2xl", s.color)}>
                <CountUp target={s.value} prefix={s.prefix} decimals={s.decimals} />
                {s.suffix}
              </p>
            </div>
          ))}
        </div>

        {/* Charts + AI Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Yield history chart */}
          <div className="lg:col-span-2 bg-card border border-border rounded-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-syne font-bold text-white text-sm">Portfolio Value</h2>
              <div className="flex gap-1">
                {["1M", "3M", "6M", "1Y"].map((p) => (
                  <button
                    key={p}
                    onClick={() => setChartPeriod(p)}
                    className={cn(
                      "px-3 py-1.5 rounded text-xs font-medium transition-colors min-h-[32px]",
                      chartPeriod === p ? "bg-accent/15 text-accent" : "text-muted hover:text-offwhite"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={150}>
              <AreaChart data={YIELD_HISTORY}>
                <defs>
                  <linearGradient id="valueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6C5CE7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6C5CE7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fill: "#7A7A9D", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "#16161F", border: "1px solid #1E1E2E", borderRadius: 10, fontSize: 12 }}
                  itemStyle={{ color: "#00D2FF" }}
                  formatter={(v: number) => [formatUSD(v), "Value"]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#6C5CE7"
                  strokeWidth={2}
                  fill="url(#valueGrad)"
                  dot={{ fill: "#6C5CE7", r: 3 }}
                  activeDot={{ r: 5, fill: "#00D2FF" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Allocation pie */}
          <div className="bg-card border border-border rounded-card p-5">
            <h2 className="font-syne font-bold text-white text-sm mb-4">Allocation</h2>
            <ResponsiveContainer width="100%" height={110}>
              <RePieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={50}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
              </RePieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {pieData.map((d, i) => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: PIE_COLORS[i] }} />
                    <span className="text-muted truncate max-w-[100px]">{d.name}</span>
                  </div>
                  <span className="font-mono text-offwhite">{((d.value / totalValue) * 100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Portfolio Intelligence */}
        <div className="bg-[rgba(249,168,37,0.04)] border border-gold/20 rounded-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={15} className="text-gold" />
              <span className="text-sm font-medium text-white">AI Portfolio Intelligence</span>
              <span className="text-[10px] text-muted border border-border rounded-full px-2 py-0.5">Powered by Claude</span>
            </div>
            <div className="flex items-center gap-1">
              {AI_INSIGHTS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setAiInsightIdx(i)}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full transition-all",
                    i === aiInsightIdx ? "bg-gold w-4" : "bg-muted2"
                  )}
                />
              ))}
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", insight.bg)}>
              <InsightIcon size={18} className={insight.color} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white mb-1">{insight.title}</p>
              <p className="text-sm text-muted leading-relaxed">{insight.body}</p>
            </div>
            <Link href="/advisor" className="shrink-0">
              <Button variant="ghost" size="sm" className="text-gold hover:text-offwhite">
                Ask AI <ArrowRight size={11} />
              </Button>
            </Link>
          </div>

          <div className="flex gap-2 mt-4 flex-wrap">
            {["Forecast Q2 yield", "Rebalancing advice", "Risk analysis", "Compare assets"].map((q) => (
              <Link key={q} href="/advisor">
                <button className="text-xs px-2.5 py-1.5 bg-card border border-border rounded-full text-muted hover:text-offwhite hover:border-gold/30 transition-all">
                  {q}
                </button>
              </Link>
            ))}
          </div>
        </div>

        {/* Holdings header */}
        <div className="flex items-center justify-between">
          <h2 className="font-syne font-bold text-white">Your Holdings</h2>
          <div className="flex gap-1 bg-card border border-border rounded-btn p-1">
            {(["cards", "list"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize",
                  view === v ? "bg-accent/15 text-accent" : "text-muted hover:text-offwhite"
                )}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Cards view */}
        {view === "cards" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MOCK_PORTFOLIO.map((holding) => {
              const pnl = holding.currentValue - holding.purchaseValue;
              const yieldPct = (holding.yieldEarned / holding.purchaseValue) * 100;
              return (
                <div key={holding.assetId} className="bg-card border border-border rounded-card overflow-hidden card-hover group">
                  {/* Image banner */}
                  <div className="relative h-28 overflow-hidden">
                    <Image
                      src={holding.assetImage}
                      alt={holding.assetName}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <Badge variant="green" dot>Active</Badge>
                    </div>
                    <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1">
                      <span className="font-mono font-black text-accent2 text-sm">{holding.annualYieldPercent}%</span>
                      <span className="text-[10px] text-muted ml-1">APY</span>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <p className="text-[10px] text-muted/80 uppercase tracking-wide">{CATEGORY_LABELS[holding.category]}</p>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <p className="font-syne font-bold text-white text-sm leading-tight">{holding.assetName}</p>

                    {/* Key metrics grid */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <div>
                        <p className="text-[10px] text-muted uppercase tracking-wide">Current Value</p>
                        <p className="font-mono font-bold text-white">{formatUSD(holding.currentValue)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted uppercase tracking-wide">Yield Earned</p>
                        <p className="font-mono font-bold text-green">{formatUSD(holding.yieldEarned)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted uppercase tracking-wide">Tokens</p>
                        <p className="font-mono text-offwhite">{holding.tokens.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted uppercase tracking-wide">P&L</p>
                        <p className={cn("font-mono font-medium", pnl >= 0 ? "text-green" : "text-red")}>
                          {pnl >= 0 ? "+" : ""}{formatUSD(pnl)}
                        </p>
                      </div>
                    </div>

                    {/* Yield bar */}
                    <div>
                      <div className="flex justify-between text-[10px] text-muted mb-1">
                        <span>Yield vs investment</span>
                        <span className="text-green font-mono">{yieldPct.toFixed(1)}%</span>
                      </div>
                      <ProgressBar value={Math.min(yieldPct * 5, 100)} height={4} />
                    </div>

                    {/* Next payout */}
                    <div className="flex items-center gap-1.5 text-xs pt-1 border-t border-border">
                      <Clock size={10} className="text-gold" />
                      <span className="text-muted">Next payout:</span>
                      <span className="text-gold font-mono font-medium">
                        {new Date(holding.nextPayout).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                      </span>
                      <span className="text-muted ml-auto">
                        ~{formatUSD((holding.currentValue * holding.annualYieldPercent / 100) / 12)}/mo
                      </span>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <Link href={`/asset/${holding.assetId}`} className="flex-1">
                        <Button variant="secondary" size="sm" fullWidth>
                          <BarChart2 size={11} /> Details
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm" className="flex-1">
                        <ShoppingCart size={11} /> Sell
                      </Button>
                      <Link href="/settings">
                        <Button variant="ghost" size="sm">
                          <Send size={11} />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List view */
          <div className="bg-card border border-border rounded-card overflow-hidden">
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-4 px-5 py-3 border-b border-border text-[10px] uppercase tracking-widest text-muted">
              <span>Asset</span>
              <span>Tokens</span>
              <span>Value</span>
              <span>Yield Earned</span>
              <span>APY</span>
              <span>Next Payout</span>
            </div>
            {MOCK_PORTFOLIO.map((holding) => (
              <Link key={holding.assetId} href={`/asset/${holding.assetId}`}>
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-4 items-center px-5 py-4 border-b border-border last:border-0 hover:bg-card2/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl overflow-hidden relative shrink-0">
                      <Image src={holding.assetImage} alt={holding.assetName} fill className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">{holding.assetName}</p>
                      <p className="text-[10px] text-muted">{CATEGORY_LABELS[holding.category]}</p>
                    </div>
                  </div>
                  <span className="text-sm font-mono text-muted">{holding.tokens.toLocaleString()}</span>
                  <span className="text-sm font-mono text-offwhite font-medium">{formatUSD(holding.currentValue)}</span>
                  <span className="text-sm font-mono text-green">{formatUSD(holding.yieldEarned)}</span>
                  <span className="text-sm font-black font-mono text-accent2">{holding.annualYieldPercent}%</span>
                  <div className="flex items-center gap-1 text-xs">
                    <Clock size={10} className="text-gold" />
                    <span className="font-mono text-offwhite">
                      {new Date(holding.nextPayout).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Yield history table */}
        <div className="bg-card border border-border rounded-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-syne font-bold text-white text-sm">Yield History</h2>
            <span className="text-xs text-muted">Last 6 months</span>
          </div>
          <div className="divide-y divide-border">
            {[
              { date: "Mar 1, 2026", asset: "Brazil Solar Energy Fund", amount: 570.00, type: "Monthly" },
              { date: "Feb 1, 2026", asset: "Brazil Solar Energy Fund", amount: 228.00, type: "Monthly" },
              { date: "Jan 1, 2026", asset: "UK Private Credit Fund", amount: 121.50, type: "Quarterly" },
              { date: "Jan 1, 2026", asset: "Lisbon Commercial Property", amount: 180.00, type: "Quarterly" },
              { date: "Dec 1, 2025", asset: "Brazil Solar Energy Fund", amount: 114.00, type: "Monthly" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3 hover:bg-card2/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green shrink-0" />
                  <div>
                    <p className="text-sm text-offwhite">{item.asset}</p>
                    <p className="text-xs text-muted">{item.date} · {item.type}</p>
                  </div>
                </div>
                <span className="font-mono font-bold text-green">+{formatUSD(item.amount)}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AppShell>
  );
}
