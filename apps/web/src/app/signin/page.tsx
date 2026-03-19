"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, Chrome, Phone } from "lucide-react";
import HarvestLogo from "@/components/HarvestLogo";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import GooglePicker from "@/components/GooglePicker";
import { setLoggedIn } from "@/lib/auth";
import { cn } from "@/lib/utils";

export default function SignInPage() {
  const [tab, setTab] = useState<"email" | "phone">("email");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showGooglePicker, setShowGooglePicker] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = () => {
    setLoading(true);
    setTimeout(() => {
      setLoggedIn("Alex Johnson", email);
      setLoading(false);
      window.location.href = "/feed";
    }, 1500);
  };

  const handleGoogleSuccess = (name: string, googleEmail: string) => {
    setLoggedIn(name, googleEmail);
    window.location.href = "/feed";
  };

  return (
    <div className="min-h-screen bg-ink flex">
      {showGooglePicker && (
        <GooglePicker
          intent="signin"
          onSuccess={handleGoogleSuccess}
          onClose={() => setShowGooglePicker(false)}
        />
      )}
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] shrink-0 bg-surface border-r border-border p-12">
        <Link href="/"><HarvestLogo variant="inline" size={32} /></Link>

        <div>
          <div className="space-y-4 mb-8">
            {[
              { yield: "+$34.20", label: "Brazil Solar yield this month", time: "2h ago" },
              { yield: "+$12.40", label: "Lisbon Property quarterly payout", time: "Yesterday" },
              { yield: "+$5.60", label: "UK Credit Fund distribution", time: "3d ago" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 bg-card border border-border rounded-xl p-4">
                <span className="text-green font-mono font-bold text-sm">{item.yield}</span>
                <div>
                  <p className="text-sm text-offwhite">{item.label}</p>
                  <p className="text-xs text-muted">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="font-syne font-bold text-2xl text-white mb-2">
            Your money is working<br />while you sleep.
          </p>
          <p className="text-sm text-muted">
            6,143 investors earning yield from real-world assets on Mantle Network.
          </p>
        </div>

        <p className="text-xs text-muted">
          Powered by Mantle Network · All transactions on-chain · Gas fees absorbed
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <Link href="/" className="lg:hidden block mb-6">
              <HarvestLogo variant="inline" size={26} />
            </Link>
            <h1 className="font-syne font-black text-3xl text-white mb-2">Welcome back</h1>
            <p className="text-sm text-muted">Sign in to your account</p>
          </div>

          {/* Google OAuth */}
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

          {/* Tab switcher */}
          <div className="flex gap-1 bg-card border border-border rounded-btn p-1 mb-5">
            {(["email", "phone"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "flex-1 py-1.5 rounded-lg text-sm font-medium transition-all",
                  tab === t ? "bg-accent/15 text-accent" : "text-muted hover:text-offwhite"
                )}
              >
                {t === "email" ? "Email" : "Phone"}
              </button>
            ))}
          </div>

          {/* Form */}
          <div className="space-y-4">
            {tab === "email" ? (
              <>
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
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  prefix={<Lock size={14} />}
                  suffix={
                    <button onClick={() => setShowPassword(!showPassword)} type="button">
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  }
                />
              </>
            ) : (
              <Input
                label="Phone Number"
                type="tel"
                placeholder="+234 800 000 0000"
                prefix={<Phone size={14} className="text-muted" />}
              />
            )}

            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-xs text-accent hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              onClick={handleSignIn}
            >
              Sign In
            </Button>
          </div>

          <p className="text-center text-sm text-muted mt-6">
            Don't have an account?{" "}
            <Link href="/signup" className="text-accent hover:underline">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
