"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search, ChevronDown, LayoutGrid, List, Flame, Clock,
  Users, TrendingUp, Zap, ArrowRight, Bell, Sparkles, Lock, MapPin
} from "lucide-react";
import TickerTape from "@/components/layout/TickerTape";
import TopBar from "@/components/layout/TopBar";
import Sidebar from "@/components/layout/Sidebar";
import RightRail from "@/components/layout/RightRail";
import ProgressBar from "@/components/ui/ProgressBar";
import RiskPips from "@/components/ui/RiskPips";
import GateModal from "@/components/ui/GateModal";
import { MOCK_ASSETS, CATEGORY_LABELS } from "@/lib/mock-data";
import CategoryIcon from "@/components/ui/CategoryIcon";
import type { Asset } from "@/types";
import { formatUSD, formatNumber, countdown } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { getIsLoggedIn } from "@/lib/auth";

const FILTERS = [
  { value: "All", label: "All", icon: null },
  { value: "Hot", label: "Hot", icon: Flame },
  { value: "New", label: "New", icon: Zap },
  { value: "Ending Soon", label: "Ending Soon", icon: Clock },
  { value: "Real Estate", label: "Real Estate", icon: null },
  { value: "Energy", label: "Energy", icon: null },
  { value: "Business Yield", label: "Business Yield", icon: null },
  { value: "Pre-Revenue", label: "Pre-Revenue", icon: null },
];
const RISK_CHIPS = ["Any Risk", "Low (1–4)", "Mid (5–6)", "High (7–10)"];
const YIELD_CHIPS = ["Any Yield", "5–10%", "10–15%", "15%+"];
const SORT_OPTIONS = ["Trending", "Highest Yield", "Lowest Risk", "Most Holders", "Ending Soon"];

type ChainFilter = "all" | "mantle" | "solana" | "ethereum" | "bnb" | "base" | "assetchain";
const CHAIN_FILTERS: { id: ChainFilter; label: string; logo?: string; color: string; bg: string; border: string }[] = [
  { id: "all",        label: "All Chains",  color: "#ffffff", bg: "rgba(255,255,255,0.08)", border: "rgba(255,255,255,0.2)" },
  { id: "mantle",     label: "Mantle",      logo: "/mantle-logo.png",     color: "#00C896", bg: "rgba(0,200,150,0.1)",   border: "rgba(0,200,150,0.3)"   },
  { id: "solana",     label: "Solana",      logo: "/solana-logo.png",     color: "#9945FF", bg: "rgba(153,69,255,0.1)",  border: "rgba(153,69,255,0.25)" },
  { id: "ethereum",   label: "Ethereum",    logo: "/eth-logo.png",        color: "#627EEA", bg: "rgba(98,126,234,0.1)",  border: "rgba(98,126,234,0.25)" },
  { id: "bnb",        label: "BNB",         logo: "/bnb-logo.png",        color: "#F3BA2F", bg: "rgba(243,186,47,0.1)",  border: "rgba(243,186,47,0.25)" },
  { id: "base",       label: "Base",        logo: "/base-logo.svg",       color: "#0052FF", bg: "rgba(0,82,255,0.1)",    border: "rgba(0,82,255,0.25)"   },
  { id: "assetchain", label: "AssetChain",  logo: "/assetchain-logo.png", color: "#2B7EF7", bg: "rgba(43,126,247,0.1)",  border: "rgba(43,126,247,0.25)" },
];

function StatPill({ value, label, color = "text-offwhite" }: { value: string; label: string; color?: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs">
      <span className={cn("font-mono font-bold", color)}>{value}</span>
      <span className="text-muted">{label}</span>
    </div>
  );
}

