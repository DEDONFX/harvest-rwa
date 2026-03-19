"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Shield, Upload, Camera, CheckCircle, Clock, AlertTriangle,
  ArrowLeft, ArrowRight, FileText, User, Building2, ChevronRight, X
} from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const TIERS = [
  {
    id: 1,
    label: "Tier 1",
    name: "Individual Basic",
    limit: "$1,000 per transaction",
    time: "~5 minutes",
    color: "text-accent2",
    bg: "bg-[rgba(0,210,255,0.08)]",
    border: "border-accent2/30",
    activeBorder: "border-accent2",
    docs: ["Government-issued photo ID", "Live selfie"],
  },
  {
    id: 2,
    label: "Tier 2",
    name: "Individual Full",
    limit: "Unlimited",
    time: "~15 minutes",
    color: "text-green",
    bg: "bg-[rgba(0,200,150,0.08)]",
    border: "border-green/30",
    activeBorder: "border-green",
    docs: ["Government-issued photo ID", "Live selfie", "Proof of address (3 months)", "Source of funds declaration"],
  },
  {
    id: 3,
    label: "Tier 3",
    name: "Corporate / Institutional",
    limit: "Unlimited + institutional",
    time: "2–5 business days",
    color: "text-gold",
    bg: "bg-[rgba(249,168,37,0.08)]",
    border: "border-gold/30",
    activeBorder: "border-gold",
    docs: ["Certificate of incorporation", "Proof of registered address", "Director ID + selfie (each)", "Beneficial ownership structure", "Board resolution letter"],
  },
];

type Step = "select" | "upload" | "selfie" | "review" | "processing" | "done";

function UploadZone({ label, hint, uploaded, onUpload }: {
  label: string;
  hint?: string;
  uploaded: boolean;
  onUpload: () => void;
}) {
  return (
    <button
      onClick={onUpload}
      className={cn(
        "w-full border-2 border-dashed rounded-2xl p-6 text-center transition-all",
        uploaded
          ? "border-green/50 bg-green/5"
          : "border-border hover:border-accent/50 hover:bg-accent/5"
      )}
    >
      {uploaded ? (
        <div className="flex flex-col items-center gap-2">
          <CheckCircle size={28} className="text-green" />
          <p className="text-sm font-medium text-green">Uploaded</p>
          <p className="text-xs text-muted">{label}</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <Upload size={28} className="text-muted" />
          <p className="text-sm font-medium text-offwhite">{label}</p>
          {hint && <p className="text-xs text-muted">{hint}</p>}
          <span className="text-xs text-accent mt-1">Click to upload</span>
        </div>
      )}
    </button>
  );
}

