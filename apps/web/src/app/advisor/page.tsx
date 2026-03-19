"use client";

import { useState, useRef, useEffect } from "react";
import {
  Sparkles, Send, ArrowRight, Lock, TrendingUp, Shield,
  BarChart2, Wallet, PieChart, RefreshCw, ChevronDown
} from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import Button from "@/components/ui/Button";
import { MOCK_ASSETS, MOCK_PORTFOLIO } from "@/lib/mock-data";
import { formatUSD } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useAuthGuard } from "@/components/AuthGuard";

type Role = "user" | "ai";

interface Message {
  id: string;
  role: Role;
  text: string;
  timestamp: Date;
  assetRef?: string;
}

const SUGGESTED_PROMPTS = [
  { icon: TrendingUp, text: "What's my portfolio performance this month?", category: "portfolio" },
  { icon: Shield, text: "Which of my holdings has the highest risk?", category: "risk" },
  { icon: BarChart2, text: "Recommend assets that fit my risk profile", category: "discovery" },
  { icon: Wallet, text: "How much yield will I earn this quarter?", category: "yield" },
  { icon: PieChart, text: "Should I diversify more?", category: "strategy" },
  { icon: RefreshCw, text: "Compare Lisbon Property vs Brazil Solar", category: "compare" },
];

const AI_RESPONSES: Record<string, string> = {
  "What's my portfolio performance this month?":
    "Your portfolio is up **5.3%** this month — outperforming the platform average of 3.8%. Brazil Solar is the top performer at **12% above projection** due to exceptional solar irradiance in Q1 2026. Lisbon Commercial had a minor dip to 96% occupancy but has since recovered. Your total unrealised gain is **$52.40**.",

  "Which of my holdings has the highest risk?":
    "UK Credit Fund carries the highest risk score at **6/10** (medium-high). This is due to counterparty credit risk and potential early repayment risk from borrowers. The other two holdings — Lisbon Commercial (3/10) and Brazil Solar (4/10) — are both in the low-medium tier. Overall your portfolio risk score is **4.2/10**, which aligns well with your balanced profile.",

  "Recommend assets that fit my risk profile":
    "Based on your **balanced risk appetite** and preference for infrastructure and real estate, here are 3 assets I'd recommend:\n\n1. **Dubai Marina Apartments** — 8.4% APY, Risk 3/10. Stable rental market with strong occupancy.\n2. **Nairobi Data Centre** — 11.2% APY, Risk 5/10. High-growth market but excellent yield.\n3. **Manila Hotel Complex** — 9.1% APY, Risk 4/10. Tourism recovery driving occupancy above 88%.\n\nAll three would improve your portfolio diversification geographically.",

  "How much yield will I earn this quarter?":
    "Based on your current holdings and stated APYs:\n\n- **Lisbon Commercial** → **$12.80** (Q2 est.)\n- **Brazil Solar** → **$26.25** (Q2 est.)\n- **UK Credit Fund** → **$7.50** (Q2 est.)\n\n**Total Q2 estimated yield: $46.55**\n\nFirst payout due: **April 1, 2026** — Brazil Solar quarterly distribution.",

  "Should I diversify more?":
    "Your portfolio is moderately concentrated. You have **68% in real estate & infrastructure**, **32% in credit** — across 3 countries. I'd suggest:\n\n1. Adding **1 emerging market asset** (Southeast Asia or Africa) to capture higher yield\n2. Considering a **pre-revenue asset** for growth exposure — capped at 10% of portfolio\n3. Your current geographical spread is Portugal, Brazil, UK — adding Asia or Africa would improve global diversification\n\nA 4th holding at $200–300 would be ideal without over-concentrating.",

  "Compare Lisbon Property vs Brazil Solar":
    "Here's a side-by-side comparison:\n\n| | Lisbon Property | Brazil Solar |\n|---|---|---|\n| APY | 7.2% | 13.4% |\n| Risk | 3/10 | 4/10 |\n| Status | Live (68%) | Raise Complete |\n| Payout | Quarterly | Monthly |\n| Asset type | Real estate | Infrastructure |\n\n**My take:** Brazil Solar offers significantly better yield at only marginally higher risk. For a balanced investor, Brazil Solar has outperformed expectations consistently. Lisbon is more stable and predictable — good for capital preservation. If maximising yield is your priority, Brazil Solar is the better choice.",

  "default":
    "That's a great question about your portfolio. Based on your current holdings across Lisbon Commercial Property, Brazil Solar Infrastructure, and UK Credit Fund, your weighted average APY is 9.1% — above your stated 7% target. I'd recommend focusing on diversification to maintain this performance while managing downside risk. Would you like me to run a scenario analysis on any specific aspect?",
};

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 p-3 bg-card border border-border rounded-2xl rounded-bl-sm w-fit">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  // Parse basic markdown bold
  const renderText = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) =>
      part.startsWith("**") && part.endsWith("**")
        ? <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>
        : <span key={i}>{part}</span>
    );
  };

  return (
    <div className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center shrink-0 mt-1">
          <Sparkles size={14} className="text-gold" />
        </div>
      )}

      <div className={cn(
        "max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
        isUser
          ? "bg-accent text-white rounded-br-sm"
          : "bg-card border border-border text-muted rounded-bl-sm"
      )}>
        {!isUser && (
          <div className="text-white whitespace-pre-line">
            {renderText(message.text)}
          </div>
        )}
        {isUser && <span>{message.text}</span>}

        <div className={cn("text-[10px] mt-1.5", isUser ? "text-white/60 text-right" : "text-muted2")}>
          {message.timestamp.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center shrink-0 mt-1 text-accent text-xs font-bold font-syne">
          AJ
        </div>
      )}
    </div>
  );
}

