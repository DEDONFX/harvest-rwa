"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft, Shield, Zap, CheckCircle, ArrowRight, Sparkles,
  TrendingUp, Clock, Users, ExternalLink, Copy, Check, MapPin
} from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import { MOCK_ASSETS } from "@/lib/mock-data";
import { formatUSD } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Step = "confirm" | "processing" | "success";

function CountUp({ target, prefix = "", suffix = "", decimals = 2 }: {
  target: number; prefix?: string; suffix?: string; decimals?: number;
}) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const step = target / 40;
    let cur = 0;
    const t = setInterval(() => {
      cur = Math.min(cur + step, target);
      setVal(cur);
      if (cur >= target) clearInterval(t);
    }, 25);
    return () => clearInterval(t);
  }, [target]);
  return <>{prefix}{val.toFixed(decimals)}{suffix}</>;
}

export default function InvestConfirmPage() {
  const params = useParams();
  const assetId = params.assetId as string;
  const asset = MOCK_ASSETS.find((a) => a.id === assetId) ?? MOCK_ASSETS[0];

  const [amount, setAmount] = useState(10);
  const [step, setStep] = useState<Step>("confirm");
  const [copied, setCopied] = useState(false);

  const tokens = Math.floor(amount / asset.pricePerToken);
  const monthlyYield = (amount * asset.annualYieldPercent) / 100 / 12;
  const annualYield = (amount * asset.annualYieldPercent) / 100;
  const ownershipPct = (tokens / asset.totalSupply) * 100;
  const raisedPct = (asset.raisedAmount / asset.raiseTarget) * 100;
  const txHash = "0x4a7f3b2e1c9d8f5a6b3e2d1c8f7a9b4e3d2c1f8a7b6e5d4c3b2a1f9e8d7c6b5a";

  const handleConfirm = () => {
    setStep("processing");
    setTimeout(() => setStep("success"), 2500);
  };

  const copyTx = () => {
    navigator.clipboard.writeText(txHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Confirm ───────────────────────────────────────────────────────────────
  if (step === "confirm") {
    return (
      <AppShell showRightRail={false}>
        <div className="max-w-2xl mx-auto">
          <Link href={`/asset/${asset.id}`} className="inline-flex items-center gap-1.5 text-muted hover:text-offwhite text-sm mb-6 transition-colors">
            <ArrowLeft size={14} /> Back to Asset
          </Link>

          <h1 className="font-syne font-black text-2xl text-white mb-6">Confirm Investment</h1>

          {/* Asset preview */}
          <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4 mb-6">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
              <Image src={asset.image} alt={asset.name} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-syne font-bold text-white text-sm mb-0.5 truncate">{asset.name}</p>
              <p className="flex items-center gap-1 text-xs text-muted mb-2"><MapPin size={10} className="shrink-0" />{asset.country} · {asset.symbol}</p>
              <ProgressBar value={raisedPct} height={4} />
              <p className="text-[10px] text-muted mt-1 font-mono">{raisedPct.toFixed(0)}% raised</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-2xl font-black font-mono text-accent2">{asset.annualYieldPercent}%</p>
              <p className="text-[10px] text-muted">Annual yield</p>
            </div>
          </div>

          {/* Amount input */}
          <div className="bg-card border border-border rounded-2xl p-5 mb-4">
            <p className="text-xs text-muted uppercase tracking-wide mb-3">Investment Amount</p>
            <div className="relative mb-3">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-2xl font-mono">$</span>
              <input
                type="number"
                min={asset.minInvestment}
                value={amount}
                onChange={(e) => setAmount(Math.max(1, Number(e.target.value)))}
                className="w-full bg-card2 border border-border rounded-xl pl-10 pr-4 py-4 text-3xl font-mono font-bold text-white focus:border-accent focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 10, 50, 100].map((p) => (
                <button
                  key={p}
                  onClick={() => setAmount(p)}
                  className={cn(
                    "py-2 rounded-xl text-sm font-mono border transition-all",
                    amount === p
                      ? "bg-accent/15 border-accent text-accent"
                      : "bg-card border-border text-muted hover:border-accent/40"
                  )}
                >
                  ${p}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted mt-2">Min investment: $1.00 · No KYC required</p>
          </div>

          {/* Investment breakdown */}
          <div className="bg-card border border-border rounded-2xl p-5 mb-4">
            <p className="text-xs text-muted uppercase tracking-wide mb-4">Investment Breakdown</p>
            <div className="space-y-3">
              {[
                { label: "Tokens received", value: `${tokens.toLocaleString()} ${asset.symbol}`, color: "text-offwhite" },
                { label: "Ownership", value: `${ownershipPct.toFixed(4)}% of supply`, color: "text-offwhite" },
                { label: "Monthly yield (est.)", value: formatUSD(monthlyYield), color: "text-green" },
                { label: "Annual yield (est.)", value: formatUSD(annualYield), color: "text-green" },
                { label: "Price per token", value: `$${asset.pricePerToken.toFixed(2)}`, color: "text-muted" },
                { label: "Platform fee", value: "$0.00", color: "text-muted" },
                { label: "Gas fee", value: "$0.00 (absorbed)", color: "text-muted" },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-sm text-muted">{label}</span>
                  <span className={cn("text-sm font-mono font-medium", color)}>{value}</span>
                </div>
              ))}
              <div className="border-t border-border pt-3 flex items-center justify-between">
                <span className="text-sm font-medium text-offwhite">Total charged</span>
                <span className="text-lg font-black font-mono text-white">{formatUSD(amount)}</span>
              </div>
            </div>
          </div>

          {/* Next payout */}
          <div className="bg-[rgba(0,200,150,0.06)] border border-green/20 rounded-2xl p-4 flex items-center gap-3 mb-6">
            <Clock size={15} className="text-green shrink-0" />
            <div>
              <p className="text-xs font-medium text-offwhite">First yield payout</p>
              <p className="text-xs text-muted">
                {new Date(asset.nextPayout).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                {" "}— {formatUSD(monthlyYield)} estimated
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <Shield size={13} className="text-muted shrink-0" />
            <p className="text-xs text-muted">
              Secured by smart contract on Mantle Network. Tokens are transferred instantly on confirmation. This investment is non-refundable once confirmed.
            </p>
          </div>

          <Button variant="primary" size="lg" fullWidth onClick={handleConfirm}>
            Confirm {formatUSD(amount)} Investment <ArrowRight size={16} />
          </Button>
        </div>
      </AppShell>
    );
  }

  // ── Processing ────────────────────────────────────────────────────────────
  if (step === "processing") {
    return (
      <AppShell showRightRail={false}>
        <div className="max-w-md mx-auto text-center py-24">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full border-2 border-accent/20 animate-ping" />
            <div className="w-24 h-24 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center">
              <Zap size={36} className="text-accent" />
            </div>
          </div>
          <h2 className="font-syne font-bold text-2xl text-white mb-2">Processing Investment</h2>
          <p className="text-sm text-muted mb-8">Submitting to Mantle Network…</p>

          <div className="bg-card border border-border rounded-2xl p-5 text-left space-y-3">
            {[
              { label: "Balance check", done: true },
              { label: "KYC verification", done: true },
              { label: "Smart contract call", done: false },
              { label: "Token transfer", done: false },
            ].map(({ label, done }, i) => (
              <div key={label} className="flex items-center gap-3">
                <div className={cn(
                  "w-5 h-5 rounded-full border flex items-center justify-center",
                  done ? "bg-green/15 border-green/30" : "border-border"
                )}>
                  {done
                    ? <CheckCircle size={12} className="text-green" />
                    : <div className="w-2 h-2 rounded-full bg-muted2 animate-pulse" />
                  }
                </div>
                <span className={cn("text-sm", done ? "text-offwhite" : "text-muted")}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </AppShell>
    );
  }

  // ── Success ───────────────────────────────────────────────────────────────
  return (
    <AppShell showRightRail={false}>
      <div className="max-w-lg mx-auto py-12">
        {/* Success header */}
        <div className="text-center mb-8">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-green/10 animate-ping" style={{ animationDuration: "2s" }} />
            <div className="w-24 h-24 rounded-full bg-green/15 border-2 border-green/30 flex items-center justify-center">
              <CheckCircle size={40} className="text-green" />
            </div>
          </div>
          <h1 className="font-syne font-black text-3xl text-white mb-2">Investment Confirmed</h1>
          <p className="text-muted">Your tokens are in your portfolio. Yield starts accruing now.</p>
        </div>

        {/* Summary card */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-4">
          <div className="flex items-center gap-4 mb-6 pb-5 border-b border-border">
            <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0">
              <Image src={asset.image} alt={asset.name} fill className="object-cover" />
            </div>
            <div>
              <p className="font-syne font-bold text-white">{asset.name}</p>
              <p className="text-xs text-muted">{asset.symbol}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="font-black font-mono text-2xl text-white">
                <CountUp target={amount} prefix="$" decimals={2} />
              </p>
              <p className="text-xs text-muted">invested</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-card2 rounded-xl p-4 text-center">
              <p className="text-xs text-muted mb-1">Tokens received</p>
              <p className="font-mono font-black text-xl text-white">{tokens.toLocaleString()}</p>
              <p className="text-[10px] text-muted">{asset.symbol}</p>
            </div>
            <div className="bg-card2 rounded-xl p-4 text-center">
              <p className="text-xs text-muted mb-1">Annual yield (est.)</p>
              <p className="font-mono font-black text-xl text-green">
                <CountUp target={annualYield} prefix="$" decimals={2} />
              </p>
              <p className="text-[10px] text-muted">{asset.annualYieldPercent}% APY</p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">First payout</span>
              <span className="text-offwhite font-medium">
                {new Date(asset.nextPayout).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Network</span>
              <span className="text-offwhite font-medium">Mantle Network</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted">Transaction</span>
              <button
                onClick={copyTx}
                className="flex items-center gap-1.5 text-accent2 font-mono text-xs hover:text-white transition-colors"
              >
                {txHash.slice(0, 8)}…{txHash.slice(-6)}
                {copied ? <Check size={11} className="text-green" /> : <Copy size={11} />}
              </button>
            </div>
          </div>
        </div>

        {/* AI insight */}
        <div className="bg-[rgba(249,168,37,0.06)] border border-gold/20 rounded-2xl p-4 flex items-start gap-3 mb-6">
          <Sparkles size={15} className="text-gold mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-medium text-gold mb-1">AI Insight</p>
            <p className="text-xs text-muted leading-relaxed">
              At {asset.annualYieldPercent}% APY, your {formatUSD(amount)} will generate ~{formatUSD(annualYield)} in the first year.
              This asset matches your balanced risk profile well. Consider diversifying with one more asset in a different category.
            </p>
          </div>
        </div>

        {/* External link to Mantle explorer */}
        <a
          href={`https://explorer.mantle.xyz/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 text-xs text-muted hover:text-offwhite transition-colors mb-6"
        >
          <ExternalLink size={11} /> View on Mantle Explorer
        </a>

        <div className="grid grid-cols-2 gap-3">
          <Link href="/portfolio">
            <Button variant="secondary" size="lg" fullWidth>
              View Portfolio
            </Button>
          </Link>
          <Link href="/discover">
            <Button variant="primary" size="lg" fullWidth>
              Discover More <ArrowRight size={15} />
            </Button>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
