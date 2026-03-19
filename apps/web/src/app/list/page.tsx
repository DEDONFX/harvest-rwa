"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, CheckCircle, Clock, Zap, Shield,
  FileText, Camera, Users, BarChart2, Sparkles,
  Upload, AlertTriangle, Info, Building2, Home, TrendingUp, Wheat, Rocket, Factory,
  Video, Loader2, ChevronRight, Play
} from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const PIPELINE_STAGES = [
  { id: 1, label: "Application",          icon: FileText, desc: "Submit your asset details & pay listing fee",             time: "~30 min",  color: "#3B9EFF", tag: null },
  { id: 2, label: "AI Pre-Screening",     icon: Zap,      desc: "Automated fraud & eligibility check",                   time: "24 hours", color: "#00C896", tag: null },
  { id: 3, label: "Internal Review",      icon: Shield,   desc: "Harvest.rwa compliance team review",                    time: "2–5 days", color: "#F9A825", tag: null },
  { id: 4, label: "Physical Verification",icon: Camera,   desc: "Licensed regional partner visits and inspects asset",   time: "5–15 days",color: "#F9A825", tag: null },
  { id: 5, label: "IP Camera Setup",      icon: Video,    desc: "IP camera installed at asset — live feed anchored onchain", time: "1–3 days", color: "#F97316", tag: "Optional" },
  { id: 6, label: "Identity Audit",       icon: Users,    desc: "Originator identity anchored onchain permanently",      time: "1–2 days", color: "#A78BFA", tag: null },
  { id: 7, label: "DD Report",            icon: Sparkles, desc: "AI generates public due diligence report",              time: "2–4 hours",color: "#00C896", tag: "AI" },
  { id: 8, label: "Launch",               icon: BarChart2,desc: "Token deployed · Listing goes live",                   time: "Instant",  color: "#00C896", tag: "🚀" },
];

const ASSET_TYPES = [
  { value: "real_estate_commercial", label: "Commercial Real Estate", icon: Building2, desc: "Offices, retail, hotels, mixed-use" },
  { value: "real_estate_residential", label: "Residential Real Estate", icon: Home, desc: "Apartments, villas, student housing" },
  { value: "infrastructure_energy", label: "Infrastructure & Energy", icon: Zap, desc: "Solar, wind, logistics, utilities" },
  { value: "business_yield", label: "Business Yield", icon: TrendingUp, desc: "Invoice finance, revenue share, lending" },
  { value: "commodities", label: "Commodities", icon: Wheat, desc: "Agriculture, precious metals, resources" },
  { value: "pre_revenue", label: "Pre-Revenue Startup", icon: Rocket, desc: "Early-stage ventures with revenue projection" },
];

const CHAINS = [
  {
    value: "mantle",
    name: "Mantle Network",
    tag: "EVM · ERC-1400",
    features: ["ZK Validity Rollup", "EigenDA settlement", "$3.18B Treasury", "ERC-1400 security tokens"],
    color: "#00C896",
    bg: "rgba(0,200,150,0.08)",
    border: "rgba(0,200,150,0.25)",
    logo: "/mantle-logo.png",
  },
  {
    value: "solana",
    name: "Solana",
    tag: "SPL Tokens",
    features: ["400ms finality", "100M+ wallets", "SPL token standard", "Metaplex metadata"],
    color: "#9945FF",
    bg: "rgba(153,69,255,0.08)",
    border: "rgba(153,69,255,0.25)",
    logo: "/solana-logo.png",
  },
  {
    value: "ethereum",
    name: "Ethereum",
    tag: "EVM · ERC-1400",
    features: ["Most liquid chain", "Institutional trust", "ERC-1400 security tokens", "DeFi composability"],
    color: "#627EEA",
    bg: "rgba(98,126,234,0.08)",
    border: "rgba(98,126,234,0.25)",
    logo: "/eth-logo.png",
  },
  {
    value: "bnb",
    name: "BNB Chain",
    tag: "EVM · BEP-20",
    features: ["Low gas fees", "3 sec finality", "BEP-20 token standard", "Binance ecosystem"],
    color: "#F3BA2F",
    bg: "rgba(243,186,47,0.08)",
    border: "rgba(243,186,47,0.25)",
    logo: "/bnb-logo.png",
  },
  {
    value: "base",
    name: "Base",
    tag: "EVM · L2 · Coinbase",
    features: ["Coinbase-backed L2", "Ultra-low fees", "ERC-1400 support", "Onramp via Coinbase"],
    color: "#0052FF",
    bg: "rgba(0,82,255,0.08)",
    border: "rgba(0,82,255,0.25)",
    logo: "/base-logo.svg",
  },
  {
    value: "assetchain",
    name: "AssetChain",
    tag: "RWA Native · XRP-EVM",
    features: ["Built for RWAs", "XRP-EVM sidechain", "Institutional grade", "Native compliance layer"],
    color: "#2B7EF7",
    bg: "rgba(43,126,247,0.08)",
    border: "rgba(43,126,247,0.25)",
    logo: "/assetchain-logo.png",
  },
];

