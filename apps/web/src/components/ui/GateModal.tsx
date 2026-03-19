"use client";

import Link from "next/link";
import { X, Lock, ArrowRight, Zap } from "lucide-react";
import Button from "./Button";
import { useEffect } from "react";

interface GateModalProps {
  feature: string;
  onClose: () => void;
}

export default function GateModal({ feature, onClose }: GateModalProps) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ink/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-card border border-border rounded-2xl w-full max-w-sm p-6 animate-slide-up shadow-accent">
        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 text-muted hover:text-offwhite transition-colors">
          <X size={16} />
        </button>

        {/* Icon */}
        <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-4">
          <Lock size={20} className="text-accent" />
        </div>

        {/* Text */}
        <h2 className="font-syne font-black text-xl text-white mb-2">
          Sign up to {feature}
        </h2>
        <p className="text-sm text-muted mb-6 leading-relaxed">
          Create a free account in 30 seconds. No wallet needed — just your email or Google.
        </p>

        {/* Perks */}
        <div className="space-y-2 mb-6">
          {[
            "Get in on launches from $10",
            "Earn real yield, paid automatically",
            "No wallet or crypto knowledge needed",
            "Gas fees: $0 — we cover it",
          ].map((perk) => (
            <div key={perk} className="flex items-center gap-2 text-sm text-muted">
              <Zap size={12} className="text-gold shrink-0" />
              <span>{perk}</span>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-2">
          <Link href="/signup" onClick={onClose}>
            <Button variant="primary" size="lg" fullWidth>
              Create Free Account <ArrowRight size={14} />
            </Button>
          </Link>
          <Link href="/signin" onClick={onClose}>
            <Button variant="ghost" size="md" fullWidth>
              Already have an account? Sign in
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
