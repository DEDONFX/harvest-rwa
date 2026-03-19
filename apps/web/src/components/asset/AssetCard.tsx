"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, Users, TrendingUp, MapPin } from "lucide-react";
import ProgressBar from "@/components/ui/ProgressBar";
import Badge from "@/components/ui/Badge";
import RiskPips from "@/components/ui/RiskPips";
import CategoryIcon from "@/components/ui/CategoryIcon";
import type { Asset } from "@/types";
import { formatUSD, formatNumber, countdown } from "@/lib/utils";
import { CATEGORY_LABELS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface AssetCardProps {
  asset: Asset;
  compact?: boolean;
}

export default function AssetCard({ asset, compact = false }: AssetCardProps) {
  const raisedPercent = (asset.raisedAmount / asset.raiseTarget) * 100;
  const closeDate = new Date(asset.closeDate);
  const isLive = asset.status === "live";
  const isUpcoming = asset.status === "upcoming";
  const isComplete = asset.status === "raise_complete";

  return (
    <Link href={`/asset/${asset.id}`} className="block">
      <div className="bg-card border border-border rounded-card overflow-hidden card-hover group">
        {/* Image */}
        <div className="relative overflow-hidden" style={{ height: compact ? 80 : 120 }}>
          <Image
            src={asset.image}
            alt={asset.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.06]"
            loading="lazy"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />

          {/* Status badge */}
          <div className="absolute top-2 left-2 flex gap-1.5">
            {isLive && (
              <span className="flex items-center gap-1 bg-green/15 border border-green/30 text-green text-[9px] font-bold tracking-widest uppercase rounded-full px-2 py-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
                LIVE
              </span>
            )}
            {isUpcoming && (
              <span className="bg-gold/15 border border-gold/30 text-gold text-[9px] font-bold tracking-widest uppercase rounded-full px-2 py-0.5">
                UPCOMING
              </span>
            )}
            {isComplete && (
              <span className="bg-accent/15 border border-accent/30 text-accent text-[9px] font-bold tracking-widest uppercase rounded-full px-2 py-0.5">
                SUBSCRIBED
              </span>
            )}
            {asset.assetType === "pre_revenue" && (
              <span className="bg-red/15 border border-red/30 text-red text-[9px] font-bold tracking-widest uppercase rounded-full px-2 py-0.5">
                PRE-REV
              </span>
            )}
          </div>

          {/* Category icon */}
          <div className="absolute bottom-2 right-2 w-6 h-6 rounded-md bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/80">
            <CategoryIcon category={asset.category} size={13} />
          </div>
        </div>

        {/* Content */}
        <div className={cn("p-4 flex flex-col gap-2.5", compact && "p-3 gap-2")}>
          {/* Category + location */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted uppercase tracking-wide font-dm">
              {CATEGORY_LABELS[asset.category]}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-muted">
              <MapPin size={9} className="shrink-0" /> {asset.country}
            </span>
          </div>

          {/* Name */}
          <h3 className="text-sm font-bold text-white font-syne leading-tight line-clamp-2">
            {asset.name}
          </h3>

          {/* Yield + Risk */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] text-muted uppercase tracking-wide block">Annual Yield</span>
              <span className="text-xl font-bold text-accent2 font-mono leading-tight">
                {asset.annualYieldPercent.toFixed(1)}%
              </span>
            </div>
            <RiskPips score={asset.riskScore} />
          </div>

          {/* Progress */}
          {(isLive || isComplete) && (
            <div className="space-y-1.5">
              <ProgressBar value={raisedPercent} height={5} />
              <div className="flex items-center justify-between text-[10px] text-muted">
                <span className="font-mono">
                  {formatUSD(asset.raisedAmount, 0)} raised
                </span>
                <span className="font-mono">{raisedPercent.toFixed(0)}%</span>
              </div>
            </div>
          )}

          {/* Footer stats */}
          <div className="flex items-center justify-between pt-1 border-t border-border/50">
            <div className="flex items-center gap-3 text-[10px] text-muted">
              <span className="flex items-center gap-1">
                <Users size={10} />
                {formatNumber(asset.investorCount)}
              </span>
              <span className="flex items-center gap-1 font-mono">
                Min {formatUSD(asset.minInvestment, 0)}
              </span>
            </div>
            {isLive && (
              <span className="flex items-center gap-1 text-[10px] text-gold font-mono">
                <Clock size={10} />
                {countdown(closeDate)}
              </span>
            )}
            {isUpcoming && (
              <span className="text-[10px] text-gold font-mono">
                Starts {countdown(new Date(asset.launchDate))}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