const CHAIN_INFO: Record<string, string> = {
  mantle: "ERC-1400 security tokens on Mantle Network. Transfer restrictions enforced at contract level — only KYC-verified addresses can hold tokens. Gas fees absorbed by Harvest.rwa.",
  solana: "SPL tokens with Metaplex metadata on Solana. 400ms finality and access to Solana's 100M+ wallet ecosystem. Compressed NFT support for large holder counts.",
  ethereum: "ERC-1400 security tokens on Ethereum Mainnet. Maximum institutional credibility and DeFi composability. Best for large-cap assets targeting institutional investors.",
  bnb: "BEP-20 tokens on BNB Chain. Ultra-low gas fees and 3-second finality. Access to Binance's massive user base. Great for retail-focused assets.",
  base: "ERC-1400 tokens on Base (Coinbase L2). Seamless fiat onramp via Coinbase for US investors. Near-zero fees with Ethereum-level security.",
  assetchain: "Native RWA tokens on AssetChain — a blockchain purpose-built for real-world assets. Built-in compliance layer and XRP-EVM sidechain architecture.",
};

type Step = 0 | 1 | 2 | 3 | 4 | 5;

const STEP_LABELS = ["Pipeline", "Asset Info", "Financials", "Chain", "Documents", "Review & Pay"];

