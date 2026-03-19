"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  Shield, AlertTriangle, CheckCircle, ChevronDown, ChevronUp,
  Users, Clock, TrendingUp, Sparkles, Send, Plus, Info, ExternalLink, MapPin,
} from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import RiskPips, { getRiskBadgeClass } from "@/components/ui/RiskPips";
import Badge from "@/components/ui/Badge";
import { MOCK_ASSETS } from "@/lib/mock-data";
import { formatUSD, formatNumber, countdown } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Risk } from "@/types";
import ChainBadge from "@/components/ui/ChainBadge";

const SEVERITY_CONFIG = {
  low: { color: "text-green", bg: "bg-[rgba(0,200,150,0.1)]", icon: CheckCircle },
  medium: { color: "text-gold", bg: "bg-[rgba(249,168,37,0.1)]", icon: AlertTriangle },
  high: { color: "text-red", bg: "bg-[rgba(255,71,87,0.1)]", icon: AlertTriangle },
};

function RiskItem({ risk }: { risk: Risk }) {
  const [open, setOpen] = useState(false);
  const cfg = SEVERITY_CONFIG[risk.severity];
  const Icon = cfg.icon;

  return (
    <button
      onClick={() => setOpen(!open)}
      className={cn(
        "w-full text-left rounded-xl border border-border p-4 transition-all",
        open ? "border-accent/30 bg-accent/5" : "hover:border-border"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon size={14} className={cfg.color} />
          <span className="text-sm font-medium text-offwhite">{risk.name}</span>
          <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium uppercase", cfg.color, cfg.bg)}>
            {risk.severity}
          </span>
        </div>
        {open ? <ChevronUp size={14} className="text-muted" /> : <ChevronDown size={14} className="text-muted" />}
      </div>
      {open && (
        <p className="mt-3 text-sm text-muted leading-relaxed animate-fade-in pl-5">
          {risk.description}
        </p>
      )}
    </button>
  );
}

function AIAdvisorPanel({ assetName }: { assetName: string }) {
  const [messages, setMessages] = useState<{ role: "ai" | "user"; text: string }[]>([
    {
      role: "ai",
      text: `I've analysed ${assetName} for you. What would you like to know? Ask me anything about the yield mechanism, risks, or how it compares to similar assets.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const SUGGESTIONS = [
    "What are the main risks?",
    "How is yield calculated?",
    "Is this suitable for me?",
    "How does it compare to similar assets?",
  ];

  const MOCK_RESPONSES: Record<string, string> = {
    "What are the main risks?": "The primary risks for this asset are clearly documented in the DD report. Based on the risk score and asset type, the main concerns are market-specific factors like vacancy rates for real estate or revenue concentration. I recommend reviewing each risk item in detail before investing.",
    "How is yield calculated?": "Yield is calculated as net revenue after all operating costs are deducted. The originator submits verified financial statements each distribution period. The platform AI cross-checks the figures before any distribution is triggered.",
    "Is this suitable for me?": "Based on your investor profile (balanced risk appetite, medium hold duration), this asset aligns well with your goals. The risk score and yield range fall within your stated preferences.",
    "How does it compare to similar assets?": "Compared to similar assets on the platform, this offers competitive yield relative to its risk level. The originator's track record and physical verification add confidence to the underwriting.",
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const response = MOCK_RESPONSES[text] || "That's a great question. Based on the due diligence report and comparable assets on the platform, this asset appears to be well-structured with verified revenue streams. Always review the full DD report and make investment decisions based on your own assessment. This is AI-generated context, not financial advice.";
      setMessages((prev) => [...prev, { role: "ai", text: response }]);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="bg-card border border-border rounded-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center gap-2">
        <Sparkles size={14} className="text-gold" />
        <span className="text-sm font-medium text-white">AI Advisor</span>
        <span className="ml-auto text-[10px] text-muted border border-border rounded-full px-2 py-0.5">
          10 free / day
        </span>
      </div>

      <div className="p-4 flex flex-col gap-3 min-h-[200px] max-h-[300px] overflow-y-auto">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              "text-sm leading-relaxed max-w-[85%]",
              msg.role === "ai"
                ? "border-l-2 border-gold/50 pl-3 text-muted self-start"
                : "bg-accent/10 border border-accent/20 rounded-xl px-3 py-2 text-offwhite self-end"
            )}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="border-l-2 border-gold/50 pl-3 self-start">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <span key={i} className="w-1.5 h-1.5 rounded-full bg-gold/60 animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Suggestion chips */}
      <div className="px-4 flex gap-2 overflow-x-auto pb-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => handleSend(s)}
            className="shrink-0 text-[11px] px-2.5 py-1.5 bg-card2 border border-border rounded-full text-muted hover:text-offwhite hover:border-accent/30 transition-colors"
          >
            {s}
          </button>
        ))}
      </div>

      <div className="px-4 pb-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
          placeholder="Ask anything about this asset..."
          className="flex-1 bg-card2 border border-border rounded-btn px-3 py-2 text-sm text-offwhite placeholder:text-muted2 focus:border-accent focus:outline-none"
        />
        <Button variant="primary" size="sm" onClick={() => handleSend(input)} disabled={!input.trim()}>
          <Send size={12} />
        </Button>
      </div>

      <p className="px-4 pb-3 text-[10px] text-muted/60 italic">
        AI-generated context only. Not financial advice. Always do your own research.
      </p>
    </div>
  );
}

function InvestWidget({ asset }: { asset: (typeof MOCK_ASSETS)[0] }) {
  const [amount, setAmount] = useState(100);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const raisedPercent = (asset.raisedAmount / asset.raiseTarget) * 100;
  const tokens = amount / asset.pricePerToken;
  const ownership = (tokens / asset.totalSupply) * 100;
  const monthlyYield = (amount * (asset.annualYieldPercent / 100)) / 12;
  const annualYield = amount * (asset.annualYieldPercent / 100);

  const handleInvest = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1800);
  };

  if (success) {
    return (
      <div className="bg-card border border-border rounded-card p-6 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-green/15 border border-green/30 flex items-center justify-center mx-auto">
          <CheckCircle className="text-green" size={24} />
        </div>
        <div>
          <p className="font-syne font-bold text-white text-lg mb-1">Investment Confirmed!</p>
          <p className="text-sm text-muted">
            {tokens.toFixed(0)} {asset.symbol} tokens added to your portfolio.
          </p>
        </div>
        <div className="bg-card2 rounded-xl p-3 text-sm">
          <div className="flex justify-between mb-1">
            <span className="text-muted">Next payout</span>
            <span className="font-mono text-offwhite">
              {new Date(asset.nextPayout).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Est. monthly</span>
            <span className="font-mono text-green">{formatUSD(monthlyYield)}</span>
          </div>
        </div>
        <Button variant="secondary" size="sm" fullWidth onClick={() => setSuccess(false)}>
          Invest More
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-card p-5 space-y-4 sticky top-[100px]">
      {/* Raise progress */}
      <div>
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-muted font-mono">{formatUSD(asset.raisedAmount, 0)} raised</span>
          <span className="text-gold font-mono">{raisedPercent.toFixed(0)}% of {formatUSD(asset.raiseTarget, 0)}</span>
        </div>
        <ProgressBar value={raisedPercent} showLabel={false} />
        <div className="flex items-center justify-between text-xs mt-2 text-muted">
          <span className="flex items-center gap-1">
            <Users size={10} />
            {formatNumber(asset.investorCount)} investors
          </span>
          {asset.status === "live" && (
            <span className="flex items-center gap-1 text-gold font-mono">
              <Clock size={10} />
              {countdown(new Date(asset.closeDate))} left
            </span>
          )}
        </div>
      </div>

      <div className="border-t border-border" />

      {/* Amount input */}
      <div>
        <label className="text-xs text-muted uppercase tracking-wide block mb-2">Investment Amount</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">$</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Math.max(1, Number(e.target.value)))}
            className="w-full bg-card2 border border-border rounded-btn pl-7 pr-3 py-3 text-base font-mono text-offwhite focus:border-accent focus:outline-none"
            min={1}
          />
        </div>
        <div className="flex gap-2 mt-2">
          {[1, 10, 50, 100].map((preset) => (
            <button
              key={preset}
              onClick={() => setAmount(preset)}
              className={cn(
                "flex-1 py-1.5 rounded-lg text-xs font-mono border transition-all",
                amount === preset
                  ? "bg-accent/15 border-accent text-accent"
                  : "bg-card border-border text-muted hover:border-accent/40 hover:text-offwhite"
              )}
            >
              ${preset}
            </button>
          ))}
        </div>
      </div>

      {/* Live calculator */}
      <div className="bg-card2 rounded-xl p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted">Tokens received</span>
          <span className="font-mono text-offwhite font-medium">{tokens.toLocaleString(undefined, { maximumFractionDigits: 0 })} {asset.symbol}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted">Ownership %</span>
          <span className="font-mono text-offwhite">{ownership.toFixed(4)}%</span>
        </div>
        <div className="border-t border-border/50 pt-2 mt-2" />
        <div className="flex justify-between text-sm">
          <span className="text-muted">Est. monthly yield</span>
          <span className="font-mono text-green font-medium">{formatUSD(monthlyYield)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted">Est. annual yield</span>
          <span className="font-mono text-green font-bold">{formatUSD(annualYield)}</span>
        </div>
      </div>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        loading={loading}
        onClick={handleInvest}
        disabled={amount < 1 || asset.status !== "live"}
      >
        {asset.status === "upcoming" ? "Launching Soon" : asset.status === "raise_complete" ? "Raise Complete" : "Invest Now →"}
      </Button>

      <p className="text-[10px] text-muted text-center">
        Gas fees: <span className="text-offwhite">$0.00</span> (absorbed) · Min: $1 · No KYC required
      </p>
    </div>
  );
}

export default function AssetDetailPage() {
  const params = useParams();
  const asset = MOCK_ASSETS.find((a) => a.id === params.id);
  const [ddSection, setDdSection] = useState<string | null>("summary");

  if (!asset) {
    return (
      <AppShell>
        <div className="text-center py-20">
          <p className="text-muted">Asset not found</p>
        </div>
      </AppShell>
    );
  }

  const { ddReport } = asset;
  const raisedPercent = (asset.raisedAmount / asset.raiseTarget) * 100;

  const DD_SECTIONS = [
    { key: "summary", label: "Summary", content: ddReport.executiveSummary },
    { key: "yield", label: "Yield Mechanism", content: ddReport.yieldMechanism },
    { key: "costs", label: "Cost Breakdown", content: ddReport.operatingCostBreakdown },
    { key: "originator", label: "Originator", content: ddReport.originatorSummary },
  ];

  return (
    <AppShell showRightRail={false}>
      <div className="max-w-5xl mx-auto">
        {/* Hero */}
        <div className="relative h-56 rounded-2xl overflow-hidden mb-6">
          <Image src={asset.image} alt={asset.name} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <ChainBadge chain={asset.chain} size="md" />
                  <span className="flex items-center gap-1 text-[10px] text-muted"><MapPin size={9} className="shrink-0" />{asset.location}</span>
                  <span className="text-muted">·</span>
                  <span className="text-[10px] text-muted">{asset.symbol}</span>
                  {asset.status === "live" && (
                    <span className="flex items-center gap-1 bg-green/15 border border-green/30 text-green text-[9px] font-bold tracking-widest uppercase rounded-full px-2 py-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" /> LIVE
                    </span>
                  )}
                </div>
                <h1 className="font-syne font-black text-3xl text-white">{asset.name}</h1>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-muted mb-1">Annual Yield</div>
                <div className="text-4xl font-black font-mono text-accent2">{asset.annualYieldPercent}%</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Left: Content */}
          <div className="space-y-6">
            {/* Quick stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Raise Target", value: formatUSD(asset.raiseTarget, 0), color: "text-offwhite" },
                { label: "Raised", value: `${raisedPercent.toFixed(0)}%`, color: "text-accent2" },
                { label: "Investors", value: formatNumber(asset.investorCount), color: "text-offwhite" },
                { label: "Next Payout", value: new Date(asset.nextPayout).toLocaleDateString("en-GB", { day: "numeric", month: "short" }), color: "text-green" },
              ].map((stat) => (
                <div key={stat.label} className="bg-card border border-border rounded-xl p-4">
                  <div className="text-[10px] text-muted uppercase tracking-wide mb-1">{stat.label}</div>
                  <div className={cn("font-mono font-bold text-lg", stat.color)}>{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Risk */}
            <div className="bg-card border border-border rounded-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-syne font-bold text-white">Risk Assessment</h2>
                <div className={cn("text-sm font-bold px-3 py-1 rounded-full", getRiskBadgeClass(asset.riskScore))}>
                  {asset.riskScore}/10
                </div>
              </div>
              <RiskPips score={asset.riskScore} className="mb-3" />
              <p className="text-sm text-muted mb-4 leading-relaxed">{ddReport.riskScoreJustification}</p>
              <div className="space-y-2">
                {ddReport.risks.map((risk) => (
                  <RiskItem key={risk.name} risk={risk} />
                ))}
              </div>
            </div>

            {/* AI DD Report */}
            <div className="bg-card border border-border rounded-card overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center gap-2 bg-[rgba(249,168,37,0.05)]">
                <Sparkles size={14} className="text-gold" />
                <span className="text-sm font-medium text-white">AI Due Diligence Report</span>
                <Badge variant="amber" className="ml-auto">AI Generated</Badge>
              </div>

              {/* Section tabs */}
              <div className="flex border-b border-border overflow-x-auto">
                {DD_SECTIONS.map((sec) => (
                  <button
                    key={sec.key}
                    onClick={() => setDdSection(ddSection === sec.key ? null : sec.key)}
                    className={cn(
                      "px-4 py-3 text-xs font-medium whitespace-nowrap transition-colors",
                      ddSection === sec.key
                        ? "text-gold border-b-2 border-gold bg-gold/5"
                        : "text-muted hover:text-offwhite"
                    )}
                  >
                    {sec.label}
                  </button>
                ))}
              </div>

              {DD_SECTIONS.map((sec) =>
                ddSection === sec.key ? (
                  <div key={sec.key} className="p-5 animate-fade-in">
                    <p className="text-sm text-muted leading-relaxed">{sec.content}</p>
                  </div>
                ) : null
              )}

              <div className="px-5 pb-4">
                <p className="text-[10px] text-muted/60 italic">
                  Report generated by Harvest.rwa AI. Based on verified documents from Stage 4–6 pipeline.
                  Not financial advice.
                </p>
              </div>
            </div>

            {/* AI Advisor */}
            <AIAdvisorPanel assetName={asset.name} />

            {/* Suitable for */}
            <div className="bg-card border border-border rounded-card p-5">
              <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                <Info size={14} className="text-muted" />
                Suitable For
              </h3>
              <div className="flex gap-2 flex-wrap">
                {ddReport.suitableFor.map((type) => (
                  <Badge
                    key={type}
                    variant={type === "conservative" ? "green" : type === "balanced" ? "amber" : "red"}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)} Investor
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Sticky invest widget */}
          <div>
            <InvestWidget asset={asset} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
