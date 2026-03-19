"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, LayoutGrid, List, ChevronDown, MapPin } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import AssetCard from "@/components/asset/AssetCard";
import { SkeletonCard } from "@/components/ui/Skeleton";
import ProgressBar from "@/components/ui/ProgressBar";
import Button from "@/components/ui/Button";
import RiskPips from "@/components/ui/RiskPips";
import CategoryIcon from "@/components/ui/CategoryIcon";
import { MOCK_ASSETS, CATEGORY_LABELS } from "@/lib/mock-data";
import type { Asset } from "@/types";
import { formatUSD, formatNumber, countdown } from "@/lib/utils";
import { cn } from "@/lib/utils";
import Link from "next/link";

const CATEGORIES = [
  "All",
  "Real Estate",
  "Infrastructure",
  "Business Yield",
  "Commodities",
  "Pre-Revenue",
];

const RISK_FILTERS = ["All Risk", "Low (1-4)", "Medium (5-6)", "High (7-10)"];
const STATUS_FILTERS = ["All Status", "Live", "Upcoming", "Raise Complete"];
const YIELD_FILTERS = ["All Yields", "0-5%", "5-10%", "10-15%", "15%+"];
const SORT_OPTIONS = ["Most Recent", "Highest Yield", "Lowest Risk", "Most Raised"];