const FREE_QUERIES = 10;

export default function AdvisorPage() {
  const blocked = useAuthGuard("/advisor");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "ai",
      text: `Hello! I'm your Harvest.rwa AI Advisor.\n\nI have full context on your portfolio: **3 holdings**, **$1,042.50** total value, **9.1% weighted APY**. I can help you analyse performance, compare assets, forecast yield, or recommend new investments.\n\nYou have **${FREE_QUERIES} free queries** today. What would you like to know?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [queriesUsed, setQueriesUsed] = useState(0);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  if (blocked) return null;

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    if (queriesUsed >= FREE_QUERIES) { setShowUpgrade(true); return; }

    const userMsg: Message = { id: `u${Date.now()}`, role: "user", text, timestamp: new Date() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);
    setQueriesUsed((q) => q + 1);

    const delay = 800 + Math.random() * 1000;
    setTimeout(() => {
      const responseText = AI_RESPONSES[text] ?? AI_RESPONSES["default"];
      const aiMsg: Message = { id: `a${Date.now()}`, role: "ai", text: responseText, timestamp: new Date() };
      setMessages((m) => [...m, aiMsg]);
      setTyping(false);
    }, delay);
  };

  const remaining = FREE_QUERIES - queriesUsed;

  return (
    <AppShell showRightRail={false}>
      <div className="flex flex-col h-[calc(100vh-120px)] max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center">
              <Sparkles size={18} className="text-gold" />
            </div>
            <div>
              <h1 className="font-syne font-black text-lg text-white">AI Advisor</h1>
              <p className="text-xs text-muted">Powered by Claude · Context-aware portfolio intelligence</p>
            </div>
          </div>
          <div className={cn(
            "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border",
            remaining > 3
              ? "text-gold bg-gold/10 border-gold/20"
              : remaining > 0
              ? "text-red bg-red/10 border-red/20"
              : "text-muted bg-card border-border"
          )}>
            {remaining > 0 ? (
              <><Sparkles size={11} /> {remaining} queries left today</>
            ) : (
              <><Lock size={11} /> Daily limit reached</>
            )}
          </div>
        </div>

        {/* Portfolio context pill */}
        <div className="flex items-center gap-3 bg-card border border-border rounded-2xl p-3 mb-4 shrink-0 overflow-x-auto">
          <span className="text-xs text-muted shrink-0">Context:</span>
          {[
            { label: "3 holdings", color: "text-offwhite" },
            { label: "$1,042.50 value", color: "text-accent2" },
            { label: "9.1% avg APY", color: "text-green" },
            { label: "Balanced profile", color: "text-gold" },
          ].map(({ label, color }) => (
            <span key={label} className={cn("text-xs font-medium shrink-0 bg-card2 px-2 py-1 rounded-lg", color)}>
              {label}
            </span>
          ))}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-4">
          {messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)}
          {typing && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center shrink-0">
                <Sparkles size={14} className="text-gold" />
              </div>
              <TypingIndicator />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions (shown when empty) */}
        {messages.length <= 1 && !typing && (
          <div className="shrink-0 mb-4">
            <p className="text-xs text-muted mb-3">Suggested questions:</p>
            <div className="grid grid-cols-2 gap-2">
              {SUGGESTED_PROMPTS.map(({ icon: Icon, text }) => (
                <button
                  key={text}
                  onClick={() => sendMessage(text)}
                  className="text-left flex items-start gap-2 p-3 bg-card border border-border rounded-xl hover:border-accent/40 transition-all text-xs text-muted hover:text-offwhite"
                >
                  <Icon size={13} className="text-muted shrink-0 mt-0.5" />
                  <span>{text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Upgrade prompt */}
        {showUpgrade && (
          <div className="shrink-0 bg-[rgba(249,168,37,0.06)] border border-gold/20 rounded-2xl p-4 mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-white mb-0.5">Daily limit reached</p>
              <p className="text-xs text-muted">Upgrade to Premium for unlimited queries + priority responses.</p>
            </div>
            <Button variant="outline" size="sm" className="shrink-0 border-gold/40 text-gold hover:bg-gold/10">
              Upgrade $9.99/mo
            </Button>
          </div>
        )}

        {/* Input */}
        <div className="shrink-0">
          <div className={cn(
            "flex items-end gap-3 bg-card border rounded-2xl p-3 transition-colors",
            remaining === 0 ? "border-border opacity-50 pointer-events-none" : "border-border focus-within:border-accent"
          )}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(input);
                }
              }}
              placeholder={remaining > 0 ? "Ask anything about your portfolio…" : "Daily limit reached — upgrade for unlimited access"}
              rows={1}
              disabled={remaining === 0}
              className="flex-1 bg-transparent text-sm text-offwhite placeholder:text-muted2 resize-none focus:outline-none"
              style={{ maxHeight: 120 }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || typing || remaining === 0}
              className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0",
                input.trim() && remaining > 0
                  ? "bg-accent text-white hover:bg-[#7B6CF0]"
                  : "bg-card2 text-muted cursor-not-allowed"
              )}
            >
              <Send size={15} />
            </button>
          </div>
          <p className="text-[10px] text-muted2 text-center mt-2">AI responses are informational only — not financial advice. Press Enter to send, Shift+Enter for new line.</p>
        </div>
      </div>
    </AppShell>
  );
}
