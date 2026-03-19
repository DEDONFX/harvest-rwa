"use client";

import { useState } from "react";
import { useAuthGuard } from "@/components/AuthGuard";
import Link from "next/link";
import Image from "next/image";
import {
  Bell, BellOff, CheckCheck, Filter, Zap, TrendingUp, Users,
  DollarSign, BarChart2, ArrowUpRight, Sparkles, Clock, Settings
} from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/lib/utils";

type NotifType = "yield" | "investment" | "launch" | "milestone" | "p2p" | "system" | "ai";
type NotifFilter = "all" | NotifType;

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  assetName?: string;
  assetImage?: string;
  amount?: string;
  read: boolean;
  createdAt: Date;
  href?: string;
}

const NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "yield",
    title: "Yield distributed",
    body: "You received $34.20 from Brazil Solar Infrastructure for Q1 distribution.",
    assetName: "Brazil Solar Infrastructure",
    assetImage: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=60&h=60&fit=crop&q=80",
    amount: "+$34.20",
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    href: "/portfolio",
  },
  {
    id: "n2",
    type: "launch",
    title: "New launch live",
    body: "Dubai Marina Apartments just went live. Raise closes in 6 days. 8.4% APY.",
    assetName: "Dubai Marina Apartments",
    assetImage: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=60&h=60&fit=crop&q=80",
    read: false,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    href: "/discover",
  },
  {
    id: "n3",
    type: "ai",
    title: "AI Monthly Report ready",
    body: "Your March 2026 portfolio narrative is ready. Your portfolio is up 5.3% this month.",
    read: false,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    href: "/dashboard",
  },
  {
    id: "n4",
    type: "milestone",
    title: "Raise milestone reached",
    body: "Lisbon Commercial Property hit 75% raised! 847 investors in.",
    assetName: "Lisbon Commercial Property",
    assetImage: "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=60&h=60&fit=crop&q=80",
    read: true,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    href: "/asset/asset-001",
  },
  {
    id: "n5",
    type: "p2p",
    title: "Deposit confirmed",
    body: "Your $200 USDC deposit via OPay Nigeria has been confirmed and credited.",
    amount: "+$200.00",
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    href: "/wallet",
  },
  {
    id: "n6",
    type: "investment",
    title: "Investment confirmed",
    body: "You invested $250 in UK Credit Fund. 250 HVST-UKC tokens added to your portfolio.",
    assetName: "UK Credit Fund",
    assetImage: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=60&h=60&fit=crop&q=80",
    amount: "-$250.00",
    read: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    href: "/portfolio",
  },
  {
    id: "n7",
    type: "yield",
    title: "Yield distributed",
    body: "You received $12.40 from Lisbon Commercial Property quarterly payout.",
    assetName: "Lisbon Commercial Property",
    assetImage: "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=60&h=60&fit=crop&q=80",
    amount: "+$12.40",
    read: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    href: "/portfolio",
  },
  {
    id: "n8",
    type: "system",
    title: "KYC approved",
    body: "Your Tier 1 identity verification has been approved. You can now invest up to $1,000 per transaction.",
    read: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    href: "/settings",
  },
  {
    id: "n9",
    type: "launch",
    title: "Upcoming launch alert",
    body: "Lagos Commercial Hub launches in 2 days. You set a reminder for this one.",
    assetName: "Lagos Commercial Hub",
    read: true,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    href: "/discover",
  },
];

const TYPE_CONFIG: Record<NotifType, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  yield: { icon: DollarSign, color: "text-green", bg: "bg-green/15", label: "Yield" },
  investment: { icon: BarChart2, color: "text-accent", bg: "bg-accent/15", label: "Investment" },
  launch: { icon: Zap, color: "text-accent2", bg: "bg-[rgba(0,210,255,0.15)]", label: "Launch" },
  milestone: { icon: TrendingUp, color: "text-gold", bg: "bg-gold/15", label: "Milestone" },
  p2p: { icon: ArrowUpRight, color: "text-accent2", bg: "bg-[rgba(0,210,255,0.15)]", label: "P2P" },
  system: { icon: Bell, color: "text-muted", bg: "bg-card2", label: "System" },
  ai: { icon: Sparkles, color: "text-gold", bg: "bg-gold/15", label: "AI" },
};

const FILTER_TABS: { id: NotifFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "yield", label: "Yield" },
  { id: "launch", label: "Launches" },
  { id: "investment", label: "Investments" },
  { id: "p2p", label: "Wallet" },
  { id: "ai", label: "AI" },
];

