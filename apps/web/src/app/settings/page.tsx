"use client";

import { useState } from "react";
import { useAuthGuard } from "@/components/AuthGuard";
import { clearAuth } from "@/lib/auth";
import Link from "next/link";
import {
  User, Shield, Bell, Wallet, LogOut, ChevronRight, CheckCircle,
  Copy, Check, ExternalLink, AlertTriangle, Eye, EyeOff, Edit2,
  Smartphone, Mail, Globe, Lock, Key, ArrowRight
} from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import Button from "@/components/ui/Button";
import { MOCK_USER } from "@/lib/mock-data";
import { truncateAddress } from "@/lib/utils";
import { cn } from "@/lib/utils";

type ActiveSection = "profile" | "security" | "notifications" | "wallet" | "kyc";

const SECTION_NAV = [
  { id: "profile" as const, label: "Profile", icon: User },
  { id: "security" as const, label: "Security", icon: Shield },
  { id: "notifications" as const, label: "Notifications", icon: Bell },
  { id: "wallet" as const, label: "Wallet & Withdrawals", icon: Wallet },
  { id: "kyc" as const, label: "Identity & KYC", icon: Shield },
];

const KYC_TIER_CONFIG = [
  { tier: 0, label: "Not Verified", color: "text-red", bg: "bg-red/10", limit: "Cannot invest" },
  { tier: 1, label: "Tier 1 Verified", color: "text-accent2", bg: "bg-[rgba(0,210,255,0.1)]", limit: "$1,000/tx" },
  { tier: 2, label: "Tier 2 Verified", color: "text-green", bg: "bg-green/10", limit: "Unlimited" },
  { tier: 3, label: "Tier 3 — Corporate", color: "text-gold", bg: "bg-gold/10", limit: "Unlimited + institutional" },
];

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h2 className="font-syne font-bold text-white text-sm">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function ToggleRow({ label, desc, checked, onChange }: {
  label: string; desc?: string; checked: boolean; onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div>
        <p className="text-sm text-offwhite">{label}</p>
        {desc && <p className="text-xs text-muted mt-0.5">{desc}</p>}
      </div>
      <button
        onClick={onChange}
        className={cn(
          "relative w-11 h-6 rounded-full transition-colors",
          checked ? "bg-accent" : "bg-card2"
        )}
      >
        <div className={cn(
          "absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-6" : "translate-x-1"
        )} />
      </button>
    </div>
  );
}