function LaunchCard({ asset, onGate, isLoggedIn }: { asset: Asset; onGate: (feature: string) => void; isLoggedIn: boolean }) {
  const raisedPct = (asset.raisedAmount / asset.raiseTarget) * 100;
  const isLive = asset.status === "live";
  const isUpcoming = asset.status === "upcoming";
  const isComplete = asset.status === "raise_complete";

  return (
    <Link href={`/asset/${asset.id}`} className="block group">
      <div className="bg-card border border-border rounded-card overflow-hidden transition-all duration-150 hover:-translate-y-[3px] hover:border-accent hover:shadow-accent">
        {/* Image */}
        <div className="relative overflow-hidden" style={{ height: 120 }}>
          <Image
            src={asset.image}
            alt={asset.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.06]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />

          {/* Status badges */}
          <div className="absolute top-2 left-2 flex gap-1.5 flex-wrap">
            {isLive && (
              <span className="flex items-center gap-1 bg-green/15 border border-green/40 text-green text-[9px] font-black tracking-widest uppercase rounded-full px-2 py-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" /> LIVE
              </span>
            )}
            {isUpcoming && (
              <span className="bg-gold/15 border border-gold/40 text-gold text-[9px] font-black tracking-widest uppercase rounded-full px-2 py-0.5">
                SOON
              </span>
            )}
            {isComplete && (
              <span className="bg-muted/15 border border-border text-muted text-[9px] font-black tracking-widest uppercase rounded-full px-2 py-0.5">
                SOLD OUT
              </span>
            )}
            {asset.trending && (
              <span className="flex items-center gap-0.5 bg-red/15 border border-red/30 text-red text-[9px] font-black tracking-widest uppercase rounded-full px-2 py-0.5">
                <Flame size={8} /> HOT
              </span>
            )}
            {asset.assetType === "pre_revenue" && (
              <span className="bg-accent/15 border border-accent/30 text-accent text-[9px] font-black uppercase rounded-full px-2 py-0.5">
                PRE-LAUNCH
              </span>
            )}
          </div>

          <div className="absolute bottom-2 right-2 w-6 h-6 rounded-md bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/80">
            <CategoryIcon category={asset.category} size={13} />
          </div>
        </div>

        {/* Body */}
        <div className="p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-[10px] text-muted uppercase tracking-wide"><MapPin size={9} className="shrink-0" />{asset.country}</span>
            <span className="text-[10px] text-muted uppercase tracking-wide">{CATEGORY_LABELS[asset.category]}</span>
          </div>

          <h3 className="font-syne font-bold text-sm text-white leading-tight line-clamp-2">{asset.name}</h3>

          <div className="flex items-end justify-between">
            <div>
              <span className="text-[10px] text-muted block">Annual Yield</span>
              <span className="text-2xl font-black font-mono text-accent2 leading-tight">{asset.annualYieldPercent.toFixed(1)}%</span>
            </div>
            <RiskPips score={asset.riskScore} />
          </div>

          {(isLive || isComplete) && (
            <div className="space-y-1">
              <ProgressBar value={raisedPct} height={5} />
              <div className="flex justify-between text-[10px] text-muted">
                <span className="font-mono">{formatUSD(asset.raisedAmount, 0)} in</span>
                <span className="font-mono font-medium text-offwhite">{raisedPct.toFixed(0)}% filled</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-1 border-t border-border/50 text-[10px] text-muted">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1">
                <Users size={10} />
                <span className="font-mono">{formatNumber(asset.investorCount)}</span> holders
              </span>
              <span className="font-mono">from {formatUSD(asset.minInvestment, 0)}</span>
            </div>
            {isLive && (
              <span className="flex items-center gap-1 text-gold font-mono">
                <Clock size={10} />
                {countdown(new Date(asset.closeDate))}
              </span>
            )}
            {isUpcoming && (
              <span className="text-accent font-mono">
                in {countdown(new Date(asset.launchDate))}
              </span>
            )}
          </div>

          {/* Get In button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              if (!isLoggedIn) {
                onGate("buy into this launch");
              } else {
                window.location.href = `/asset/${asset.id}`;
              }
            }}
            className={cn(
              "w-full py-2 rounded-btn text-sm font-bold transition-all",
              isComplete
                ? "bg-card2 border border-border text-muted cursor-not-allowed"
                : "bg-accent hover:bg-[#7B6CF0] text-white hover:-translate-y-0.5 hover:shadow-accent"
            )}
          >
            {isComplete ? "Sold Out" : isUpcoming ? "Notify Me" : "Get In →"}
          </button>
        </div>
      </div>
    </Link>
  );
}

function TrendingStrip({ assets }: { assets: Asset[] }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Flame size={14} className="text-red" />
        <span className="text-xs font-bold uppercase tracking-widest text-muted">Trending Launches</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {assets.slice(0, 4).map((asset, i) => (
          <Link key={asset.id} href={`/asset/${asset.id}`}>
            <div className="bg-card border border-border rounded-card overflow-hidden card-hover group relative">
              <div className="relative h-[70px] overflow-hidden">
                <Image src={asset.image} alt={asset.name} fill className="object-cover group-hover:scale-[1.06] transition-transform duration-300" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-80" />
                <span className="absolute bottom-1.5 right-2 text-5xl font-black font-syne text-white/8 select-none leading-none">{i + 1}</span>
                {asset.trending && (
                  <span className="absolute top-1.5 left-2 flex items-center gap-0.5 bg-red/20 text-red text-[9px] font-black uppercase rounded-full px-1.5 py-0.5">
                    <Flame size={7} /> HOT
                  </span>
                )}
              </div>
              <div className="p-3 space-y-1">
                <p className="flex items-center gap-1 text-[10px] text-muted"><MapPin size={9} className="shrink-0" />{asset.location}</p>
                <p className="text-xs font-bold text-white font-syne line-clamp-1">{asset.name}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black text-accent2 font-mono">{asset.annualYieldPercent}%</span>
                  <span className="text-[10px] text-gold font-mono">{asset.status === "live" ? countdown(new Date(asset.closeDate)) : "Soon"}</span>
                </div>
                <ProgressBar value={(asset.raisedAmount / asset.raiseTarget) * 100} height={3} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function LaunchpadPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [chainFilter, setChainFilter] = useState<ChainFilter>("all");
  const [risk, setRisk] = useState("Any Risk");
  const [yieldFilter, setYield] = useState("Any Yield");
  const [sort, setSort] = useState("Trending");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [gateFeature, setGateFeature] = useState<string | null>(null);
  const [IS_LOGGED_IN, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(getIsLoggedIn());
  }, []);

  const [liveCount, setLiveCount] = useState(8);
  const [tvl, setTvl] = useState(4280000);

  // Tick up TVL to simulate live activity
  useEffect(() => {
    const t = setInterval(() => {
      setTvl((v) => v + Math.floor(Math.random() * 50 + 10));
    }, 3000);
    return () => clearInterval(t);
  }, []);

  const filtered = useMemo(() => {
    let list = [...MOCK_ASSETS];

    if (search) list = list.filter((a) => a.name.toLowerCase().includes(search.toLowerCase()) || a.location.toLowerCase().includes(search.toLowerCase()));

    if (chainFilter !== "all") list = list.filter((a) => a.chain === chainFilter);

    if (filter === "Hot") list = list.filter((a) => a.trending);
    else if (filter === "New") list = list.filter((a) => a.status === "live");
    else if (filter === "Ending Soon") list = list.filter((a) => a.status === "live").sort((a, b) => new Date(a.closeDate).getTime() - new Date(b.closeDate).getTime());
    else if (filter === "Real Estate") list = list.filter((a) => a.category.startsWith("real-estate"));
    else if (filter === "Energy") list = list.filter((a) => a.category === "infrastructure-energy");
    else if (filter === "Business Yield") list = list.filter((a) => a.category === "business-yield");
    else if (filter === "Pre-Revenue") list = list.filter((a) => a.assetType === "pre_revenue");

    if (risk === "Low (1–4)") list = list.filter((a) => a.riskScore <= 4);
    else if (risk === "Mid (5–6)") list = list.filter((a) => a.riskScore >= 5 && a.riskScore <= 6);
    else if (risk === "High (7–10)") list = list.filter((a) => a.riskScore >= 7);

    if (yieldFilter === "5–10%") list = list.filter((a) => a.annualYieldPercent >= 5 && a.annualYieldPercent < 10);
    else if (yieldFilter === "10–15%") list = list.filter((a) => a.annualYieldPercent >= 10 && a.annualYieldPercent < 15);
    else if (yieldFilter === "15%+") list = list.filter((a) => a.annualYieldPercent >= 15);

    if (sort === "Highest Yield") list.sort((a, b) => b.annualYieldPercent - a.annualYieldPercent);
    else if (sort === "Lowest Risk") list.sort((a, b) => a.riskScore - b.riskScore);
    else if (sort === "Most Holders") list.sort((a, b) => b.investorCount - a.investorCount);
    else if (sort === "Ending Soon") list.sort((a, b) => new Date(a.closeDate).getTime() - new Date(b.closeDate).getTime());
    else list.sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0));

    return list;
  }, [search, filter, chainFilter, risk, yieldFilter, sort]);

  const trending = MOCK_ASSETS.filter((a) => a.trending);

  return (
    <div className="min-h-screen bg-ink">
      <TickerTape />
      <TopBar isLoggedIn={IS_LOGGED_IN} onGate={setGateFeature} />
      <Sidebar isLoggedIn={IS_LOGGED_IN} />

      <div className="pt-[84px] md:pl-14 min-h-screen">
        <div className="flex gap-6 max-w-[1440px] mx-auto px-3 sm:px-6 py-6">
          <main className="flex-1 min-w-0">

            {/* Hero strip */}
            <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
              <div>
                <h1 className="font-syne font-black text-3xl text-white leading-tight">
                  RWA Launchpad
                </h1>
                <p className="text-sm text-muted mt-0.5">
                  Real assets. Real yield. Launched like a memecoin.
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs bg-card border border-border rounded-xl px-3 py-2.5 overflow-x-auto shrink-0 max-w-full">
                <StatPill value={`$${(tvl / 1_000_000).toFixed(2)}M`} label="TVL" color="text-accent2" />
                <span className="w-px h-3 bg-border shrink-0" />
                <StatPill value={`${liveCount}`} label="live now" color="text-green" />
                <span className="w-px h-3 bg-border shrink-0" />
                <StatPill value="6,143" label="holders" color="text-gold" />
                <span className="w-px h-3 bg-border shrink-0" />
                <StatPill value="10.2%" label="avg APY" color="text-accent2" />
              </div>
            </div>

            {/* AI recommendation strip */}
            {IS_LOGGED_IN && (
              <Link href="/advisor">
                <div className="mb-6 flex items-center gap-3 bg-[rgba(249,168,37,0.05)] border border-gold/20 rounded-2xl px-4 py-3 hover:border-gold/40 transition-colors cursor-pointer">
                  <div className="w-8 h-8 rounded-xl bg-gold/15 border border-gold/20 flex items-center justify-center shrink-0">
                    <Sparkles size={14} className="text-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white">AI Recommendation for you</p>
                    <p className="text-xs text-muted truncate">Based on your balanced profile — Dubai Logistics Hub (8.9% APY, Risk 2) matches your goals.</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gold shrink-0">
                    Ask AI <ArrowRight size={11} />
                  </div>
                </div>
              </Link>
            )}

            {/* Trending strip */}
            <TrendingStrip assets={trending} />

            {/* Search + controls */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted2" />
                <input
                  placeholder="Search launches..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-card border border-border rounded-btn pl-9 pr-3 py-2.5 text-sm text-offwhite placeholder:text-muted2 focus:border-accent focus:outline-none transition-colors"
                />
              </div>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="bg-card border border-border rounded-btn px-3 py-2.5 text-sm text-offwhite appearance-none pr-7 focus:border-accent focus:outline-none cursor-pointer"
                >
                  {SORT_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                </select>
                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
              </div>
              <div className="flex items-center gap-1 border border-border rounded-btn overflow-hidden">
                {(["grid", "list"] as const).map((v) => (
                  <button key={v} onClick={() => setView(v)}
                    className={cn("p-2 transition-colors", view === v ? "bg-accent/15 text-accent" : "text-muted hover:text-offwhite")}>
                    {v === "grid" ? <LayoutGrid size={15} /> : <List size={15} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Chain filter row — visible on ALL screen sizes */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-3 scrollbar-none">
              {CHAIN_FILTERS.map((c) => {
                const active = chainFilter === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setChainFilter(c.id)}
                    className={cn(
                      "shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all whitespace-nowrap",
                      active ? "" : "bg-card border-border text-muted hover:text-offwhite hover:border-white/20"
                    )}
                    style={active ? { background: c.bg, borderColor: c.border, color: c.color } : undefined}
                  >
                    {c.logo && (
                      <img src={c.logo} alt={c.label} width={12} height={12} style={{ width: 12, height: 12, objectFit: "contain" }} />
                    )}
                    {c.label}
                    {active && c.id !== "all" && (
                      <span className="ml-0.5 text-[9px] opacity-70">
                        ({MOCK_ASSETS.filter(a => a.chain === c.id).length})
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Filter chips */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-6 flex-wrap">
              {FILTERS.map(({ value, label, icon: Icon }) => (
                <button key={value} onClick={() => setFilter(value)}
                  className={cn("shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                    filter === value ? "bg-accent/15 border-accent text-accent" : "bg-card border-border text-muted hover:text-offwhite hover:border-accent/30"
                  )}>
                  {Icon && <Icon size={10} />}
                  {label}
                </button>
              ))}
              <span className="border-l border-border mx-1" />
              {RISK_CHIPS.map((r) => (
                <button key={r} onClick={() => setRisk(r)}
                  className={cn("shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                    risk === r ? "bg-accent/15 border-accent text-accent" : "bg-card border-border text-muted hover:text-offwhite hover:border-accent/30"
                  )}>
                  {r}
                </button>
              ))}
              <span className="border-l border-border mx-1" />
              {YIELD_CHIPS.map((y) => (
                <button key={y} onClick={() => setYield(y)}
                  className={cn("shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                    yieldFilter === y ? "bg-accent/15 border-accent text-accent" : "bg-card border-border text-muted hover:text-offwhite hover:border-accent/30"
                  )}>
                  {y}
                </button>
              ))}
            </div>

            {/* Count */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-muted">{filtered.length} launch{filtered.length !== 1 ? "es" : ""}</span>
              {!IS_LOGGED_IN && (
                <div className="flex items-center gap-2 text-xs text-muted bg-card border border-border rounded-full px-3 py-1.5">
                  <Lock size={11} />
                  <span>
                    <button onClick={() => setGateFeature("view your portfolio")} className="text-accent hover:underline">Sign up free</button>
                    {" "}to track your positions & earn yield
                  </span>
                </div>
              )}
            </div>

            {/* Grid */}
            {view === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((asset) => (
                  <LaunchCard key={asset.id} asset={asset} onGate={setGateFeature} isLoggedIn={IS_LOGGED_IN} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-4 py-2 text-[10px] uppercase tracking-widest text-muted border-b border-border">
                  <span>Launch</span><span>Category</span><span>APY</span><span>Filled</span><span>Risk</span><span />
                </div>
                {filtered.map((asset) => {
                  const pct = (asset.raisedAmount / asset.raiseTarget) * 100;
                  return (
                    <Link key={asset.id} href={`/asset/${asset.id}`}>
                      <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 items-center px-4 py-3 bg-card border border-border rounded-xl hover:border-accent transition-colors cursor-pointer">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg overflow-hidden relative shrink-0">
                            <Image src={asset.image} alt={asset.name} fill className="object-cover" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-white truncate font-syne">{asset.name}</p>
                            <p className="flex items-center gap-1 text-[10px] text-muted"><MapPin size={9} className="shrink-0" />{asset.location}</p>
                          </div>
                        </div>
                        <span className="text-xs text-muted truncate">{CATEGORY_LABELS[asset.category]}</span>
                        <span className="text-sm font-black text-accent2 font-mono">{asset.annualYieldPercent}%</span>
                        <div>
                          <ProgressBar value={pct} height={4} />
                          <span className="text-[10px] text-muted font-mono">{pct.toFixed(0)}%</span>
                        </div>
                        <RiskPips score={asset.riskScore} />
                        <button
                          onClick={(e) => { e.preventDefault(); if (!IS_LOGGED_IN) setGateFeature("buy into this launch"); else window.location.href = `/asset/${asset.id}`; }}
                          className="bg-accent hover:bg-[#7B6CF0] text-white text-xs font-bold px-3 py-1.5 rounded-btn transition-all"
                        >
                          Get In
                        </button>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </main>

          <RightRail />
        </div>
      </div>

      {gateFeature && (
        <GateModal feature={gateFeature} onClose={() => setGateFeature(null)} />
      )}
    </div>
  );
}
