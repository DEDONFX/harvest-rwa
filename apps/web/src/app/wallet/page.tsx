"use client";

import { useState, useEffect } from "react";
import { ArrowDownLeft, ArrowUpRight, Send, Copy, Check, ExternalLink, Plus, Wallet, Shield, Zap, ChevronDown, Clock, AlertCircle, TrendingUp, Info, Eye, EyeOff, Key } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { MOCK_USER, MOCK_TRANSACTIONS, MOCK_PORTFOLIO, CATEGORY_LABELS } from "@/lib/mock-data";
import { P2P_COUNTRIES, MOCK_MERCHANT, type P2PCountry, type PaymentMethod } from "@/lib/p2p-methods";
import { formatUSD, truncateAddress, timeAgo } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useAuthGuard } from "@/components/AuthGuard";

type PanelType = "deposit" | "withdraw" | "send" | "receive" | null;

function CountdownTimer({ minutes }: { minutes: number }) {
  const [secs, setSecs] = useState(minutes * 60);
  useEffect(() => {
    const t = setInterval(() => setSecs((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  const isUrgent = secs < 300;
  return (
    <span className={cn("font-mono font-bold", isUrgent ? "text-red animate-pulse" : "text-gold")}>
      {m}:{s}
    </span>
  );
}

const CHAIN_CONFIG = {
  mantle: {
    label: "Mantle",
    placeholder: "0x...",
    validate: (addr: string) => /^0x[0-9a-fA-F]{40}$/.test(addr.trim()),
    errorMsg: "Must be a valid Mantle / EVM address (0x…)",
    warning: "Transfers on Mantle are irreversible. Double-check the address before continuing.",
    color: "#3B9EFF",
    bg: "rgba(59,158,255,0.12)",
    border: "rgba(59,158,255,0.35)",
  },
  solana: {
    label: "Solana",
    placeholder: "Base58 address…",
    validate: (addr: string) => /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(addr.trim()),
    errorMsg: "Must be a valid Solana base58 address",
    warning: "Transfers on Solana are irreversible. Double-check the address before continuing.",
    color: "#9945FF",
    bg: "rgba(153,69,255,0.12)",
    border: "rgba(153,69,255,0.35)",
  },
} as const;

function InlineChainSelector({
  value,
  onChange,
}: {
  value: "mantle" | "solana";
  onChange: (c: "mantle" | "solana") => void;
}) {
  return (
    <div className="flex gap-2">
      {(["mantle", "solana"] as const).map((c) => {
        const cfg = CHAIN_CONFIG[c];
        const active = value === c;
        return (
          <button
            key={c}
            type="button"
            onClick={() => onChange(c)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all",
              active ? "" : "bg-card border-border text-muted hover:border-accent/30"
            )}
            style={
              active
                ? { background: cfg.bg, borderColor: cfg.border, color: cfg.color }
                : undefined
            }
          >
            {c === "mantle" ? (
              <img src="/mantle-logo.svg" alt="Mantle" width={12} height={12} style={{width:12,height:12}} />
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M6.5 15.5h9l-2 2h-9l2-2z" fill="#9945FF"/>
                <path d="M6.5 11.5h9l-2 2h-9l2-2z" fill="#9945FF" fillOpacity="0.7"/>
                <path d="M6.5 7.5h9l-2 2h-9l2-2z" fill="#14F195"/>
              </svg>
            )}
            {cfg.label}
          </button>
        );
      })}
    </div>
  );
}

function SendPanel({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [chain, setChain] = useState<"mantle" | "solana">("mantle");
  const [recipient, setRecipient] = useState("");
  const [assetId, setAssetId] = useState<"usdc" | string>("usdc");
  const [tokenAmount, setTokenAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const chainCfg = CHAIN_CONFIG[chain];
  const isValidAddress = chainCfg.validate(recipient);

  const assets = [
    { id: "usdc", label: "USDC", sub: "Cash balance", value: MOCK_USER.balance, unit: "USDC" },
    ...MOCK_PORTFOLIO.map((h) => ({
      id: h.assetId,
      label: h.assetName,
      sub: `${h.tokens.toLocaleString()} tokens`,
      value: h.tokens,
      unit: "tokens",
    })),
  ];

  const selected = assets.find((a) => a.id === assetId)!;
  const maxAmount = selected?.value ?? 0;
  const amountNum = parseFloat(tokenAmount) || 0;
  const isValidAmount = amountNum > 0 && amountNum <= maxAmount;

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 1800);
  };

  if (done) {
    return (
      <div className="text-center space-y-4 py-6">
        <div className="w-14 h-14 rounded-full bg-green/15 border border-green/30 flex items-center justify-center mx-auto">
          <Check className="text-green" size={24} />
        </div>
        <div>
          <p className="font-syne font-bold text-white text-lg mb-1">Transfer Sent</p>
          <p className="text-sm text-muted">
            {tokenAmount} {selected.unit} sent to{" "}
            <span className="font-mono text-offwhite">{truncateAddress(recipient)}</span>
          </p>
        </div>
        <Button variant="secondary" onClick={onClose}>Close</Button>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-slide-up">
      <div className="flex items-center justify-between">
        <h3 className="font-syne font-bold text-white">Send Tokens</h3>
        <button onClick={onClose} className="text-muted hover:text-offwhite text-xl leading-none">×</button>
      </div>

      {/* Step 1 — Recipient */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <p className="text-xs text-muted uppercase tracking-wide mb-2">Destination Chain</p>
            <InlineChainSelector value={chain} onChange={(c) => { setChain(c); setRecipient(""); }} />
          </div>
          <div>
            <p className="text-xs text-muted uppercase tracking-wide mb-2">Recipient Wallet Address</p>
            <input
              type="text"
              placeholder={chainCfg.placeholder}
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className={cn(
                "w-full bg-card2 border rounded-btn px-4 py-3 text-sm font-mono text-offwhite focus:outline-none transition-colors",
                recipient && !isValidAddress ? "border-red/60 focus:border-red" : "border-border focus:border-accent"
              )}
            />
            {recipient && !isValidAddress && (
              <p className="text-xs text-red mt-1.5 flex items-center gap-1">
                <AlertCircle size={11} /> {chainCfg.errorMsg}
              </p>
            )}
            {recipient && isValidAddress && (
              <p className="text-xs text-green mt-1.5 flex items-center gap-1">
                <Check size={11} /> Valid address
              </p>
            )}
          </div>

          <div className="flex items-start gap-2 bg-amber-400/5 border border-amber-400/20 rounded-xl px-4 py-3">
            <AlertCircle size={12} className="text-amber-400 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-400/90">{chainCfg.warning}</p>
          </div>

          <Button variant="primary" size="lg" fullWidth disabled={!isValidAddress} onClick={() => setStep(2)}>
            Continue →
          </Button>
        </div>
      )}

      {/* Step 2 — Asset + Amount */}
      {step === 2 && (
        <div className="space-y-4">
          <div>
            <p className="text-xs text-muted uppercase tracking-wide mb-2">What to send</p>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {assets.map((a) => (
                <button
                  key={a.id}
                  onClick={() => { setAssetId(a.id); setTokenAmount(""); }}
                  className={cn(
                    "w-full text-left flex items-center gap-3 p-3 rounded-xl border transition-all",
                    assetId === a.id
                      ? "bg-accent/10 border-accent"
                      : "bg-card border-border hover:border-accent/40"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-offwhite font-medium truncate">{a.label}</p>
                    <p className="text-xs text-muted">{a.sub}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-mono text-sm text-offwhite">
                      {a.id === "usdc" ? formatUSD(a.value) : a.value.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted">{a.unit}</p>
                  </div>
                  {assetId === a.id && <Check size={14} className="text-accent shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted uppercase tracking-wide">Amount</p>
              <button
                onClick={() => setTokenAmount(String(maxAmount))}
                className="text-xs text-accent hover:text-accent/80"
              >
                Max: {selected?.id === "usdc" ? formatUSD(maxAmount) : `${maxAmount.toLocaleString()} tokens`}
              </button>
            </div>
            <div className="relative">
              <input
                type="number"
                placeholder="0"
                value={tokenAmount}
                onChange={(e) => setTokenAmount(e.target.value)}
                className="w-full bg-card2 border border-border rounded-btn pl-4 pr-20 py-4 text-2xl font-mono text-white focus:border-accent focus:outline-none"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted font-mono">
                {selected?.unit}
              </span>
            </div>
            {tokenAmount && !isValidAmount && (
              <p className="text-xs text-red mt-1.5">Exceeds available balance</p>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="md" onClick={() => setStep(1)}>← Back</Button>
            <Button variant="primary" size="md" className="flex-1" disabled={!isValidAmount} onClick={() => setStep(3)}>
              Review →
            </Button>
          </div>
        </div>
      )}

      {/* Step 3 — Review + Confirm */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="bg-card2 rounded-xl divide-y divide-border">
            {[
              { label: "To", value: truncateAddress(recipient), mono: true },
              { label: "Chain", value: chainCfg.label, mono: false },
              { label: "Asset", value: selected.label, mono: false },
              { label: "Amount", value: `${amountNum.toLocaleString()} ${selected.unit}`, mono: true },
              { label: "Network fee", value: "Covered by Harvest.rwa", mono: false },
            ].map(({ label, value, mono }) => (
              <div key={label} className="flex items-center justify-between px-4 py-3">
                <p className="text-xs text-muted">{label}</p>
                <p className={cn("text-sm text-offwhite", mono && "font-mono")}>{value}</p>
              </div>
            ))}
          </div>

          <div className="flex items-start gap-2 text-xs text-red/80">
            <AlertCircle size={12} className="mt-0.5 shrink-0 text-red" />
            <span>This transfer is final and cannot be reversed on-chain.</span>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="md" onClick={() => setStep(2)}>← Back</Button>
            <Button variant="primary" size="md" className="flex-1" loading={loading} onClick={handleConfirm}>
              Confirm Transfer
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function P2PPanel({ type, onClose }: { type: PanelType; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [countryCode, setCountryCode] = useState("NG");
  const [methodId, setMethodId] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const country = P2P_COUNTRIES.find((c) => c.code === countryCode)!;
  const localAmount = country && amount ? (parseFloat(amount) * country.usdRate).toFixed(0) : "0";

  const copyField = (val: string, key: string) => {
    navigator.clipboard.writeText(val);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 1500);
  };

  if (done) {
    return (
      <div className="text-center space-y-4 py-6">
        <div className="w-14 h-14 rounded-full bg-green/15 border border-green/30 flex items-center justify-center mx-auto">
          <Check className="text-green" size={24} />
        </div>
        <div>
          <p className="font-syne font-bold text-white text-lg mb-1">
            {type === "deposit" ? "Deposit Initiated" : "Withdrawal Initiated"}
          </p>
          <p className="text-sm text-muted">
            {type === "deposit"
              ? "Send payment to the merchant account above. Funds credited once confirmed."
              : "Merchant will send funds to your local account within 30 minutes."}
          </p>
        </div>
        <Button variant="secondary" onClick={onClose}>Close</Button>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-slide-up">
      <div className="flex items-center justify-between">
        <h3 className="font-syne font-bold text-white">
          {type === "deposit" ? "Add Funds via P2P" : "Withdraw via P2P"}
        </h3>
        <button onClick={onClose} className="text-muted hover:text-offwhite text-xl leading-none">×</button>
      </div>

      {/* KYC notice — P2P only */}
      <div className="flex items-start gap-2 bg-amber-400/5 border border-amber-400/20 rounded-xl px-4 py-3">
        <Shield size={13} className="text-amber-400 mt-0.5 shrink-0" />
        <p className="text-xs text-amber-400/90 leading-relaxed">
          <span className="font-semibold">KYC required for P2P.</span>{" "}
          Fiat deposits and withdrawals require identity verification. Buying assets, transferring tokens, or sending to an external wallet does <em>not</em> require KYC.{" "}
          <Link href="/kyc" className="underline hover:text-amber-300">Complete KYC →</Link>
        </p>
      </div>

      {/* Step 1: Country + Amount */}
      {step === 1 && (
        <div className="space-y-4">
          {/* Country selector */}
          <div>
            <p className="text-xs text-muted uppercase tracking-wide mb-2">Your Country</p>
            <div className="relative">
              <select
                value={countryCode}
                onChange={(e) => { setCountryCode(e.target.value); setMethodId(""); }}
                className="w-full appearance-none bg-card2 border border-border rounded-btn pl-4 pr-10 py-3 text-sm text-offwhite focus:border-accent focus:outline-none"
              >
                {P2P_COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name} ({c.currency})
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
            </div>
          </div>

          {/* Amount */}
          <div>
            <p className="text-xs text-muted uppercase tracking-wide mb-2">Amount (USD)</p>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-xl">$</span>
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-card2 border border-border rounded-btn pl-10 pr-4 py-4 text-2xl font-mono text-white focus:border-accent focus:outline-none"
              />
            </div>
            {amount && parseFloat(amount) > 0 && (
              <p className="text-xs text-muted mt-1.5">
                ≈ {country.currencySymbol}{parseFloat(localAmount).toLocaleString()} {country.currency}
                <span className="ml-1 text-muted2">(rate: {country.usdRate} {country.currency}/USD)</span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[50, 100, 200, 500].map((p) => (
              <button
                key={p}
                onClick={() => setAmount(String(p))}
                className={cn(
                  "py-2 rounded-xl text-sm font-mono border transition-all",
                  amount === String(p)
                    ? "bg-accent/15 border-accent text-accent"
                    : "bg-card border-border text-muted hover:border-accent/40"
                )}
              >
                ${p}
              </button>
            ))}
          </div>

          <Button variant="primary" size="lg" fullWidth disabled={!amount || parseFloat(amount) <= 0} onClick={() => setStep(2)}>
            Continue →
          </Button>
        </div>
      )}

      {/* Step 2: Payment method */}
      {step === 2 && (
        <div className="space-y-4">
          <div>
            <p className="text-xs text-muted uppercase tracking-wide mb-3">
              {country.name} — Select payment method
            </p>
            <div className="space-y-2 max-h-52 overflow-y-auto">
              {country.methods.map((m) => {
                const typeLabel = m.type === "bank" ? "Bank Transfer" : m.type === "mobile_money" ? "Mobile Money" : "Digital Wallet";
                const typeColor = m.type === "bank" ? "text-accent2" : m.type === "mobile_money" ? "text-green" : "text-gold";
                return (
                  <button
                    key={m.id}
                    onClick={() => setMethodId(m.id)}
                    className={cn(
                      "w-full text-left flex items-center gap-3 p-3 rounded-xl border transition-all",
                      methodId === m.id
                        ? "bg-accent/10 border-accent"
                        : "bg-card border-border hover:border-accent/40"
                    )}
                  >
                    <div className="flex-1">
                      <p className="text-sm text-offwhite font-medium">{m.name}</p>
                      <p className={cn("text-xs", typeColor)}>{typeLabel}</p>
                    </div>
                    {methodId === m.id && <Check size={14} className="text-accent" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="md" onClick={() => setStep(1)}>← Back</Button>
            <Button variant="primary" size="md" className="flex-1" disabled={!methodId} onClick={() => setStep(3)}>
              Find Merchant →
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Merchant bank details */}
      {step === 3 && (
        <div className="space-y-4">
          {/* Merchant header */}
          <div className="bg-card2 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-white">{MOCK_MERCHANT.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-gold text-xs">★ {MOCK_MERCHANT.rating}</span>
                  <span className="text-muted2 text-xs">·</span>
                  <span className="text-muted text-xs">{MOCK_MERCHANT.trades.toLocaleString()} trades</span>
                </div>
              </div>
              <Badge variant="green">Verified</Badge>
            </div>

            {/* Timer */}
            <div className="flex items-center gap-2 bg-card rounded-lg px-3 py-2">
              <Clock size={12} className="text-muted" />
              <span className="text-xs text-muted">Payment window:</span>
              <CountdownTimer minutes={MOCK_MERCHANT.timeLimit} />
              <span className="text-xs text-muted">remaining</span>
            </div>
          </div>

          {/* Transfer summary */}
          <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 text-center">
            <p className="text-xs text-muted mb-1">
              {type === "deposit" ? "You send (local currency)" : "You receive (local currency)"}
            </p>
            <p className="font-mono font-black text-2xl text-white">
              {country.currencySymbol}{parseFloat(localAmount).toLocaleString()} {country.currency}
            </p>
            <p className="text-xs text-muted mt-0.5">= ${parseFloat(amount).toFixed(2)} USDC</p>
          </div>

          {/* Bank details */}
          {type === "deposit" && (
            <div className="space-y-1">
              <p className="text-xs text-muted uppercase tracking-wide mb-3">
                Send to this account
              </p>
              {[
                { label: "Bank", value: MOCK_MERCHANT.bank },
                { label: "Account Number", value: MOCK_MERCHANT.accountNumber },
                { label: "Account Name", value: MOCK_MERCHANT.accountName },
                { label: "Reference", value: MOCK_MERCHANT.reference },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between bg-card2 rounded-xl px-4 py-3">
                  <div>
                    <p className="text-xs text-muted mb-0.5">{label}</p>
                    <p className={cn("font-mono text-sm", label === "Reference" ? "text-gold font-bold" : "text-offwhite")}>
                      {value}
                    </p>
                  </div>
                  <button
                    onClick={() => copyField(value, label)}
                    className="text-muted hover:text-offwhite transition-colors"
                  >
                    {copied === label ? <Check size={14} className="text-green" /> : <Copy size={14} />}
                  </button>
                </div>
              ))}
            </div>
          )}

          {type === "withdraw" && (
            <div className="bg-card2 rounded-xl p-4">
              <p className="text-xs text-muted uppercase tracking-wide mb-3">Withdrawal confirmed</p>
              <p className="text-sm text-offwhite">
                Merchant will send <span className="text-white font-mono font-bold">{country.currencySymbol}{parseFloat(localAmount).toLocaleString()}</span> to your {country.name} account within 30 minutes.
              </p>
            </div>
          )}

          {/* Warning */}
          <div className="flex items-start gap-2 text-xs text-amber-400">
            <AlertCircle size={12} className="mt-0.5 shrink-0" />
            <span>
              {type === "deposit"
                ? "Include the reference code in your transfer. Do not send until you confirm this."
                : "Funds will be released from escrow once merchant confirms receipt."}
            </span>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="md" onClick={() => setStep(2)}>← Back</Button>
            <Button
              variant="primary"
              size="md"
              className="flex-1"
              loading={loading}
              onClick={handleConfirm}
            >
              {type === "deposit" ? "I've Sent the Payment" : "Confirm Withdrawal"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

const MOCK_SOLANA_ADDRESS = "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU";

function ReceivePanel({ address, onClose }: { address: string; onClose: () => void }) {
  const [chain, setChain] = useState<"mantle" | "solana">("mantle");
  const [copied, setCopied] = useState(false);
  const displayAddress = chain === "mantle" ? address : MOCK_SOLANA_ADDRESS;
  const copy = () => {
    navigator.clipboard.writeText(displayAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <h3 className="font-syne font-bold text-white">Receive / Import Tokens</h3>
        <button onClick={onClose} className="text-muted hover:text-offwhite text-xl leading-none">&times;</button>
      </div>
      <div>
        <p className="text-xs text-muted uppercase tracking-wide mb-2">Select Network</p>
        <InlineChainSelector value={chain} onChange={(c) => { setChain(c); setCopied(false); }} />
      </div>
      <p className="text-sm text-muted leading-relaxed">
        Send tokens to your Harvest.rwa smart wallet on {chain === "mantle" ? "Mantle Network" : "Solana"}. {chain === "mantle" ? "Any ERC-20 token" : "Any SPL token"} sent to this address will appear in your holdings.
      </p>
      <div>
        <p className="text-xs text-muted uppercase tracking-wide mb-2">
          Your Wallet Address ({chain === "mantle" ? "Mantle" : "Solana"})
        </p>
        <div className="flex items-center gap-2 bg-card2 border border-border rounded-xl px-4 py-3">
          <code className="flex-1 font-mono text-sm text-offwhite break-all">{displayAddress}</code>
          <button onClick={copy} className="shrink-0 text-muted hover:text-offwhite transition-colors">
            {copied ? <Check size={14} className="text-green" /> : <Copy size={14} />}
          </button>
        </div>
        {copied && <p className="text-xs text-green mt-1.5">Address copied to clipboard</p>}
      </div>
      <div className="flex items-start gap-2 bg-amber-400/5 border border-amber-400/20 rounded-xl px-4 py-3">
        <AlertCircle size={12} className="text-amber-400 mt-0.5 shrink-0" />
        <p className="text-xs text-amber-400/90 leading-relaxed">
          {chain === "mantle"
            ? "Only send Mantle-compatible tokens to this address. Tokens sent from other networks will be lost."
            : "Only send Solana SPL tokens to this address. Tokens sent from other networks will be lost."}
        </p>
      </div>
    </div>
  );
}

const MOCK_SEED_WORDS = [
  "galaxy", "marble", "harvest", "orange", "river", "summit",
  "velvet", "anchor", "temple", "frozen", "canvas", "bridge",
];
// EVM 256-bit private key (64 hex chars prefixed with 0x)
const MOCK_PRIVKEY_MANTLE = "0x4a7f3d8c9b2a1e4f6d0c5b8a9e3f2d1c7b4e8a9f3d2c1b7e4f6d0c5b8a9e3f2d";
// Solana 64-byte keypair encoded as base58 (~88 chars) — different key from EVM
const MOCK_PRIVKEY_SOLANA = "5KjBzP9mNxA3TqGsHcYvWrLdFuE7kQe2nVtX8oDw4MiCRb6yJpZ1hUfgS0lKm9TzaNxB4vWrLdFu3kQeP2n";

export default function WalletPage() {
  const blocked = useAuthGuard("/wallet");
  const user = MOCK_USER;
  const [copied, setCopied] = useState(false);
  const [activePanel, setActivePanel] = useState<PanelType>(null);
  const [walletChain, setWalletChain] = useState<"mantle" | "solana">("mantle");
  const [showSeed, setShowSeed] = useState(false);
  const [showPrivKey, setShowPrivKey] = useState(false);
  const [secCopied, setSecCopied] = useState<"seed" | "key" | "sol" | null>(null);

  if (blocked) return null;

  const copyAddress = () => {
    const addr = walletChain === "mantle" ? user.walletAddress : MOCK_SOLANA_ADDRESS;
    navigator.clipboard.writeText(addr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const txIcon: Record<string, React.ElementType> = {
    deposit: ArrowDownLeft,
    withdrawal: ArrowUpRight,
    investment: ArrowUpRight,
    yield: ArrowDownLeft,
    secondary: ArrowDownLeft,
  };

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="font-syne font-black text-3xl text-white">Wallet</h1>

        {/* Balance card */}
        {(() => {
          const tokenTotal = MOCK_PORTFOLIO.reduce((s, h) => s + h.currentValue, 0);
          const netWorth = user.balance + tokenTotal;
          return (
            <div className="bg-gradient-to-br from-accent/15 via-card to-accent2/5 border border-accent/20 rounded-2xl p-8">
              {/* Net worth headline */}
              <p className="text-sm text-muted text-center mb-1">Total Net Worth</p>
              <p className="font-mono font-black text-5xl text-white text-center mb-5">
                {formatUSD(netWorth)}
              </p>

              {/* Breakdown bar */}
              <div className="flex rounded-xl overflow-hidden h-1.5 mb-4">
                <div
                  className="bg-accent transition-all"
                  style={{ width: `${(tokenTotal / netWorth) * 100}%` }}
                />
                <div
                  className="bg-accent2"
                  style={{ width: `${(user.balance / netWorth) * 100}%` }}
                />
              </div>

              {/* Breakdown labels */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-card/60 rounded-xl p-4 text-center border border-accent/10">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
                    <p className="text-xs text-muted">Token Assets</p>
                  </div>
                  <p className="font-mono font-bold text-lg text-white">{formatUSD(tokenTotal)}</p>
                  <p className="text-[10px] text-muted mt-0.5">{MOCK_PORTFOLIO.length} holdings</p>
                </div>
                <div className="bg-card/60 rounded-xl p-4 text-center border border-accent2/10">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full bg-accent2 shrink-0" />
                    <p className="text-xs text-muted">USDC Cash</p>
                  </div>
                  <p className="font-mono font-bold text-lg text-accent2">{formatUSD(user.balance)}</p>
                  <p className="text-[10px] text-muted mt-0.5">Available to spend</p>
                </div>
              </div>

              <div className="flex justify-center gap-3 flex-wrap">
                <Button variant="primary" size="md" onClick={() => setActivePanel(activePanel === "deposit" ? null : "deposit")}>
                  <Plus size={14} /> Add Funds
                </Button>
                <Button variant="secondary" size="md" onClick={() => setActivePanel(activePanel === "withdraw" ? null : "withdraw")}>
                  <ArrowUpRight size={14} /> Withdraw
                </Button>
                <Button variant="secondary" size="md" onClick={() => setActivePanel(activePanel === "send" ? null : "send")}>
                  <Send size={14} /> Send Tokens
                </Button>
              </div>
            </div>
          );
        })()}

        {/* Panels */}
        {activePanel === "send" && (
          <div className="bg-card border border-border rounded-card p-6">
            <SendPanel onClose={() => setActivePanel(null)} />
          </div>
        )}
        {(activePanel === "deposit" || activePanel === "withdraw") && (
          <div className="bg-card border border-border rounded-card p-6">
            <P2PPanel type={activePanel} onClose={() => setActivePanel(null)} />
          </div>
        )}
        {activePanel === "receive" && (
          <div className="bg-card border border-border rounded-card p-6">
            <ReceivePanel address={user.walletAddress} onClose={() => setActivePanel(null)} />
          </div>
        )}

        {/* Smart wallet addresses — per network */}
        <div className="bg-card border border-border rounded-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Wallet size={14} className="text-muted" />
            <h3 className="text-sm font-medium text-white">Wallet Addresses</h3>
          </div>

          {/* Network selector */}
          <div className="flex gap-2 mb-4">
            {([
              { id: "mantle", label: "Mantle", color: "#3B9EFF", bg: "rgba(59,158,255,0.12)", border: "rgba(59,158,255,0.35)" },
              { id: "solana", label: "Solana", color: "#9945FF", bg: "rgba(153,69,255,0.12)", border: "rgba(153,69,255,0.35)" },
            ] as const).map((n) => (
              <button
                key={n.id}
                onClick={() => { setWalletChain(n.id); setCopied(false); }}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all",
                  walletChain !== n.id && "bg-card border-border text-muted hover:border-accent/30"
                )}
                style={walletChain === n.id ? { background: n.bg, borderColor: n.border, color: n.color } : undefined}
              >
                {n.id === "mantle" ? (
                  <img src="/mantle-logo.svg" alt="Mantle" width={12} height={12} style={{width:12,height:12}} />
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M6.5 15.5h9l-2 2h-9l2-2z" fill="#9945FF"/>
                    <path d="M6.5 11.5h9l-2 2h-9l2-2z" fill="#9945FF" fillOpacity="0.7"/>
                    <path d="M6.5 7.5h9l-2 2h-9l2-2z" fill="#14F195"/>
                  </svg>
                )}
                {n.label}
              </button>
            ))}
          </div>

          <p className="text-xs text-muted mb-2 uppercase tracking-wide">
            Your {walletChain === "mantle" ? "Mantle (EVM)" : "Solana"} Address
          </p>
          <div className="flex items-center gap-2 bg-card2 rounded-xl px-4 py-3">
            <code className="flex-1 font-mono text-sm text-offwhite break-all">
              {walletChain === "mantle" ? user.walletAddress : MOCK_SOLANA_ADDRESS}
            </code>
            <button onClick={copyAddress} className="shrink-0 text-muted hover:text-offwhite transition-colors">
              {copied ? <Check size={14} className="text-green" /> : <Copy size={14} />}
            </button>
            <button className="shrink-0 text-muted hover:text-offwhite transition-colors">
              <ExternalLink size={14} />
            </button>
          </div>
          {copied && <p className="text-xs text-green mt-1.5">Copied to clipboard</p>}
          <div className="flex items-center gap-2 mt-3 text-xs text-muted">
            <Shield size={11} className="text-green" />
            <span>Secured by AWS CloudHSM · Gas fees absorbed by Harvest.rwa</span>
          </div>
        </div>

        {/* Idle yield */}
        <div className="bg-card border border-border rounded-card p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green/10 border border-green/20 flex items-center justify-center">
              <Zap size={16} className="text-green" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Auto-Yield</p>
              <p className="text-xs text-muted">Earn ~3.4% APY on idle USDC via Aave (Mantle) / DeFi yield protocols</p>
            </div>
          </div>
          <button className="w-11 h-6 rounded-full bg-border relative transition-colors hover:bg-accent/30">
            <span className="w-5 h-5 rounded-full bg-muted absolute top-0.5 left-0.5 transition-transform" />
          </button>
        </div>

        {/* Backup & Security */}
        <div className="bg-card border border-border rounded-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Key size={14} className="text-muted" />
            <h3 className="text-sm font-medium text-white">Backup &amp; Security</h3>
            <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full border"
              style={{ background: "rgba(249,168,37,0.1)", borderColor: "rgba(249,168,37,0.25)", color: "#F9A825" }}>
              Sensitive
            </span>
          </div>

          <div className="space-y-4">
            {/* Seed phrase */}
            <div className="bg-card2 rounded-xl p-4">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <p className="text-sm font-medium text-offwhite">Recovery Seed Phrase</p>
                  <p className="text-xs text-muted">12 words that restore your wallet on any device</p>
                </div>
                <button
                  onClick={() => setShowSeed(!showSeed)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs text-muted hover:text-offwhite hover:border-accent/30 transition-all shrink-0 ml-3"
                >
                  {showSeed ? <EyeOff size={11} /> : <Eye size={11} />}
                  {showSeed ? "Hide" : "Reveal"}
                </button>
              </div>

              {showSeed && (
                <div className="mt-3 space-y-3 animate-fade-in">
                  <div className="flex items-start gap-2 bg-amber-400/5 border border-amber-400/20 rounded-xl px-3 py-2.5">
                    <AlertCircle size={11} className="text-amber-400 mt-0.5 shrink-0" />
                    <p className="text-[11px] text-amber-400/90 leading-relaxed">
                      Never share this with anyone. Anyone with these words can access your wallet.
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {MOCK_SEED_WORDS.map((word, i) => (
                      <div key={i} className="bg-card border border-border rounded-lg px-3 py-2 flex items-center gap-2">
                        <span className="text-[10px] text-muted w-4 shrink-0">{i + 1}.</span>
                        <span className="text-sm font-mono text-offwhite">{word}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(MOCK_SEED_WORDS.join(" "));
                      setSecCopied("seed");
                      setTimeout(() => setSecCopied(null), 2000);
                    }}
                    className="flex items-center gap-1.5 text-xs text-muted hover:text-offwhite transition-colors"
                  >
                    {secCopied === "seed" ? <Check size={11} className="text-green" /> : <Copy size={11} />}
                    {secCopied === "seed" ? "Copied" : "Copy all words"}
                  </button>
                </div>
              )}
            </div>

            {/* Mantle private key */}
            <div className="bg-card2 rounded-xl p-4">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <p className="text-sm font-medium text-offwhite">Mantle Private Key</p>
                  <p className="text-xs text-muted">EVM · 256-bit hex key</p>
                </div>
                <button
                  onClick={() => setShowPrivKey(!showPrivKey)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs text-muted hover:text-offwhite hover:border-accent/30 transition-all shrink-0 ml-3"
                >
                  {showPrivKey ? <EyeOff size={11} /> : <Eye size={11} />}
                  {showPrivKey ? "Hide" : "Reveal"}
                </button>
              </div>

              {showPrivKey && (
                <div className="mt-3 space-y-3 animate-fade-in">
                  <div className="flex items-start gap-2 bg-red/5 border border-red/20 rounded-xl px-3 py-2.5">
                    <AlertCircle size={11} className="text-red mt-0.5 shrink-0" />
                    <p className="text-[11px] text-red/90 leading-relaxed">
                      Full control of your Mantle wallet. Never share or paste on any website.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-3">
                    <code className="flex-1 font-mono text-xs text-offwhite break-all">{MOCK_PRIVKEY_MANTLE}</code>
                    <button
                      onClick={() => { navigator.clipboard.writeText(MOCK_PRIVKEY_MANTLE); setSecCopied("key"); setTimeout(() => setSecCopied(null), 2000); }}
                      className="shrink-0 text-muted hover:text-offwhite transition-colors"
                    >
                      {secCopied === "key" ? <Check size={13} className="text-green" /> : <Copy size={13} />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Solana private key — separate key from EVM */}
            <div className="bg-card2 rounded-xl p-4">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <p className="text-sm font-medium text-offwhite">Solana Private Key</p>
                  <p className="text-xs text-muted">Solana · 64-byte base58 keypair</p>
                </div>
                <button
                  onClick={() => setShowPrivKey(!showPrivKey)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs text-muted hover:text-offwhite hover:border-accent/30 transition-all shrink-0 ml-3"
                >
                  {showPrivKey ? <EyeOff size={11} /> : <Eye size={11} />}
                  {showPrivKey ? "Hide" : "Reveal"}
                </button>
              </div>

              {showPrivKey && (
                <div className="mt-3 space-y-3 animate-fade-in">
                  <div className="flex items-start gap-2 bg-red/5 border border-red/20 rounded-xl px-3 py-2.5">
                    <AlertCircle size={11} className="text-red mt-0.5 shrink-0" />
                    <p className="text-[11px] text-red/90 leading-relaxed">
                      Full control of your Solana wallet. Different from your EVM key. Never share or paste on any website.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-3">
                    <code className="flex-1 font-mono text-xs text-offwhite break-all">{MOCK_PRIVKEY_SOLANA}</code>
                    <button
                      onClick={() => { navigator.clipboard.writeText(MOCK_PRIVKEY_SOLANA); setSecCopied("sol"); setTimeout(() => setSecCopied(null), 2000); }}
                      className="shrink-0 text-muted hover:text-offwhite transition-colors"
                    >
                      {secCopied === "sol" ? <Check size={13} className="text-green" /> : <Copy size={13} />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Token Holdings */}
        <div className="bg-card border border-border rounded-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="font-syne font-bold text-white">Token Holdings</h3>
              <p className="text-xs text-muted mt-0.5">
                {MOCK_PORTFOLIO.length} assets · Total value{" "}
                <span className="text-offwhite font-mono">
                  {formatUSD(MOCK_PORTFOLIO.reduce((s, h) => s + h.currentValue, 0))}
                </span>
              </p>
            </div>
            <Link href="/portfolio" className="text-xs text-accent hover:text-accent/80 transition-colors">
              Full portfolio →
            </Link>
          </div>
          <div className="divide-y divide-border">
            {MOCK_PORTFOLIO.map((holding) => {
              const pnl = holding.currentValue - holding.purchaseValue;
              const pnlPct = (pnl / holding.purchaseValue) * 100;
              const monthlyYield = (holding.currentValue * holding.annualYieldPercent) / 100 / 12;
              const daysToNext = Math.ceil(
                (new Date(holding.nextPayout).getTime() - Date.now()) / 86400000
              );
              return (
                <Link
                  key={holding.assetId}
                  href={`/asset/${holding.assetId}`}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-card2/50 transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">
                    <Image src={holding.assetImage} alt={holding.assetName} fill className="object-cover" />
                  </div>

                  {/* Name + category */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-offwhite truncate">{holding.assetName}</p>
                    <p className="text-xs text-muted truncate">
                      {CATEGORY_LABELS[holding.category] ?? holding.category}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono text-muted2">
                        {holding.tokens.toLocaleString()} tokens
                      </span>
                      <span className="text-muted2">·</span>
                      <span className="text-[10px] text-muted">
                        Next payout in {daysToNext}d
                      </span>
                    </div>
                  </div>

                  {/* Value + yield */}
                  <div className="text-right shrink-0">
                    <p className="font-mono font-bold text-sm text-white">
                      {formatUSD(holding.currentValue)}
                    </p>
                    <p className={cn(
                      "text-xs font-mono",
                      pnl >= 0 ? "text-green" : "text-red"
                    )}>
                      {pnl >= 0 ? "+" : ""}{pnlPct.toFixed(2)}%
                    </p>
                    <div className="flex items-center gap-1 justify-end mt-0.5">
                      <TrendingUp size={9} className="text-green" />
                      <span className="text-[10px] text-green font-mono">
                        {formatUSD(monthlyYield)}/mo
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          {/* Receive from external wallet */}
          <div className="px-5 py-4 border-t border-border flex items-center justify-between bg-card2/30">
            <div className="flex items-center gap-2">
              <Info size={12} className="text-muted" />
              <p className="text-xs text-muted">Have tokens in an external wallet?</p>
            </div>
            <button
              onClick={() => setActivePanel(activePanel === "receive" ? null : "receive")}
              className="text-xs text-accent hover:text-accent/80 transition-colors font-medium"
            >
              Import / Receive →
            </button>
          </div>
        </div>

        {/* Transaction history */}
        <div className="bg-card border border-border rounded-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="font-syne font-bold text-white">Transaction History</h3>
          </div>
          <div className="divide-y divide-border">
            {MOCK_TRANSACTIONS.map((tx) => {
              const Icon = txIcon[tx.type] || ArrowDownLeft;
              const isPositive = tx.amount > 0;
              return (
                <div key={tx.id} className="px-5 py-4 flex items-center gap-4 hover:bg-card2/50 transition-colors">
                  <div className={cn(
                    "w-9 h-9 rounded-xl border flex items-center justify-center shrink-0",
                    isPositive ? "bg-green/10 border-green/20" : "bg-red/10 border-red/20"
                  )}>
                    <Icon size={14} className={isPositive ? "text-green" : "text-red"} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-offwhite truncate">{tx.description}</p>
                    <p className="text-xs text-muted">{timeAgo(tx.createdAt)}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={cn("font-mono font-medium text-sm", isPositive ? "text-green" : "text-red")}>
                      {isPositive ? "+" : ""}{formatUSD(tx.amount)}
                    </p>
                    <p className="text-[10px] text-muted">{tx.currency}</p>
                  </div>
                  {tx.txHash && (
                    <button className="shrink-0 text-muted hover:text-accent transition-colors">
                      <ExternalLink size={12} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