function WithdrawTokenPanel({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [address, setAddress] = useState("");
  const [asset, setAsset] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 2000);
  };

  if (done) {
    return (
      <div className="text-center space-y-4 py-4">
        <div className="w-14 h-14 rounded-full bg-green/15 border border-green/30 flex items-center justify-center mx-auto">
          <CheckCircle size={24} className="text-green" />
        </div>
        <div>
          <p className="font-syne font-bold text-white text-lg mb-1">Withdrawal Initiated</p>
          <p className="text-sm text-muted">Tokens will appear in your external wallet within 2 minutes.</p>
        </div>
        <Button variant="secondary" onClick={onClose}>Close</Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-syne font-bold text-white">Withdraw Tokens to External Wallet</h3>
        <button onClick={onClose} className="text-muted hover:text-offwhite text-xl leading-none">×</button>
      </div>

      {/* Legal warning */}
      <div className="bg-[rgba(249,168,37,0.06)] border border-gold/20 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle size={14} className="text-gold mt-0.5 shrink-0" />
        <div className="space-y-1">
          <p className="text-xs font-medium text-gold">Important — Read Before Proceeding</p>
          <p className="text-xs text-muted leading-relaxed">
            Your destination wallet must be KYC-verified on Harvest.rwa (ERC-1400 legal requirement). Yield continues flowing to your external address, but you'll need to connect that wallet to claim it. This action cannot be reversed.
          </p>
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted uppercase tracking-wide block mb-2">Select Token</label>
            <select
              value={asset}
              onChange={(e) => setAsset(e.target.value)}
              className="w-full appearance-none bg-card2 border border-border rounded-xl px-4 py-3 text-sm text-offwhite focus:border-accent focus:outline-none"
            >
              <option value="">Choose a token…</option>
              <option value="hvst-lcp">HVST-LCP — Lisbon Commercial Property (350 tokens)</option>
              <option value="hvst-brs">HVST-BRS — Brazil Solar Infrastructure (200 tokens)</option>
              <option value="hvst-ukc">HVST-UKC — UK Credit Fund (100 tokens)</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted uppercase tracking-wide block mb-2">Amount (tokens)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full bg-card2 border border-border rounded-xl px-4 py-3 text-sm text-offwhite placeholder:text-muted2 focus:border-accent focus:outline-none"
            />
          </div>
          <Button variant="primary" fullWidth disabled={!asset || !amount} onClick={() => setStep(2)}>
            Continue →
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted uppercase tracking-wide block mb-2">Destination Wallet Address</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0x…"
              className="w-full bg-card2 border border-border rounded-xl px-4 py-3 text-sm font-mono text-offwhite placeholder:text-muted2 focus:border-accent focus:outline-none"
            />
            <p className="text-[10px] text-muted mt-1.5">Must be a Mantle Network address registered with KYCRegistry</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(1)}>← Back</Button>
            <Button variant="primary" className="flex-1" disabled={!address} onClick={() => setStep(3)}>
              Review
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div className="bg-card2 rounded-xl p-4 space-y-2 text-sm">
            {[
              { label: "Token", value: asset.toUpperCase() },
              { label: "Amount", value: `${amount} tokens` },
              { label: "To", value: address ? `${address.slice(0, 10)}…${address.slice(-8)}` : "—" },
              { label: "Gas fee", value: "$0.00 (absorbed)" },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between">
                <span className="text-muted">{label}</span>
                <span className="text-offwhite font-mono">{value}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(2)}>← Back</Button>
            <Button variant="danger" className="flex-1" loading={loading} onClick={handleSubmit}>
              Confirm Withdrawal
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SettingsPage() {
  const blocked = useAuthGuard("/settings");
  const user = MOCK_USER;
  const [section, setSection] = useState<ActiveSection>("profile");
  const [copied, setCopied] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [editName, setEditName] = useState(false);
  const [name, setName] = useState(user.name);

  // Notification toggles
  const [notifToggles, setNotifToggles] = useState({
    yieldDistributions: true,
    newLaunches: true,
    milestones: false,
    p2pUpdates: true,
    aiReports: true,
    marketing: false,
  });
  const toggleNotif = (k: keyof typeof notifToggles) =>
    setNotifToggles((t) => ({ ...t, [k]: !t[k] }));

  if (blocked) return null;

  const copyAddress = () => {
    navigator.clipboard.writeText(user.walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const kycConfig = KYC_TIER_CONFIG[user.kycTier];

  return (
    <AppShell showRightRail={false}>
      <div className="max-w-3xl mx-auto">
        <h1 className="font-syne font-black text-2xl text-white mb-6">Settings</h1>

        <div className="flex gap-6">
          {/* Sidebar nav */}
          <div className="w-48 shrink-0 space-y-1">
            {SECTION_NAV.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setSection(id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left",
                  section === id
                    ? "bg-accent/15 text-accent border border-accent/30"
                    : "text-muted hover:text-offwhite hover:bg-card2"
                )}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}

            <div className="pt-4">
              <button
                onClick={() => { clearAuth(); window.location.href = "/"; }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red hover:bg-red/10 transition-all text-left"
              >
                <LogOut size={14} />
                Sign out
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-4">

            {/* ── Profile ──────────────────────────────────────────────── */}
            {section === "profile" && (
              <>
                <SectionCard title="Personal Information">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 pb-4 border-b border-border">
                      <div className="w-16 h-16 rounded-2xl bg-accent/20 border border-accent/30 flex items-center justify-center text-accent font-black font-syne text-2xl">
                        {name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-syne font-bold text-white">{name}</p>
                        <p className="text-sm text-muted">{user.email}</p>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-muted uppercase tracking-wide block mb-2">Full Name</label>
                      {editName ? (
                        <div className="flex gap-2">
                          <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="flex-1 bg-card2 border border-border rounded-xl px-4 py-2.5 text-sm text-offwhite focus:border-accent focus:outline-none"
                          />
                          <Button variant="primary" size="sm" onClick={() => setEditName(false)}>Save</Button>
                          <Button variant="ghost" size="sm" onClick={() => { setName(user.name); setEditName(false); }}>Cancel</Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between bg-card2 border border-border rounded-xl px-4 py-2.5">
                          <span className="text-sm text-offwhite">{name}</span>
                          <button onClick={() => setEditName(true)} className="text-muted hover:text-accent transition-colors">
                            <Edit2 size={13} />
                          </button>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-xs text-muted uppercase tracking-wide block mb-2">Email</label>
                      <div className="flex items-center justify-between bg-card2 border border-border rounded-xl px-4 py-2.5">
                        <span className="text-sm text-offwhite">{user.email}</span>
                        <CheckCircle size={13} className="text-green" />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-muted uppercase tracking-wide block mb-2">Investor Profile</label>
                      <div className="bg-card2 border border-border rounded-xl p-4 space-y-2 text-sm">
                        {user.investorProfile ? (
                          <>
                            <div className="flex justify-between"><span className="text-muted">Preference</span><span className="text-offwhite capitalize">{user.investorProfile.investmentPreference.replace("_", " ")}</span></div>
                            <div className="flex justify-between"><span className="text-muted">Hold duration</span><span className="text-offwhite capitalize">{user.investorProfile.holdDuration}</span></div>
                            <div className="flex justify-between"><span className="text-muted">Risk appetite</span><span className="text-offwhite capitalize">{user.investorProfile.riskAppetite}</span></div>
                          </>
                        ) : (
                          <p className="text-muted text-sm">Complete the AI onboarding wizard to set your profile.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </SectionCard>
              </>
            )}

            {/* ── Security ─────────────────────────────────────────────── */}
            {section === "security" && (
              <>
                <SectionCard title="Password">
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-muted uppercase tracking-wide block mb-2">Current Password</label>
                      <input type="password" placeholder="••••••••" className="w-full bg-card2 border border-border rounded-xl px-4 py-2.5 text-sm text-offwhite focus:border-accent focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-xs text-muted uppercase tracking-wide block mb-2">New Password</label>
                      <input type="password" placeholder="••••••••" className="w-full bg-card2 border border-border rounded-xl px-4 py-2.5 text-sm text-offwhite focus:border-accent focus:outline-none" />
                    </div>
                    <Button variant="primary" size="sm">Update Password</Button>
                  </div>
                </SectionCard>

                <SectionCard title="Two-Factor Authentication">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-offwhite mb-0.5">Authenticator App</p>
                      <p className="text-xs text-muted">Use Google Authenticator or similar</p>
                    </div>
                    <Button variant="outline" size="sm">Enable</Button>
                  </div>
                </SectionCard>

                <SectionCard title="Active Sessions">
                  <div className="space-y-3">
                    {[
                      { device: "Chrome on Windows", ip: "102.89.xx.xx", location: "Lagos, Nigeria", active: true },
                      { device: "Safari on iPhone", ip: "102.89.xx.xx", location: "Lagos, Nigeria", active: false },
                    ].map((session) => (
                      <div key={session.device} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <div>
                          <p className="text-sm text-offwhite">{session.device}</p>
                          <p className="text-xs text-muted">{session.location} · {session.ip}</p>
                        </div>
                        {session.active
                          ? <span className="text-xs text-green font-medium flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green" />Active</span>
                          : <Button variant="danger" size="sm">Revoke</Button>
                        }
                      </div>
                    ))}
                  </div>
                </SectionCard>
              </>
            )}

            {/* ── Notifications ────────────────────────────────────────── */}
            {section === "notifications" && (
              <>
                <SectionCard title="Email Notifications">
                  <div>
                    <ToggleRow label="Yield distributions" desc="When yield is distributed to your wallet" checked={notifToggles.yieldDistributions} onChange={() => toggleNotif("yieldDistributions")} />
                    <ToggleRow label="New launches" desc="When new assets go live" checked={notifToggles.newLaunches} onChange={() => toggleNotif("newLaunches")} />
                    <ToggleRow label="Raise milestones" desc="25%, 50%, 75%, 100% funded" checked={notifToggles.milestones} onChange={() => toggleNotif("milestones")} />
                    <ToggleRow label="P2P updates" desc="Deposit and withdrawal confirmations" checked={notifToggles.p2pUpdates} onChange={() => toggleNotif("p2pUpdates")} />
                    <ToggleRow label="AI monthly reports" desc="Portfolio analysis on 1st of each month" checked={notifToggles.aiReports} onChange={() => toggleNotif("aiReports")} />
                    <ToggleRow label="Marketing & offers" desc="Platform updates and promotions" checked={notifToggles.marketing} onChange={() => toggleNotif("marketing")} />
                  </div>
                </SectionCard>

                <SectionCard title="Push Notifications">
                  <p className="text-sm text-muted mb-3">Enable browser push notifications for real-time yield and investment alerts.</p>
                  <Button variant="outline" size="sm">Enable Push Notifications</Button>
                </SectionCard>
              </>
            )}

            {/* ── Wallet ───────────────────────────────────────────────── */}
            {section === "wallet" && (
              <>
                <SectionCard title="Platform Wallet">
                  <div className="space-y-4">
                    <div className="bg-card2 border border-border rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-muted uppercase tracking-wide">Wallet Address (Mantle)</span>
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => setShowAddress(!showAddress)} className="text-muted hover:text-offwhite transition-colors">
                            {showAddress ? <EyeOff size={13} /> : <Eye size={13} />}
                          </button>
                          <button onClick={copyAddress} className="text-muted hover:text-accent2 transition-colors">
                            {copied ? <Check size={13} className="text-green" /> : <Copy size={13} />}
                          </button>
                        </div>
                      </div>
                      <p className={cn("font-mono text-sm", showAddress ? "text-offwhite" : "text-muted select-none")}>
                        {showAddress ? user.walletAddress : "0x" + "•".repeat(38)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-border">
                      <span className="text-sm text-muted">USDC Balance</span>
                      <span className="font-mono font-bold text-white">${user.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm text-offwhite">Auto-Yield</p>
                        <p className="text-xs text-muted">Idle USDC auto-deployed to Aave (~3–4% APY)</p>
                      </div>
                      <span className="text-xs text-muted bg-card border border-border rounded-full px-2 py-0.5">Off</span>
                    </div>
                  </div>
                </SectionCard>

                <SectionCard title="Token Withdrawals to External Wallet">
                  {showWithdraw ? (
                    <WithdrawTokenPanel onClose={() => setShowWithdraw(false)} />
                  ) : (
                    <div>
                      <p className="text-sm text-muted mb-4">
                        Withdraw your investment tokens to an external Mantle-compatible wallet. Your yield continues flowing to the external address.
                      </p>
                      <div className="bg-[rgba(249,168,37,0.06)] border border-gold/20 rounded-xl p-3 flex items-start gap-2 mb-4">
                        <AlertTriangle size={13} className="text-gold mt-0.5 shrink-0" />
                        <p className="text-xs text-muted">Destination wallet must be KYC-verified on Harvest.rwa (ERC-1400 legal requirement).</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setShowWithdraw(true)}>
                        Withdraw Tokens <ArrowRight size={13} />
                      </Button>
                    </div>
                  )}
                </SectionCard>
              </>
            )}

            {/* ── KYC ─────────────────────────────────────────────────── */}
            {section === "kyc" && (
              <>
                <SectionCard title="Verification Status">
                  <div className="space-y-4">
                    <div className={cn("rounded-xl p-4 flex items-center justify-between", kycConfig.bg)}>
                      <div className="flex items-center gap-3">
                        <CheckCircle size={20} className={kycConfig.color} />
                        <div>
                          <p className={cn("font-medium text-sm", kycConfig.color)}>{kycConfig.label}</p>
                          <p className="text-xs text-muted">Investment limit: {kycConfig.limit}</p>
                        </div>
                      </div>
                      <span className={cn("text-xs font-black uppercase tracking-widest", kycConfig.color)}>
                        Tier {user.kycTier}
                      </span>
                    </div>

                    {user.kycTier < 2 && (
                      <Link href="/kyc">
                        <Button variant="primary" size="sm" fullWidth>
                          Upgrade to Tier {user.kycTier + 1} <ArrowRight size={13} />
                        </Button>
                      </Link>
                    )}
                  </div>
                </SectionCard>

                <SectionCard title="Tier Comparison">
                  <div className="space-y-3">
                    {KYC_TIER_CONFIG.slice(1).map((t) => (
                      <div key={t.tier} className={cn(
                        "rounded-xl p-4 border",
                        user.kycTier >= t.tier ? "border-green/20 bg-green/5" : "border-border bg-card2"
                      )}>
                        <div className="flex items-center justify-between mb-1">
                          <span className={cn("text-sm font-medium", user.kycTier >= t.tier ? "text-white" : "text-offwhite")}>{t.label}</span>
                          {user.kycTier >= t.tier
                            ? <CheckCircle size={14} className="text-green" />
                            : <span className="text-xs text-muted font-mono">{t.limit}</span>
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              </>
            )}

          </div>
        </div>
      </div>
    </AppShell>
  );
}