function NotifCard({ notif, onRead }: { notif: Notification; onRead: (id: string) => void }) {
  const cfg = TYPE_CONFIG[notif.type];
  const Icon = cfg.icon;
  const inner = (
      <div className={cn(
        "flex items-start gap-4 p-4 rounded-2xl border transition-all hover:border-accent/30 cursor-pointer",
        notif.read ? "bg-card border-border" : "bg-[rgba(108,92,231,0.04)] border-accent/20"
      )}>
        <div className="relative shrink-0">
          {notif.assetImage ? (
            <div className="w-11 h-11 rounded-xl overflow-hidden relative">
              <Image src={notif.assetImage} alt={notif.assetName ?? "Asset thumbnail"} fill className="object-cover" />
            </div>
          ) : (
            <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", cfg.bg)}>
              <Icon size={18} className={cfg.color} />
            </div>
          )}
          {!notif.read && (
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent border-2 border-ink" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-0.5">
            <p className={cn("text-sm font-medium leading-tight", notif.read ? "text-offwhite" : "text-white")}>
              {notif.title}
            </p>
            <span className="text-[10px] text-muted shrink-0 font-mono">{timeAgo(notif.createdAt)}</span>
          </div>
          <p className="text-xs text-muted leading-relaxed line-clamp-2">{notif.body}</p>
          {notif.amount && (
            <span className={cn(
              "mt-1.5 inline-block text-xs font-mono font-bold",
              notif.amount.startsWith("+") ? "text-green" : "text-red"
            )}>
              {notif.amount}
            </span>
          )}
        </div>
      </div>
  );
  return notif.href ? (
    <Link href={notif.href} onClick={() => onRead(notif.id)}>{inner}</Link>
  ) : (
    <div onClick={() => onRead(notif.id)} className="cursor-pointer">{inner}</div>
  );
}

export default function NotificationsPage() {
  const blocked = useAuthGuard("/notifications");
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const [filter, setFilter] = useState<NotifFilter>("all");

  if (blocked) return null;

  const unreadCount = notifs.filter((n) => !n.read).length;

  const markAllRead = () => setNotifs((n) => n.map((item) => ({ ...item, read: true })));
  const markRead = (id: string) => setNotifs((n) => n.map((item) => item.id === id ? { ...item, read: true } : item));

  const filtered = filter === "all" ? notifs : notifs.filter((n) => n.type === filter);

  const todayNotifs = filtered.filter((n) => {
    const diff = Date.now() - n.createdAt.getTime();
    return diff < 24 * 60 * 60 * 1000;
  });
  const olderNotifs = filtered.filter((n) => {
    const diff = Date.now() - n.createdAt.getTime();
    return diff >= 24 * 60 * 60 * 1000;
  });

  return (
    <AppShell showRightRail={false}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h1 className="font-syne font-black text-2xl text-white">Notifications</h1>
            {unreadCount > 0 && (
              <span className="bg-accent text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllRead}>
                <CheckCheck size={14} /> Mark all read
              </Button>
            )}
            <Link href="/settings">
              <Button variant="ghost" size="sm">
                <Settings size={14} />
              </Button>
            </Link>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {FILTER_TABS.map((tab) => {
            const count = tab.id === "all"
              ? notifs.filter((n) => !n.read).length
              : notifs.filter((n) => n.type === tab.id && !n.read).length;
            return (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={cn(
                  "shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                  filter === tab.id
                    ? "bg-accent/15 border-accent text-accent"
                    : "bg-card border-border text-muted hover:text-offwhite hover:border-accent/30"
                )}
              >
                {tab.label}
                {count > 0 && (
                  <span className={cn(
                    "w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center",
                    filter === tab.id ? "bg-accent text-white" : "bg-card2 text-muted"
                  )}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <BellOff size={36} className="text-muted2 mx-auto mb-4" />
            <p className="text-offwhite font-medium mb-1">No notifications</p>
            <p className="text-sm text-muted">You're all caught up.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {todayNotifs.length > 0 && (
              <div>
                <p className="text-xs text-muted uppercase tracking-widest mb-3">Today</p>
                <div className="space-y-2">
                  {todayNotifs.map((n) => (
                    <NotifCard key={n.id} notif={n} onRead={markRead} />
                  ))}
                </div>
              </div>
            )}

            {olderNotifs.length > 0 && (
              <div>
                <p className="text-xs text-muted uppercase tracking-widest mb-3">Earlier</p>
                <div className="space-y-2">
                  {olderNotifs.map((n) => (
                    <NotifCard key={n.id} notif={n} onRead={markRead} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
