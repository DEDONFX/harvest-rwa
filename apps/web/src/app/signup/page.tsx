"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User, Chrome, Check, ArrowRight, Building2, Zap, TrendingUp, LayoutGrid, Timer, Calendar, Target, Shield, Scale, Rocket } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import GooglePicker from "@/components/GooglePicker";
import HarvestLogo from "@/components/HarvestLogo";
import { setLoggedIn } from "@/lib/auth";
import { cn } from "@/lib/utils";

type Step = "auth" | "wizard" | "creating";

const WIZARD_STEPS = [
  {
    id: "preference",
    question: "What kind of assets do you want to own?",
    subtitle: "We'll personalise your feed based on your answer",
    options: [
      { value: "real_estate", label: "Real Estate", icon: Building2, desc: "Office, residential, hotels" },
      { value: "infrastructure", label: "Infrastructure", icon: Zap, desc: "Solar, wind, logistics" },
      { value: "business_yield", label: "Business Yield", icon: TrendingUp, desc: "Invoice finance, revenue share" },
      { value: "mixed", label: "Mixed Holdings", icon: LayoutGrid, desc: "Spread across all asset types" },
    ],
  },
  {
    id: "duration",
    question: "How long do you plan to hold your assets?",
    subtitle: "Helps us match you with the right assets",
    options: [
      { value: "short", label: "Short Term", icon: Timer, desc: "Less than 12 months" },
      { value: "medium", label: "Medium Term", icon: Calendar, desc: "1–3 years" },
      { value: "long", label: "Long Term", icon: Target, desc: "3+ years" },
    ],
  },
  {
    id: "risk",
    question: "What's your yield preference?",
    subtitle: "Be honest — this shapes which assets we surface for you",
    options: [
      { value: "conservative", label: "Steady", icon: Shield, desc: "Stable payouts, lower risk (5–8%)" },
      { value: "balanced", label: "Balanced", icon: Scale, desc: "Good yield, moderate risk (8–12%)" },
      { value: "growth", label: "High Yield", icon: Rocket, desc: "Maximum returns, higher risk (12%+)" },
    ],
  },
];