export default function DiscoverPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [riskFilter, setRiskFilter] = useState("All Risk");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [yieldFilter, setYieldFilter] = useState("All Yields");
  const [sort, setSort] = useState("Most Recent");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const PER_PAGE = 12;

  const filtered = useMemo(() => {
    let assets = [...MOCK_ASSETS];

    if (search) {
      assets = assets.filter(
        (a) =>
          a.name.toLowerCase().includes(search.toLowerCase()) ||
          a.location.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== "All") {
      assets = assets.filter((a) => {
        if (category === "Real Estate") return a.category.startsWith("real-estate");
        if (category === "Infrastructure") return a.category.startsWith("infrastructure");
        if (category === "Business Yield") return a.category === "business-yield";
        if (category === "Commodities") return a.category === "commodities";
        if (category === "Pre-Revenue") return a.category === "pre-revenue";
        return true;
      });
    }

    if (riskFilter !== "All Risk") {
      assets = assets.filter((a) => {
        if (riskFilter === "Low (1-4)") return a.riskScore <= 4;
        if (riskFilter === "Medium (5-6)") return a.riskScore >= 5 && a.riskScore <= 6;
        if (riskFilter === "High (7-10)") return a.riskScore >= 7;
        return true;
      });
    }

    if (statusFilter !== "All Status") {
      assets = assets.filter((a) => {
        if (statusFilter === "Live") return a.status === "live";
        if (statusFilter === "Upcoming") return a.status === "upcoming";
        if (statusFilter === "Raise Complete") return a.status === "raise_complete";
        return true;
      });
    }

    if (yieldFilter !== "All Yields") {
      assets = assets.filter((a) => {
        if (yieldFilter === "0-5%") return a.annualYieldPercent < 5;
        if (yieldFilter === "5-10%") return a.annualYieldPercent >= 5 && a.annualYieldPercent < 10;
        if (yieldFilter === "10-15%") return a.annualYieldPercent >= 10 && a.annualYieldPercent < 15;
        if (yieldFilter === "15%+") return a.annualYieldPercent >= 15;
        return true;
      });
    }

    if (sort === "Highest Yield") assets.sort((a, b) => b.annualYieldPercent - a.annualYieldPercent);
    if (sort === "Lowest Risk") assets.sort((a, b) => a.riskScore - b.riskScore);
    if (sort === "Most Raised") assets.sort((a, b) => b.raisedAmount - a.raisedAmount);

    return assets;
  }, [search, category, riskFilter, statusFilter, yieldFilter, sort]);

  const paginated = filtered.slice(0, page * PER_PAGE);
  const hasMore = paginated.length < filtered.length;

  return (
    <AppShell>
      <div>
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-syne font-black text-3xl text-white mb-1">Discover Assets</h1>
          <p className="text-sm text-muted">
            {filtered.length} verified asset{filtered.length !== 1 ? "s" : ""} available
          </p>
        </div>

        {/* Search + controls */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted2" />
            <input
              placeholder="Search by name or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-card border border-border rounded-btn pl-9 pr-3 py-2.5 text-sm text-offwhite placeholder:text-muted2 focus:border-accent focus:outline-none transition-colors"
            />
          </div>
          <SelectFilter value={sort} options={SORT_OPTIONS} onChange={setSort} />
          <div className="flex items-center gap-1 border border-border rounded-btn overflow-hidden">
            <button
              onClick={() => setView("grid")}
              className={cn("p-2 transition-colors", view === "grid" ? "bg-accent/15 text-accent" : "text-muted hover:text-offwhite")}
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setView("list")}
              className={cn("p-2 transition-colors", view === "list" ? "bg-accent/15 text-accent" : "text-muted hover:text-offwhite")}
            >
              <List size={15} />
            </button>
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 flex-wrap">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                "shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                category === c
                  ? "bg-accent/15 border-accent text-accent"
                  : "bg-card border-border text-muted hover:text-offwhite hover:border-accent/30"
              )}
            >
              {c}
            </button>
          ))}
          <div className="border-l border-border mx-1" />
          {RISK_FILTERS.map((r) => (
            <button
              key={r}
              onClick={() => setRiskFilter(r)}
              className={cn(
                "shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                riskFilter === r
                  ? "bg-accent/15 border-accent text-accent"
                  : "bg-card border-border text-muted hover:text-offwhite hover:border-accent/30"
              )}
            >
              {r}
            </button>
          ))}
          <div className="border-l border-border mx-1" />
          {YIELD_FILTERS.map((y) => (
            <button
              key={y}
              onClick={() => setYieldFilter(y)}
              className={cn(
                "shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                yieldFilter === y
                  ? "bg-accent/15 border-accent text-accent"
                  : "bg-card border-border text-muted hover:text-offwhite hover:border-accent/30"
              )}
            >
              {y}
            </button>
          ))}
        </div>

        {/* Grid / List view */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted">
            <p className="text-lg font-syne text-white mb-2">No assets found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginated.map((asset) => (
              <AssetCard key={asset.id} asset={asset} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-4 py-2 text-[10px] uppercase tracking-widest text-muted border-b border-border">
              <span>Asset</span>
              <span>Category</span>
              <span>APY</span>
              <span>Raised</span>
              <span>Risk</span>
              <span />
            </div>
            {paginated.map((asset) => (
              <ListRow key={asset.id} asset={asset} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {hasMore && (
          <div className="text-center mt-8">
            <Button variant="secondary" onClick={() => setPage((p) => p + 1)}>
              Load More ({filtered.length - paginated.length} remaining)
            </Button>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function SelectFilter({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-card border border-border rounded-btn px-3 py-2.5 text-sm text-offwhite appearance-none pr-7 focus:border-accent focus:outline-none cursor-pointer"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
    </div>
  );
}

function ListRow({ asset }: { asset: Asset }) {
  const raisedPercent = (asset.raisedAmount / asset.raiseTarget) * 100;
  return (
    <Link href={`/asset/${asset.id}`}>
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 items-center px-4 py-3 bg-card border border-border rounded-xl hover:border-accent transition-colors cursor-pointer">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-card2 border border-border flex items-center justify-center text-muted shrink-0">
            <CategoryIcon category={asset.category} size={14} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate font-syne">{asset.name}</p>
            <p className="flex items-center gap-1 text-[10px] text-muted truncate"><MapPin size={9} className="shrink-0" />{asset.location}</p>
          </div>
        </div>
        <span className="text-xs text-muted truncate">{CATEGORY_LABELS[asset.category]}</span>
        <span className="text-sm font-bold text-accent2 font-mono">{asset.annualYieldPercent}%</span>
        <div className="min-w-0">
          <ProgressBar value={raisedPercent} height={4} />
          <span className="text-[10px] text-muted font-mono">{raisedPercent.toFixed(0)}%</span>
        </div>
        <RiskPips score={asset.riskScore} />
        <Button variant="outline" size="sm">View</Button>
      </div>
    </Link>
  );
}