export default function KYCPage() {
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [step, setStep] = useState<Step>("select");
  const [uploads, setUploads] = useState<Record<string, boolean>>({});
  const [selfieOk, setSelfieOk] = useState(false);
  const [loading, setLoading] = useState(false);

  const tier = TIERS.find((t) => t.id === selectedTier);

  const handleSubmit = () => {
    setLoading(true);
    setStep("processing");
    setTimeout(() => { setLoading(false); setStep("done"); }, 3000);
  };

  // ── Select Tier ──────────────────────────────────────────────────────────
  if (step === "select") {
    return (
      <AppShell showRightRail={false}>
        <div className="max-w-2xl mx-auto">
          <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-muted hover:text-offwhite text-sm mb-6 transition-colors">
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center">
                <Shield size={18} className="text-accent" />
              </div>
              <div>
                <h1 className="font-syne font-black text-2xl text-white">Identity Verification</h1>
                <p className="text-sm text-muted">Required to invest. Your data is encrypted and never sold.</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            {TIERS.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTier(t.id)}
                className={cn(
                  "w-full text-left rounded-2xl border p-5 transition-all",
                  selectedTier === t.id
                    ? `${t.bg} ${t.activeBorder} border`
                    : `bg-card ${t.border} border hover:border-opacity-60`
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn("text-xs font-black uppercase tracking-widest", t.color)}>{t.label}</span>
                      <span className="text-sm font-bold text-white font-syne">{t.name}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted mb-3">
                      <span className={cn("font-mono font-bold", t.color)}>{t.limit}</span>
                      <span className="flex items-center gap-1"><Clock size={11} /> {t.time}</span>
                    </div>
                    <ul className="space-y-1">
                      {t.docs.map((d) => (
                        <li key={d} className="flex items-center gap-2 text-xs text-muted">
                          <ChevronRight size={10} className="text-muted2 shrink-0" /> {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 mt-1 flex items-center justify-center shrink-0 transition-all",
                    selectedTier === t.id ? `${t.activeBorder} bg-accent` : "border-border"
                  )}>
                    {selectedTier === t.id && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="bg-card border border-border rounded-2xl p-4 flex items-start gap-3 mb-6">
            <Shield size={16} className="text-gold mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-medium text-offwhite mb-0.5">Bank-grade encryption</p>
              <p className="text-xs text-muted">Your documents are encrypted with AES-256 and stored on compliant infrastructure. We use Sumsub for identity verification — the same provider used by Binance and Coinbase.</p>
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            disabled={!selectedTier}
            onClick={() => setStep("upload")}
          >
            Start Verification <ArrowRight size={16} />
          </Button>
        </div>
      </AppShell>
    );
  }

  // ── Upload Documents ──────────────────────────────────────────────────────
  if (step === "upload" && tier) {
    const docKeys = tier.docs.filter((d) => !d.toLowerCase().includes("selfie"));
    const allUploaded = docKeys.every((d) => uploads[d]);

    return (
      <AppShell showRightRail={false}>
        <div className="max-w-2xl mx-auto">
          <button onClick={() => setStep("select")} className="inline-flex items-center gap-1.5 text-muted hover:text-offwhite text-sm mb-6 transition-colors">
            <ArrowLeft size={14} /> Back
          </button>

          {/* Progress */}
          <div className="flex items-center gap-2 mb-8">
            {["Upload Docs", "Take Selfie", "Review"].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={cn(
                  "w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold",
                  i === 0 ? "border-accent bg-accent text-white" : "border-border text-muted"
                )}>
                  {i + 1}
                </div>
                <span className={cn("text-xs", i === 0 ? "text-offwhite" : "text-muted")}>{s}</span>
                {i < 2 && <div className="w-8 h-px bg-border" />}
              </div>
            ))}
          </div>

          <div className="mb-6">
            <h2 className="font-syne font-bold text-xl text-white mb-1">Upload your documents</h2>
            <p className="text-sm text-muted">
              <span className={cn("font-medium", tier.color)}>{tier.label} — {tier.name}</span>
            </p>
          </div>

          <div className="space-y-4 mb-8">
            {docKeys.map((doc) => (
              <UploadZone
                key={doc}
                label={doc}
                hint={doc.includes("ID") ? "JPG, PNG or PDF · Max 10MB" : "Must be dated within last 3 months"}
                uploaded={!!uploads[doc]}
                onUpload={() => setUploads((u) => ({ ...u, [doc]: true }))}
              />
            ))}
          </div>

          <Button variant="primary" size="lg" fullWidth disabled={!allUploaded} onClick={() => setStep("selfie")}>
            Continue to Selfie <ArrowRight size={16} />
          </Button>
        </div>
      </AppShell>
    );
  }

  // ── Selfie ────────────────────────────────────────────────────────────────
  if (step === "selfie" && tier) {
    return (
      <AppShell showRightRail={false}>
        <div className="max-w-2xl mx-auto">
          <button onClick={() => setStep("upload")} className="inline-flex items-center gap-1.5 text-muted hover:text-offwhite text-sm mb-6 transition-colors">
            <ArrowLeft size={14} /> Back
          </button>

          <div className="flex items-center gap-2 mb-8">
            {["Upload Docs", "Take Selfie", "Review"].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={cn(
                  "w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold",
                  i < 1 ? "border-green bg-green/15 text-green" : i === 1 ? "border-accent bg-accent text-white" : "border-border text-muted"
                )}>
                  {i < 1 ? <CheckCircle size={14} /> : i + 1}
                </div>
                <span className={cn("text-xs", i <= 1 ? "text-offwhite" : "text-muted")}>{s}</span>
                {i < 2 && <div className="w-8 h-px bg-border" />}
              </div>
            ))}
          </div>

          <div className="mb-6">
            <h2 className="font-syne font-bold text-xl text-white mb-1">Take a selfie</h2>
            <p className="text-sm text-muted">This confirms you are the person in the document.</p>
          </div>

          {/* Selfie preview area */}
          <div className="relative bg-card border border-border rounded-2xl overflow-hidden mb-6" style={{ aspectRatio: "4/3" }}>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <div className="w-36 h-44 rounded-full border-4 border-dashed border-accent/50 flex items-center justify-center">
                <User size={48} className="text-muted" />
              </div>
              <p className="text-sm text-muted">Position your face in the oval</p>
            </div>

            {selfieOk && (
              <div className="absolute inset-0 flex items-center justify-center bg-card/80">
                <div className="text-center">
                  <CheckCircle size={48} className="text-green mx-auto mb-2" />
                  <p className="text-green font-medium">Selfie captured</p>
                </div>
              </div>
            )}
          </div>

          <ul className="space-y-2 mb-6">
            {["Look directly at the camera", "Ensure good lighting", "Remove glasses if possible", "Keep a neutral expression"].map((tip) => (
              <li key={tip} className="flex items-center gap-2 text-xs text-muted">
                <div className="w-1 h-1 rounded-full bg-accent shrink-0" />
                {tip}
              </li>
            ))}
          </ul>

          {!selfieOk ? (
            <Button variant="primary" size="lg" fullWidth onClick={() => setSelfieOk(true)}>
              <Camera size={16} /> Take Selfie
            </Button>
          ) : (
            <div className="flex gap-3">
              <Button variant="outline" size="lg" className="flex-1" onClick={() => setSelfieOk(false)}>
                Retake
              </Button>
              <Button variant="primary" size="lg" className="flex-1" onClick={() => setStep("review")}>
                Looks Good →
              </Button>
            </div>
          )}
        </div>
      </AppShell>
    );
  }

  // ── Review ────────────────────────────────────────────────────────────────
  if (step === "review" && tier) {
    return (
      <AppShell showRightRail={false}>
        <div className="max-w-2xl mx-auto">
          <button onClick={() => setStep("selfie")} className="inline-flex items-center gap-1.5 text-muted hover:text-offwhite text-sm mb-6 transition-colors">
            <ArrowLeft size={14} /> Back
          </button>

          <div className="flex items-center gap-2 mb-8">
            {["Upload Docs", "Take Selfie", "Review"].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={cn(
                  "w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold",
                  i < 2 ? "border-green bg-green/15 text-green" : "border-accent bg-accent text-white"
                )}>
                  {i < 2 ? <CheckCircle size={14} /> : 3}
                </div>
                <span className="text-xs text-offwhite">{s}</span>
                {i < 2 && <div className="w-8 h-px bg-green/40" />}
              </div>
            ))}
          </div>

          <div className="mb-6">
            <h2 className="font-syne font-bold text-xl text-white mb-1">Review & Submit</h2>
            <p className="text-sm text-muted">Check everything looks correct before submitting.</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5 mb-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-offwhite">Verification Level</span>
              <span className={cn("text-sm font-bold font-mono", tier.color)}>{tier.label} — {tier.limit}</span>
            </div>
            <div className="space-y-3">
              {tier.docs.map((doc) => (
                <div key={doc} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText size={13} className="text-muted" />
                    <span className="text-sm text-muted">{doc}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-green text-xs">
                    <CheckCircle size={12} />
                    <span>Ready</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[rgba(249,168,37,0.06)] border border-gold/20 rounded-2xl p-4 mb-6 flex items-start gap-3">
            <AlertTriangle size={15} className="text-gold mt-0.5 shrink-0" />
            <p className="text-xs text-muted leading-relaxed">
              By submitting, you confirm all documents are genuine and belong to you. Submitting false information may result in permanent account suspension and may be reported to relevant authorities.
            </p>
          </div>

          <Button variant="primary" size="lg" fullWidth loading={loading} onClick={handleSubmit}>
            Submit Verification
          </Button>
        </div>
      </AppShell>
    );
  }

  // ── Processing ────────────────────────────────────────────────────────────
  if (step === "processing") {
    return (
      <AppShell showRightRail={false}>
        <div className="max-w-md mx-auto text-center py-20">
          <div className="w-20 h-20 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Shield size={32} className="text-accent" />
          </div>
          <h2 className="font-syne font-bold text-2xl text-white mb-2">Verifying your identity…</h2>
          <p className="text-sm text-muted">This usually takes 30–60 seconds. Please wait.</p>
          <div className="mt-8 flex justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-accent animate-bounce"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
        </div>
      </AppShell>
    );
  }

  // ── Done ──────────────────────────────────────────────────────────────────
  if (step === "done" && tier) {
    return (
      <AppShell showRightRail={false}>
        <div className="max-w-md mx-auto text-center py-20">
          <div className="w-20 h-20 rounded-full bg-green/15 border border-green/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} className="text-green" />
          </div>
          <h2 className="font-syne font-bold text-2xl text-white mb-2">Verification Submitted</h2>
          <p className="text-muted text-sm mb-8">
            {tier.id === 3
              ? "Corporate KYB typically takes 2–5 business days. We'll email you once approved."
              : "Your documents are being reviewed. You'll be notified within minutes."}
          </p>

          <div className="bg-card border border-border rounded-2xl p-5 text-left mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wide text-muted font-dm">Status</span>
              <div className="flex items-center gap-1.5 text-gold text-xs font-medium">
                <Clock size={12} />
                Under Review
              </div>
            </div>
            <div className="space-y-2 text-sm text-muted">
              <div className="flex justify-between">
                <span>Tier applied for</span>
                <span className={cn("font-medium", tier.color)}>{tier.label}</span>
              </div>
              <div className="flex justify-between">
                <span>Investment limit</span>
                <span className="text-offwhite font-mono">{tier.limit}</span>
              </div>
              <div className="flex justify-between">
                <span>Expected decision</span>
                <span className="text-offwhite">{tier.id === 3 ? "2–5 business days" : "< 10 minutes"}</span>
              </div>
            </div>
          </div>

          <Link href="/discover">
            <Button variant="primary" size="lg" fullWidth>
              Browse Assets While You Wait
            </Button>
          </Link>
        </div>
      </AppShell>
    );
  }

  return null;
}
