"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Users, TrendingUp, ChevronRight, Plus, Minus, CheckCircle, DollarSign, Target, MapPin } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import ProgressBar from "@/components/ui/ProgressBar";
import Button from "@/components/ui/Button";
import RiskPips from "@/components/ui/RiskPips";
import TrendingCard from "@/components/asset/TrendingCard";
import { MOCK_ASSETS, MOCK_FEED_ITEMS, CATEGORY_LABELS } from "@/lib/mock-data";
import type { FeedItem, Asset } from "@/types";
import { formatUSD, formatNumber, countdown, timeAgo } from "@/lib/utils";
import { cn } from "@/lib/utils";

const FILTERS = ["All", "Live Now", "Ending Soon", "Just Distributed", "Real Estate", "Infrastructure", "Business Yield"];

type InvestState = "idle" | "investing" | "success";

function InlineInvestPanel({
  asset,
  onClose,
}: {
  asset: Asset;
  onClose: () => void;
}) {
  const [amount, setAmount] = useState(10);
  const [state, setState] = useState<InvestState>("idle");

  const tokens = amount / asset.pricePerToken;
  const monthlyYield = (amount * (asset.annualYieldPercent / 100)) / 12;

  const handleInvest = () => {
    setState("investing");
    setTimeout(() => setState("success"), 1800);
  };

  if (state === "success") {
    return (
      <div className="border-t border-border bg-green/5 p-4 flex flex-col items-center gap-2 text-center animate-fade-in">
        <CheckCircle className="text-green" size={24} />
        <p className="text-sm font-bold text-white">Investment Confirmed!</p>
        <p className="text-xs text-muted">
          {tokens.toFixed(0)} tokens added to your portfolio
        </p>
        <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
      </div>
    );
  }

  return (
    <div className="border-t border-border bg-card/50 p-4 animate-slide-up">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-muted uppercase tracking-wide">Invest</span>
        <button onClick={onClose} className="text-muted hover:text-offwhite">
          <Minus size={14} />
        </button>
      </div>

      {/* Quick amounts */}
      <div className="flex gap-2 mb-3">
        {[1, 10, 50, 100].map((preset) => (
          <button
            key={preset}
            onClick={() => setAmount(preset)}
            className={cn(
              "flex-1 py-1.5 rounded-lg text-xs font-mono font-medium border transition-all",
              amount === preset
                ? "bg-accent/15 border-accent text-accent"
                : "bg-card border-border text-muted hover:border-accent/40"
            )}
          >
            ${preset}
          </button>
        ))}
      </div>

      {/* Custom amount */}
      <div className="relative mb-3">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">$</span>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full bg-card border border-border rounded-btn pl-7 pr-3 py-2 text-sm font-mono text-offwhite focus:border-accent focus:outline-none"
          min={1}
        />
      </div>

      {/* Live calc */}
      <div className="bg-card2 rounded-xl p-3 mb-3 grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-muted block">Tokens</span>
          <span className="font-mono text-offwhite font-medium">{tokens.toFixed(0)}</span>
        </div>
        <div>
          <span className="text-muted block">Est. monthly yield</span>
          <span className="font-mono text-green font-medium">{formatUSD(monthlyYield)}</span>
        </div>
      </div>

      <Button
        variant="primary"
        size="sm"
        fullWidth
        loading={state === "investing"}
        onClick={handleInvest}
        disabled={amount < 1}
      >
        Confirm Investment
      </Button>
    </div>
  );
}