export default function ListAssetPage() {
  const [step, setStep] = useState<Step>(0);
  const [assetType, setAssetType] = useState("");
  const [selectedChain, setSelectedChain] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    assetName: "",
    country: "",
    city: "",
    description: "",
    raiseTarget: "",
    tokenPrice: "1.00",
    tokenSymbol: "",
    annualYield: "",
    minInvestment: "1",
    investorCap: "5",
    originatorName: "",
    originatorEmail: "",
    originatorWebsite: "",
    yearsOperating: "",
  });

  const [docs, setDocs] = useState<Record<string, boolean>>({});

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const [pipelineStage, setPipelineStage] = useState(0); // 0 = just submitted (stage 1 done), 1 = stage 2 done, etc.
  const [advancing, setAdvancing] = useState(false);

  const advanceStage = () => {
    if (pipelineStage >= PIPELINE_STAGES.length - 1 || advancing) return;
    setAdvancing(true);
    setTimeout(() => {
      setPipelineStage((s) => s + 1);
      setAdvancing(false);
    }, 1200);
  };

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); setPipelineStage(0); }, 2000);
  };

  // ── Submitted ─────────────────────────────────────────────────────────────
  if (submitted) {
    const chain = CHAINS.find((c) => c.value === selectedChain);
    const allDone = pipelineStage >= PIPELINE_STAGES.length - 1;

    return (
      <AppShell showRightRail={false}>
        <div className="max-w-lg mx-auto py-12">
          {/* Header */}
          <div className="text-center mb-8">
            <div className={cn(
              "w-20 h-20 rounded-full border flex items-center justify-center mx-auto mb-5 transition-all duration-500",
              allDone ? "bg-green/15 border-green/30" : "bg-accent/10 border-accent/25"
            )}>
              {allDone
                ? <CheckCircle size={36} className="text-green" />
                : advancing
                  ? <Loader2 size={32} className="text-accent animate-spin" />
                  : <Zap size={32} className="text-accent" />
              }
            </div>
            <h1 className="font-syne font-black text-2xl text-white mb-1">
              {allDone ? "Asset Launched 🚀" : "Application Submitted"}
            </h1>
            <p className="text-muted text-sm">
              {allDone
                ? "Your asset is live on the launchpad. Token contract deployed."
                : "Your $200 listing fee has been received. Simulating pipeline stages below."}
            </p>
            {chain && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold mt-3"
                style={{ background: chain.bg, borderColor: chain.border, color: chain.color }}>
                <img src={chain.logo} alt={chain.name} width={14} height={14} style={{width:14,height:14,objectFit:"contain"}} />
                Deploying on {chain.name}
              </div>
            )}
          </div>

          {/* Pipeline progress */}
          <div className="bg-card border border-border rounded-2xl p-5 mb-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-muted uppercase tracking-widest font-bold">Pipeline Status</p>
              <span className="text-[10px] font-mono text-muted2">{pipelineStage + 1} / {PIPELINE_STAGES.length} stages</span>
            </div>

            <div className="space-y-1">
              {PIPELINE_STAGES.map((stage, i) => {
                const done = i <= pipelineStage;
                const current = i === pipelineStage + 1 && !allDone;
                const isAdvancing = advancing && current;
                const Icon = stage.icon;
                return (
                  <div key={stage.id} className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300",
                    done ? "bg-[rgba(0,200,150,0.06)]" : current ? "bg-card2 border border-border" : ""
                  )}>
                    {/* Status icon */}
                    <div className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-300",
                      done ? "bg-green/15 border border-green/30"
                      : current ? "bg-accent/10 border border-accent/30"
                      : "bg-card2 border border-border"
                    )}>
                      {done
                        ? <CheckCircle size={13} className="text-green" />
                        : isAdvancing
                          ? <Loader2 size={12} className="text-accent animate-spin" />
                          : current
                            ? <Icon size={12} style={{ color: stage.color }} />
                            : <span className="text-[10px] text-muted2 font-mono">{stage.id}</span>
                      }
                    </div>

                    {/* Label + desc */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={cn(
                          "text-sm font-medium transition-colors",
                          done ? "text-white" : current ? "text-offwhite" : "text-muted2"
                        )}>{stage.label}</span>
                        {stage.tag && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                            style={{ background: `${stage.color}20`, color: stage.color }}>
                            {stage.tag}
                          </span>
                        )}
                      </div>
                      {(done || current) && (
                        <p className="text-[10px] text-muted truncate">{stage.desc}</p>
                      )}
                    </div>

                    {/* Status badge */}
                    <div className="shrink-0">
                      {done
                        ? <span className="text-[10px] font-bold text-green">✓ Done</span>
                        : current
                          ? <span className="text-[10px] font-bold text-accent animate-pulse">In Review</span>
                          : <span className="text-[10px] text-muted2 font-mono">{stage.time}</span>
                      }
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Progress bar */}
            <div className="mt-4 h-1 bg-card2 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent to-green rounded-full transition-all duration-700"
                style={{ width: `${((pipelineStage + 1) / PIPELINE_STAGES.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Advance button or done state */}
          {!allDone ? (
            <button
              onClick={advanceStage}
              disabled={advancing}
              className={cn(
                "w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border font-semibold text-sm transition-all",
                advancing
                  ? "bg-card border-border text-muted cursor-wait"
                  : "bg-accent/10 border-accent/30 text-accent hover:bg-accent/20 hover:border-accent/50"
              )}
            >
              {advancing ? (
                <><Loader2 size={14} className="animate-spin" /> Processing stage {pipelineStage + 2}…</>
              ) : (
                <><Play size={13} /> Simulate: Complete Stage {pipelineStage + 2} — {PIPELINE_STAGES[pipelineStage + 1]?.label}</>
              )}
            </button>
          ) : (
            <div className="bg-green/5 border border-green/20 rounded-xl p-4 text-center mb-4">
              <p className="text-sm text-green font-semibold mb-1">All 8 pipeline stages complete</p>
              <p className="text-xs text-muted">In production, each stage has its own duration. This simulation compressed the full pipeline for testing.</p>
            </div>
          )}

          <div className="mt-4 bg-[rgba(249,168,37,0.06)] border border-gold/20 rounded-xl p-3 flex items-start gap-2">
            <Sparkles size={12} className="text-gold mt-0.5 shrink-0" />
            <p className="text-[11px] text-muted leading-relaxed">
              Email updates sent at each stage. The IP Camera Setup step (Stage 5) is optional but recommended for physical assets — it provides ongoing live verification for investors.
            </p>
          </div>

          <Link href="/dashboard" className="block mt-4">
            <Button variant={allDone ? "primary" : "outline"} size="lg" fullWidth>
              {allDone ? "View on Launchpad" : "Back to Dashboard"}
            </Button>
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell showRightRail={false}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-muted hover:text-offwhite text-sm mb-6 transition-colors">
          <ArrowLeft size={14} /> Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="font-syne font-black text-2xl text-white mb-1">List Your Asset</h1>
          <p className="text-sm text-muted">Tokenize a real-world asset and raise capital from investors worldwide.</p>
        </div>

        {/* Step nav */}
        <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-1">
          {STEP_LABELS.map((label, i) => (
            <div key={label} className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => { if (i < step) setStep(i as Step); }}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                  i === step
                    ? "bg-accent/15 text-accent border border-accent/40"
                    : i < step
                    ? "text-green cursor-pointer hover:text-offwhite"
                    : "text-muted cursor-default"
                )}
              >
                {i < step && <CheckCircle size={11} />}
                {label}
              </button>
              {i < STEP_LABELS.length - 1 && <div className="w-4 h-px bg-border" />}
            </div>
          ))}
        </div>

        {/* ── Step 0: Pipeline Overview ──────────────────────────────────── */}
        {step === 0 && (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-2xl p-5">
              <p className="text-sm font-medium text-offwhite mb-4">The 7-Stage Pipeline</p>
              <div className="space-y-4">
                {PIPELINE_STAGES.map((stage, i) => {
                  const Icon = stage.icon;
                  return (
                    <div key={stage.id} className="flex items-start gap-4">
                      <div className="flex flex-col items-center shrink-0">
                        <div className={cn("w-9 h-9 rounded-xl border flex items-center justify-center", "bg-card2 border-border")}>
                          <Icon size={16} className={stage.color} />
                        </div>
                        {i < PIPELINE_STAGES.length - 1 && <div className="w-px h-6 bg-border mt-1" />}
                      </div>
                      <div className="flex-1 pb-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-offwhite">
                            <span className="text-muted font-mono mr-1.5">{stage.id}.</span>
                            {stage.label}
                          </span>
                          <span className="text-xs text-muted font-mono flex items-center gap-1">
                            <Clock size={10} /> {stage.time}
                          </span>
                        </div>
                        <p className="text-xs text-muted mt-0.5">{stage.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5">
              <p className="text-sm font-medium text-offwhite mb-3">Listing Fee</p>
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted text-sm">Non-refundable application fee</span>
                <span className="font-mono font-bold text-white text-lg">$200 USDC</span>
              </div>
              <p className="text-xs text-muted">Covers AI pre-screening, compliance review, and physical verification coordination. Refunded only if Harvest.rwa rejects your application at Stage 3.</p>
            </div>

            <div className="bg-[rgba(108,92,231,0.06)] border border-accent/20 rounded-2xl p-4 flex items-start gap-3">
              <Info size={14} className="text-accent mt-0.5 shrink-0" />
              <p className="text-xs text-muted leading-relaxed">
                <span className="text-offwhite font-medium">Nothing goes onchain until Stage 7.</span>{" "}
                Your asset is only tokenized and visible to investors after passing all 7 stages. Average time from application to live: 18–28 days.
              </p>
            </div>

            <Button variant="primary" size="lg" fullWidth onClick={() => setStep(1)}>
              Start Application <ArrowRight size={16} />
            </Button>
          </div>
        )}

        {/* ── Step 1: Asset Info ────────────────────────────────────────── */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-offwhite mb-4">What type of asset are you listing?</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ASSET_TYPES.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setAssetType(t.value)}
                    className={cn(
                      "text-left p-4 rounded-2xl border transition-all",
                      assetType === t.value ? "bg-accent/10 border-accent" : "bg-card border-border hover:border-accent/40"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-7 h-7 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                        <t.icon size={14} className="text-accent" />
                      </div>
                      <span className="text-sm font-medium text-offwhite">{t.label}</span>
                    </div>
                    <p className="text-xs text-muted">{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {assetType && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted uppercase tracking-wide block mb-2">Asset Name *</label>
                  <input
                    value={form.assetName}
                    onChange={(e) => update("assetName", e.target.value)}
                    placeholder="e.g. Lagos Office Complex — Ikoyi"
                    className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-offwhite placeholder:text-muted2 focus:border-accent focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted uppercase tracking-wide block mb-2">Country *</label>
                    <input
                      value={form.country}
                      onChange={(e) => update("country", e.target.value)}
                      placeholder="Nigeria"
                      className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-offwhite placeholder:text-muted2 focus:border-accent focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted uppercase tracking-wide block mb-2">City *</label>
                    <input
                      value={form.city}
                      onChange={(e) => update("city", e.target.value)}
                      placeholder="Lagos"
                      className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-offwhite placeholder:text-muted2 focus:border-accent focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted uppercase tracking-wide block mb-2">Description *</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                    rows={4}
                    placeholder="Describe the asset, its revenue model, tenants/operators, and why investors should consider it…"
                    className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-offwhite placeholder:text-muted2 focus:border-accent focus:outline-none resize-none"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" size="lg" onClick={() => setStep(0)}>← Back</Button>
              <Button
                variant="primary" size="lg" className="flex-1"
                disabled={!assetType || !form.assetName || !form.country}
                onClick={() => setStep(2)}
              >
                Continue →
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 2: Financials ────────────────────────────────────────── */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted uppercase tracking-wide block mb-2">Raise Target (USD) *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">$</span>
                  <input
                    type="number"
                    value={form.raiseTarget}
                    onChange={(e) => update("raiseTarget", e.target.value)}
                    placeholder="500000"
                    className="w-full bg-card border border-border rounded-xl pl-8 pr-4 py-3 text-sm text-offwhite placeholder:text-muted2 focus:border-accent focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted uppercase tracking-wide block mb-2">Token Price (USD) *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">$</span>
                  <input
                    type="number"
                    value={form.tokenPrice}
                    onChange={(e) => update("tokenPrice", e.target.value)}
                    className="w-full bg-card border border-border rounded-xl pl-8 pr-4 py-3 text-sm text-offwhite placeholder:text-muted2 focus:border-accent focus:outline-none"
                  />
                </div>
                <p className="text-[10px] text-muted mt-1">Recommended: $1.00</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted uppercase tracking-wide block mb-2">Token Symbol *</label>
                <input
                  value={form.tokenSymbol}
                  onChange={(e) => update("tokenSymbol", e.target.value.toUpperCase().slice(0, 8))}
                  placeholder="e.g. LISBPROP"
                  className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-offwhite font-mono placeholder:text-muted2 focus:border-accent focus:outline-none"
                />
                <p className="text-[10px] text-muted mt-1">Short ticker for your token (max 8 chars)</p>
              </div>
              <div>
                <label className="text-xs text-muted uppercase tracking-wide block mb-2">Total Token Supply</label>
                <div className="w-full bg-card2 border border-border rounded-xl px-4 py-3 text-sm font-mono text-accent2 select-none">
                  {form.raiseTarget && form.tokenPrice
                    ? Math.floor(parseFloat(form.raiseTarget) / parseFloat(form.tokenPrice)).toLocaleString()
                    : "—"}
                </div>
                <p className="text-[10px] text-muted mt-1">Auto-calculated: Raise ÷ Token Price</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted uppercase tracking-wide block mb-2">Annual Yield % *</label>
                <div className="relative">
                  <input
                    type="number"
                    value={form.annualYield}
                    onChange={(e) => update("annualYield", e.target.value)}
                    placeholder="8.5"
                    className="w-full bg-card border border-border rounded-xl pl-4 pr-8 py-3 text-sm text-offwhite placeholder:text-muted2 focus:border-accent focus:outline-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted">%</span>
                </div>
              </div>
              <div>
                <label className="text-xs text-muted uppercase tracking-wide block mb-2">Min Investment (USD)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">$</span>
                  <input
                    type="number"
                    value={form.minInvestment}
                    onChange={(e) => update("minInvestment", e.target.value)}
                    className="w-full bg-card border border-border rounded-xl pl-8 pr-4 py-3 text-sm text-offwhite placeholder:text-muted2 focus:border-accent focus:outline-none"
                  />
                </div>
                <p className="text-[10px] text-muted mt-1">Platform minimum: $1</p>
              </div>
            </div>

            <div>
              <label className="text-xs text-muted uppercase tracking-wide block mb-2">Max per investor (% of supply)</label>
              <div className="relative">
                <input
                  type="number"
                  value={form.investorCap}
                  onChange={(e) => update("investorCap", e.target.value)}
                  max={20}
                  className="w-full bg-card border border-border rounded-xl pl-4 pr-8 py-3 text-sm text-offwhite placeholder:text-muted2 focus:border-accent focus:outline-none"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted">%</span>
              </div>
              <p className="text-[10px] text-muted mt-1">Default 5%, max 20% (requires approval)</p>
            </div>

            {form.raiseTarget && form.annualYield && (
              <div className="bg-card2 border border-border rounded-2xl p-4">
                <p className="text-xs text-muted uppercase tracking-wide mb-3">Preview Calculation</p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-lg font-black font-mono text-white">
                      {Math.floor(parseFloat(form.raiseTarget || "0") / parseFloat(form.tokenPrice || "1")).toLocaleString()}
                    </p>
                    <p className="text-[10px] text-muted">Total tokens</p>
                  </div>
                  <div>
                    <p className="text-lg font-black font-mono text-accent2">{form.annualYield}%</p>
                    <p className="text-[10px] text-muted">Annual yield</p>
                  </div>
                  <div>
                    <p className="text-lg font-black font-mono text-green">
                      ${(parseFloat(form.raiseTarget || "0") * parseFloat(form.annualYield || "0") / 100).toLocaleString()}
                    </p>
                    <p className="text-[10px] text-muted">Yr 1 yield pool</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" size="lg" onClick={() => setStep(1)}>← Back</Button>
              <Button
                variant="primary" size="lg" className="flex-1"
                disabled={!form.raiseTarget || !form.annualYield}
                onClick={() => setStep(3)}
              >
                Continue →
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 3: Chain Selection ───────────────────────────────────── */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-offwhite mb-1">Choose your blockchain</p>
              <p className="text-xs text-muted mb-5">
                Your asset tokens will be deployed on the chain you select. This cannot be changed after submission.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {CHAINS.map((chain) => (
                  <button
                    key={chain.value}
                    onClick={() => setSelectedChain(chain.value)}
                    className={cn(
                      "text-left p-5 rounded-2xl border-2 transition-all relative overflow-hidden",
                      selectedChain === chain.value
                        ? "bg-card"
                        : "bg-card border-border hover:border-white/10"
                    )}
                    style={selectedChain === chain.value ? {
                      borderColor: chain.color,
                      boxShadow: `0 0 24px ${chain.bg}`,
                    } : {}}
                  >
                    {/* Selected indicator */}
                    {selectedChain === chain.value && (
                      <div className="absolute top-3 right-3">
                        <CheckCircle size={16} style={{ color: chain.color }} />
                      </div>
                    )}

                    {/* Logo */}
                    <div className="mb-3"><img src={chain.logo} alt={chain.name} width={32} height={32} style={{width:32,height:32,objectFit:"contain"}} /></div>

                    {/* Name + tag */}
                    <p className="text-sm font-bold text-white mb-0.5">{chain.name}</p>
                    <p className="text-[10px] font-mono mb-3" style={{ color: chain.color }}>{chain.tag}</p>

                    {/* Features */}
                    <div className="space-y-1.5">
                      {chain.features.map((f) => (
                        <div key={f} className="flex items-center gap-2 text-[11px] text-muted">
                          <span className="w-1 h-1 rounded-full shrink-0" style={{ background: chain.color }} />
                          {f}
                        </div>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Info box */}
            {selectedChain && (
              <div
                className="rounded-2xl border p-4 flex items-start gap-3 transition-all"
                style={{
                  background: CHAINS.find((c) => c.value === selectedChain)?.bg,
                  borderColor: CHAINS.find((c) => c.value === selectedChain)?.border,
                }}
              >
                <Info size={14} className="mt-0.5 shrink-0" style={{ color: CHAINS.find((c) => c.value === selectedChain)?.color }} />
                <p className="text-xs text-muted leading-relaxed">
                  {CHAIN_INFO[selectedChain]}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" size="lg" onClick={() => setStep(2)}>← Back</Button>
              <Button
                variant="primary" size="lg" className="flex-1"
                disabled={!selectedChain}
                onClick={() => setStep(4)}
              >
                Continue →
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 4: Documents ─────────────────────────────────────────── */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-offwhite mb-1">Originator Identity</p>
              <p className="text-xs text-muted mb-4">The person or company legally responsible for this asset.</p>
              <div className="space-y-3">
                <input
                  value={form.originatorName}
                  onChange={(e) => update("originatorName", e.target.value)}
                  placeholder="Full legal name / Company name"
                  className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-offwhite placeholder:text-muted2 focus:border-accent focus:outline-none"
                />
                <input
                  type="email"
                  value={form.originatorEmail}
                  onChange={(e) => update("originatorEmail", e.target.value)}
                  placeholder="Business email"
                  className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-offwhite placeholder:text-muted2 focus:border-accent focus:outline-none"
                />
                <input
                  value={form.originatorWebsite}
                  onChange={(e) => update("originatorWebsite", e.target.value)}
                  placeholder="Website (optional)"
                  className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-offwhite placeholder:text-muted2 focus:border-accent focus:outline-none"
                />
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-offwhite mb-1">Required Documents</p>
              <p className="text-xs text-muted mb-4">Upload supporting documents. Additional docs may be requested during review.</p>
              <div className="space-y-3">
                {[
                  { key: "title_deed", label: "Title Deed / Ownership Proof", hint: "PDF · Max 20MB" },
                  { key: "financial_statements", label: "Financial Statements (last 2 years)", hint: "PDF · Max 20MB" },
                  { key: "valuation_report", label: "Independent Valuation Report", hint: "PDF · Max 20MB" },
                  { key: "director_id", label: "Director / Owner Government ID", hint: "JPG, PNG or PDF" },
                ].map(({ key, label, hint }) => (
                  <button
                    key={key}
                    onClick={() => setDocs((d) => ({ ...d, [key]: true }))}
                    className={cn(
                      "w-full text-left flex items-center gap-4 p-4 rounded-xl border transition-all",
                      docs[key] ? "bg-green/5 border-green/30" : "bg-card border-border hover:border-accent/40"
                    )}
                  >
                    <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0", docs[key] ? "bg-green/15" : "bg-card2")}>
                      {docs[key] ? <CheckCircle size={16} className="text-green" /> : <Upload size={16} className="text-muted" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-offwhite font-medium">{label}</p>
                      <p className="text-xs text-muted">{hint}</p>
                    </div>
                    {docs[key] && <span className="text-xs text-green font-medium">Uploaded</span>}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[rgba(249,168,37,0.06)] border border-gold/20 rounded-2xl p-4 flex items-start gap-3">
              <AlertTriangle size={14} className="text-gold mt-0.5 shrink-0" />
              <p className="text-xs text-muted">
                Documents are reviewed by our compliance team and licensed regional partners. All information is kept strictly confidential and encrypted at rest.
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" size="lg" onClick={() => setStep(3)}>← Back</Button>
              <Button
                variant="primary" size="lg" className="flex-1"
                disabled={!form.originatorName || !form.originatorEmail}
                onClick={() => setStep(5)}
              >
                Continue →
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 5: Review & Pay ──────────────────────────────────────── */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-2xl divide-y divide-border">
              {[
                { section: "Asset", rows: [
                  { label: "Name", value: form.assetName },
                  { label: "Type", value: ASSET_TYPES.find((t) => t.value === assetType)?.label ?? assetType },
                  { label: "Location", value: `${form.city}, ${form.country}` },
                ]},
                { section: "Financials", rows: [
                  { label: "Raise target", value: `$${parseInt(form.raiseTarget).toLocaleString()}` },
                  { label: "Token price", value: `$${form.tokenPrice}` },
                  { label: "Token symbol", value: form.tokenSymbol || "—" },
                  { label: "Total supply", value: form.raiseTarget && form.tokenPrice ? `${Math.floor(parseFloat(form.raiseTarget) / parseFloat(form.tokenPrice)).toLocaleString()} tokens` : "—" },
                  { label: "Annual yield", value: `${form.annualYield}%` },
                  { label: "Min investment", value: `$${form.minInvestment}` },
                ]},
                { section: "Chain", rows: [
                  { label: "Blockchain", value: CHAINS.find((c) => c.value === selectedChain)?.name ?? selectedChain },
                  { label: "Token standard", value: selectedChain === "mantle" ? "ERC-1400 (Security Token)" : "SPL Token (Metaplex)" },
                ]},
                { section: "Originator", rows: [
                  { label: "Name", value: form.originatorName },
                  { label: "Email", value: form.originatorEmail },
                ]},
              ].map(({ section, rows }) => (
                <div key={section} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-muted uppercase tracking-wide">{section}</p>
                    {section === "Chain" && selectedChain && (() => {
                      const c = CHAINS.find((ch) => ch.value === selectedChain)!;
                      return (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-bold"
                          style={{ background: c.bg, borderColor: c.border, color: c.color }}>
                          <img src={c.logo} alt={c.name} width={12} height={12} style={{width:12,height:12,objectFit:"contain"}} />
                          {c.name}
                        </span>
                      );
                    })()}
                  </div>
                  <div className="space-y-2">
                    {rows.map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between">
                        <span className="text-sm text-muted">{label}</span>
                        <span className="text-sm text-offwhite font-medium truncate ml-4 max-w-[60%] text-right">{value || "—"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-offwhite font-medium">Listing fee</span>
                <span className="font-mono font-black text-2xl text-white">$200</span>
              </div>
              <p className="text-xs text-muted mb-4">Charged from your platform balance in USDC</p>
              <div className="flex items-center justify-between text-xs text-muted">
                <span>Your balance</span>
                <span className="font-mono text-offwhite">$1,042.50 USDC</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted mt-1">
                <span>After payment</span>
                <span className="font-mono text-offwhite">$842.50 USDC</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" size="lg" onClick={() => setStep(4)}>← Back</Button>
              <Button variant="primary" size="lg" className="flex-1" loading={loading} onClick={handleSubmit}>
                Pay $200 & Submit
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