export default function SignUpPage() {
  const [step, setStep] = useState<Step>("auth");
  const [wizardStep, setWizardStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showGooglePicker, setShowGooglePicker] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleAuthSubmit = () => {
    setStep("wizard");
  };

  const handleGoogleSuccess = (googleName: string, googleEmail: string) => {
    setName(googleName);
    setEmail(googleEmail);
    setShowGooglePicker(false);
    // setLoggedIn is called after the wizard completes, not here
    setStep("wizard");
  };

  const handleSelect = (questionId: string, value: string) => {
    setSelections((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleWizardNext = () => {
    if (wizardStep < WIZARD_STEPS.length - 1) {
      setWizardStep((s) => s + 1);
    } else {
      setStep("creating");
      setTimeout(() => {
        setLoggedIn(name, email);
        window.location.href = "/feed";
      }, 2500);
    }
  };

  if (step === "creating") {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <div className="text-center space-y-4 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center mx-auto">
            <Rocket size={28} className="text-accent" />
          </div>
          <div>
            <p className="font-syne font-black text-2xl text-white mb-2">Setting up your account…</p>
            <p className="text-muted text-sm">Creating your multichain smart wallet</p>
          </div>
          <div className="flex flex-col gap-2 mt-6 max-w-xs mx-auto">
            {[
              "Creating smart wallet",
              "Applying your asset preferences",
              "Personalising your feed",
            ].map((task, i) => (
              <div key={task} className="flex items-center gap-2 text-sm">
                <Check size={14} className="text-green shrink-0" style={{ opacity: i < 2 ? 1 : 0.3 }} />
                <span className={i < 2 ? "text-offwhite" : "text-muted"}>{task}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (step === "wizard") {
    const current = WIZARD_STEPS[wizardStep];
    const selected = selections[current.id];

    return (
      <div className="min-h-screen bg-ink flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
          {/* Progress */}
          <div className="flex items-center gap-2 mb-8">
            {WIZARD_STEPS.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1 flex-1 rounded-full transition-all",
                  i <= wizardStep ? "bg-accent" : "bg-border"
                )}
              />
            ))}
          </div>

          <div className="mb-2">
            <span className="text-xs text-muted uppercase tracking-widest">
              Question {wizardStep + 1} of {WIZARD_STEPS.length}
            </span>
          </div>
          <h2 className="font-syne font-black text-3xl text-white mb-2">{current.question}</h2>
          <p className="text-sm text-muted mb-8">{current.subtitle}</p>

          <div className="grid grid-cols-2 gap-3 mb-8">
            {current.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSelect(current.id, opt.value)}
                className={cn(
                  "text-left p-4 rounded-card border transition-all",
                  selected === opt.value
                    ? "bg-accent/10 border-accent"
                    : "bg-card border-border hover:border-accent/40"
                )}
              >
                <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-3">
                  <opt.icon size={18} className="text-accent" />
                </div>
                <p className="font-syne font-bold text-white text-sm mb-1">{opt.label}</p>
                <p className="text-xs text-muted">{opt.desc}</p>
                {selected === opt.value && (
                  <div className="mt-2 flex items-center gap-1 text-accent text-xs">
                    <Check size={12} /> Selected
                  </div>
                )}
              </button>
            ))}
          </div>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            disabled={!selected}
            onClick={handleWizardNext}
          >
            {wizardStep < WIZARD_STEPS.length - 1 ? "Next" : "Start Owning Assets"}
            <ArrowRight size={14} />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink flex">
      {showGooglePicker && (
        <GooglePicker
          intent="signup"
          onSuccess={handleGoogleSuccess}
          onClose={() => setShowGooglePicker(false)}
        />
      )}
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] shrink-0 bg-surface border-r border-border p-12">
        <Link href="/"><HarvestLogo variant="inline" size={32} /></Link>

        <div>
          <div className="space-y-3 mb-6">
            {[
              "No crypto knowledge needed",
              "Own real assets from as little as $1",
              "AI-screened assets only",
              "Yield paid straight to your wallet",
              "Transfer or sell your tokens anytime",
              "Gas fees? $0. We cover it.",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-muted">
                <Check size={14} className="text-green shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <p className="font-syne font-bold text-2xl text-white">
            Own a piece of the world.<br />
            Starting at $1.
          </p>
        </div>

        <p className="text-xs text-muted">
          Join 6,143 asset owners · Mantle + Solana Multichain
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <Link href="/" className="lg:hidden block mb-6">
              <HarvestLogo variant="inline" size={26} />
            </Link>
            <h1 className="font-syne font-black text-3xl text-white mb-2">Create account</h1>
            <p className="text-sm text-muted">Buy a share of real-world assets from $1</p>
          </div>

          <button
            onClick={() => setShowGooglePicker(true)}
            className="w-full flex items-center justify-center gap-2 bg-card border border-border rounded-btn py-3 text-sm text-offwhite hover:border-accent/40 transition-colors mb-6"
          >
            <Chrome size={16} className="text-accent" />
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 border-t border-border" />
            <span className="text-xs text-muted">or</span>
            <div className="flex-1 border-t border-border" />
          </div>

          <div className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="Alex Johnson"
              value={name}
              onChange={(e) => setName(e.target.value)}
              prefix={<User size={14} />}
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              prefix={<Mail size={14} />}
            />
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Min 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              prefix={<Lock size={14} />}
              suffix={
                <button onClick={() => setShowPassword(!showPassword)} type="button">
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              }
            />

            <p className="text-[11px] text-muted leading-relaxed">
              By signing up you agree to our{" "}
              <span className="text-accent underline cursor-pointer">Terms of Service</span> and{" "}
              <span className="text-accent underline cursor-pointer">Privacy Policy</span>.
            </p>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              onClick={handleAuthSubmit}
              disabled={!email || !password || !name}
            >
              Create Account <ArrowRight size={14} />
            </Button>
          </div>

          <p className="text-center text-sm text-muted mt-6">
            Already have an account?{" "}
            <Link href="/signin" className="text-accent hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