function FeedCard({ item, asset }: { item: FeedItem; asset: Asset | undefined }) {
  const [investing, setInvesting] = useState(false);

  if (!asset) return null;
  const raisedPercent = (asset.raisedAmount / asset.raiseTarget) * 100;

  if (item.eventType === "YIELD_DISTRIBUTED") {
    return (
      <div className="bg-card border border-border rounded-card overflow-hidden animate-fade-in">
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-widest uppercase text-accent2">
                <DollarSign size={9} className="inline mr-0.5" />YIELD DISTRIBUTED
              </span>
            </div>
            <span className="text-xs text-muted">{timeAgo(item.createdAt)}</span>
          </div>
          <p className="text-base font-bold text-white font-syne mb-1">{asset.name}</p>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-accent2 font-mono font-bold">
              {formatUSD(Number(item.metadata.totalYield))} distributed
            </span>
            <span className="text-muted">
              to {formatNumber(Number(item.metadata.holderCount))} holders
            </span>
          </div>
          <div className="mt-2 text-xs text-muted">
            Per token: <span className="text-offwhite font-mono">${item.metadata.perToken}</span>
            {" · "}Annual rate:{" "}
            <span className="text-green font-mono">{asset.annualYieldPercent}% APY</span>
          </div>
        </div>
        <div className="px-5 pb-4">
          <Link href={`/asset/${asset.id}`}>
            <Button variant="outline" size="sm">View Asset</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (item.eventType === "INVESTMENT_MADE" || item.eventType === "RAISE_MILESTONE") {
    return (
      <div className="bg-card border border-border rounded-card p-4 animate-fade-in flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 relative">
          <Image src={asset.image} alt={asset.name} fill className="object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={cn(
              "text-[9px] font-bold tracking-widest uppercase",
              item.eventType === "INVESTMENT_MADE" ? "text-green" : "text-gold"
            )}>
              {item.eventType === "INVESTMENT_MADE"
                ? <><DollarSign size={9} className="inline mr-0.5" />INVESTED</>
                : <><Target size={9} className="inline mr-0.5" />MILESTONE</>}
            </span>
            <span className="text-[10px] text-muted">{timeAgo(item.createdAt)}</span>
          </div>
          <p className="text-sm font-medium text-offwhite truncate">
            {item.eventType === "INVESTMENT_MADE"
              ? `Someone invested ${formatUSD(Number(item.metadata.amount))} in ${asset.name}`
              : `${asset.name} hit ${item.metadata.milestone}% subscribed`}
          </p>
          <ProgressBar value={raisedPercent} height={3} className="mt-1.5" />
        </div>
      </div>
    );
  }

  // ASSET_LIVE — full card
  return (
    <div className="bg-card border border-border rounded-card overflow-hidden animate-fade-in">
      {/* Image hero */}
      <div className="relative h-32 overflow-hidden">
        <Image src={asset.image} alt={asset.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="flex items-center gap-1 bg-green/15 border border-green/30 text-green text-[9px] font-bold tracking-widest uppercase rounded-full px-2 py-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
            JUST LAUNCHED
          </span>
          <span className="text-[10px] text-muted/80">{timeAgo(item.createdAt)}</span>
        </div>
      </div>

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex items-center gap-1 text-[10px] text-muted"><MapPin size={9} className="shrink-0" />{CATEGORY_LABELS[asset.category]}</span>
            </div>
            <h3 className="text-base font-bold text-white font-syne">{asset.name}</h3>
          </div>
          <RiskPips score={asset.riskScore} />
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 mb-3">
          <div>
            <span className="text-[10px] text-muted block">Annual Yield</span>
            <span className="text-2xl font-bold text-accent2 font-mono">{asset.annualYieldPercent}%</span>
          </div>
          <div>
            <span className="text-[10px] text-muted block">Raised</span>
            <span className="text-sm font-mono text-offwhite">{((asset.raisedAmount / asset.raiseTarget) * 100).toFixed(0)}%</span>
          </div>
          <div>
            <span className="text-[10px] text-muted block">Closes in</span>
            <span className="text-sm font-mono text-gold">{countdown(new Date(asset.closeDate))}</span>
          </div>
          <div>
            <span className="text-[10px] text-muted block">Min invest</span>
            <span className="text-sm font-mono text-offwhite">${asset.minInvestment}</span>
          </div>
        </div>

        {/* AI summary */}
        <p className="text-xs text-muted leading-relaxed mb-3 italic border-l-2 border-gold/30 pl-3">
          "{asset.ddReport.executiveSummary.slice(0, 140)}..."
        </p>

        <ProgressBar value={raisedPercent} showLabel />

        <div className="flex items-center gap-2 mt-4">
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <Users size={11} />
            {formatNumber(asset.investorCount)} investors
          </div>
          <div className="ml-auto flex gap-2">
            <Link href={`/asset/${asset.id}`}>
              <Button variant="secondary" size="sm">View Details</Button>
            </Link>
            {!investing ? (
              <Button variant="primary" size="sm" onClick={() => setInvesting(true)}>
                <Plus size={12} />
                Invest from $1
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      {investing && (
        <InlineInvestPanel asset={asset} onClose={() => setInvesting(false)} />
      )}
    </div>
  );
}

export default function FeedPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [feedItems, setFeedItems] = useState(MOCK_FEED_ITEMS);

  const trendingAssets = MOCK_ASSETS.filter((a) => a.trending).slice(0, 4);

  // Simulate new feed items appearing
  useEffect(() => {
    const newEvents: FeedItem[] = [
      {
        id: `feed-${Date.now()}`,
        eventType: "INVESTMENT_MADE",
        assetId: "asset-004",
        assetName: "Dubai Logistics Hub",
        metadata: { amount: 200, raisedPercent: 30 },
        createdAt: new Date(),
      },
      {
        id: `feed-${Date.now() + 1}`,
        eventType: "INVESTMENT_MADE",
        assetId: "asset-006",
        assetName: "Manila Data Centre",
        metadata: { amount: 150, raisedPercent: 65 },
        createdAt: new Date(),
      },
    ];

    let i = 0;
    const timer = setInterval(() => {
      const item = { ...newEvents[i % newEvents.length], id: `feed-${Date.now()}`, createdAt: new Date() };
      setFeedItems((prev) => [item, ...prev.slice(0, 19)]);
      i++;
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const getAsset = (id: string) => MOCK_ASSETS.find((a) => a.id === id);

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto">
        {/* Trending strip */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={14} className="text-gold" />
            <h2 className="text-xs font-medium uppercase tracking-widest text-muted">Trending Now</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {trendingAssets.map((asset, i) => (
              <TrendingCard key={asset.id} asset={asset} rank={i + 1} />
            ))}
          </div>
        </section>

        {/* Filter bar */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                activeFilter === filter
                  ? "bg-accent/15 border-accent text-accent"
                  : "bg-card border-border text-muted hover:text-offwhite hover:border-accent/30"
              )}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Feed */}
        <div className="flex flex-col gap-4">
          {feedItems.map((item) => {
            const asset = getAsset(item.assetId);
            return <FeedCard key={item.id} item={item} asset={asset} />;
          })}
        </div>
      </div>
    </AppShell>
  );
}
