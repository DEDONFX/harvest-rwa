"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, Check, ArrowLeft } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import Button from "@/components/ui/Button";
import { MOCK_PORTFOLIO } from "@/lib/mock-data";
import { useAuthGuard } from "@/components/AuthGuard";
import { cn } from "@/lib/utils";

export default function SendTokensPage() {
  const blocked = useAuthGuard("/send-tokens");
  const [selectedToken, setSelectedToken] = useState("0"); // index
  const [amount, setAmount] = useState("");
  const [destination, setDestination] = useState("");
  const [kycVerified, setKycVerified] = useState<null | boolean>(null);
  const [verifying, setVerifying] = useState(false);
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);

  if (blocked) return null;

  const holding = MOCK_PORTFOLIO[parseInt(selectedToken)];

  const handleVerify = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setKycVerified(/^0x[0-9a-fA-F]{40}$/.test(destination.trim()));
    }, 900);
  };

  const handleSend = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setDone(true);
    }, 1800);
  };

  if (done) {
    return (
      <AppShell showContextStrip={false} showRightRail={false}>
        <div className="max-w-md mx-auto text-center py-20 space-y-4">
          <div className="w-16 h-16 rounded-full bg-green/15 border border-green/30 flex items-center justify-center mx-auto">
            <Check className="text-green" size={28} />
          </div>
          <div>
            <p className="font-syne font-black text-2xl text-white mb-2">Tokens Sent</p>
            <p className="text-sm text-muted">
              {amount} {holding.assetName} tokens transferred on Mantle Network.
            </p>
          </div>
          <Link href="/wallet">
            <Button variant="primary">Back to Wallet</Button>
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell showContextStrip={false} showRightRail={false}>
      <div className="max-w-lg mx-auto">
        <Link href="/wallet" className="inline-flex items-center gap-2 text-muted text-sm hover:text-offwhite mb-6 transition-colors">
          <ArrowLeft size={14} /> Wallet
        </Link>

        <h1 className="font-syne font-black text-3xl text-white mb-1">Send Tokens Out</h1>
        <p className="text-sm text-muted mb-6">To a verified external Mantle wallet</p>

        {/* ERC-1400 Warning */}
        <div className="flex items-start gap-3 bg-amber-400/5 border border-amber-400/20 rounded-xl px-4 py-3 mb-6">
          <AlertTriangle size={13} className="text-amber-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-bold text-amber-400 uppercase tracking-wide mb-1">ERC-1400 Transfer Restriction</p>
            <p className="text-xs text-amber-400/80 leading-relaxed">
              Tokens can only transfer to KYC-verified Mantle addresses. Yield continues distributing to tokens wherever held.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Token selector */}
          <div>
            <label className="text-xs text-muted uppercase tracking-wide block mb-2">Select Token</label>
            <select
              value={selectedToken}
              onChange={(e) => setSelectedToken(e.target.value)}
              className="w-full bg-card2 border border-border rounded-btn px-4 py-3 text-sm text-offwhite focus:border-accent focus:outline-none appearance-none"
            >
              {MOCK_PORTFOLIO.map((h, i) => (
                <option key={h.assetId} value={String(i)}>
                  {h.assetName} — {h.tokens.toLocaleString()} tokens
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-muted uppercase tracking-wide">Amount</label>
              <button onClick={() => setAmount(String(holding.tokens))} className="text-xs text-accent hover:text-accent/80">
                Max: {holding.tokens.toLocaleString()}
              </button>
            </div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full bg-card2 border border-border rounded-btn px-4 py-3 text-sm font-mono text-offwhite focus:border-accent focus:outline-none"
            />
          </div>

          {/* Destination */}
          <div>
            <label className="text-xs text-muted uppercase tracking-wide block mb-2">Destination (Mantle)</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => { setDestination(e.target.value); setKycVerified(null); }}
              placeholder="0x..."
              className={cn(
                "w-full bg-card2 border rounded-btn px-4 py-3 text-sm font-mono text-offwhite focus:outline-none transition-colors",
                kycVerified === true ? "border-green/60" : kycVerified === false ? "border-red/60" : "border-border focus:border-accent"
              )}
            />
          </div>

          {/* KYC result */}
          {kycVerified === true && (
            <div className="flex items-center gap-2 bg-green/5 border border-green/20 rounded-xl px-4 py-3">
              <Check size={13} className="text-green" />
              <p className="text-xs text-green">Destination is KYC-verified. Transfer permitted.</p>
            </div>
          )}
          {kycVerified === false && (
            <div className="flex items-center gap-2 bg-red/5 border border-red/20 rounded-xl px-4 py-3">
              <AlertTriangle size={13} className="text-red" />
              <p className="text-xs text-red">Address not found in KYC registry or invalid format.</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant="secondary"
              size="md"
              loading={verifying}
              onClick={handleVerify}
              disabled={!destination}
            >
              Verify Address
            </Button>
            <Button
              variant="primary"
              size="md"
              className="flex-1"
              loading={sending}
              onClick={handleSend}
              disabled={!kycVerified || !amount || parseFloat(amount) <= 0}
            >
              Send Tokens →
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
