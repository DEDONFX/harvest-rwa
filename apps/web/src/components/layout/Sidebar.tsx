"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  BarChart2,
  Wallet,
  Sparkles,
  Settings,
  Rss,
  Search,
  Bell,
  LayoutDashboard,
  TrendingUp,
  History,
  ShieldCheck,
  Lock,
  Activity,
} from "lucide-react";
import HarvestLogo from "@/components/HarvestLogo";
import { cn } from "@/lib/utils";

const PUBLIC_NAV = [
  { icon: Rss, href: "/feed", label: "Feed" },
  { icon: Activity, href: "/market", label: "Market" },
  { icon: Search, href: "/discover", label: "Discover" },
  { icon: TrendingUp, href: "/list", label: "List Asset" },
];

const PERSONAL_NAV = [
  { icon: LayoutDashboard, href: "/dashboard", label: "Dashboard" },
  { icon: BarChart2, href: "/portfolio", label: "Portfolio" },
  { icon: Wallet, href: "/wallet", label: "Wallet" },
  { icon: History, href: "/wallet#history", label: "Transactions" },
  { icon: Bell, href: "/notifications", label: "Notifications" },
  { icon: Sparkles, href: "/advisor", label: "AI Advisor" },
  { icon: ShieldCheck, href: "/kyc", label: "KYC / Identity" },
  { icon: Settings, href: "/settings", label: "Settings" },
];

interface SidebarProps {
  isLoggedIn?: boolean;
}

function NavLink({
  icon: Icon,
  href,
  label,
  locked,
  isActive,
}: {
  icon: React.ElementType;
  href: string;
  label: string;
  locked?: boolean;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      title={locked ? `Sign up to access ${label}` : label}
      className={cn(
        "group relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150",
        isActive
          ? "bg-accent/15 text-accent"
          : locked
          ? "text-muted/40 hover:text-muted hover:bg-card2"
          : "text-muted hover:text-offwhite hover:bg-card2"
      )}
    >
      <Icon size={18} />
      {locked && (
        <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-surface border border-border flex items-center justify-center text-muted">
          <Lock size={5} />
        </span>
      )}
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-accent rounded-r-full" />
      )}
      <span className="absolute left-full ml-2 px-2 py-1 bg-card2 border border-border rounded-lg text-xs text-offwhite whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
        {locked ? `Sign up to use ${label}` : label}
      </span>
    </Link>
  );
}

export default function Sidebar({ isLoggedIn = true }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex fixed left-0 top-[28px] bottom-0 z-30 w-14 flex-col items-center py-4 border-r border-border bg-surface">
      {/* Logo mark */}
      <Link href="/" className="mb-4">
        <HarvestLogo variant="icon" size={32} />
      </Link>

      {/* Public nav */}
      <div className="flex flex-col items-center gap-1 w-full px-2">
        {PUBLIC_NAV.map(({ icon, href, label }) => (
          <NavLink
            key={label}
            icon={icon}
            href={href}
            label={label}
            isActive={pathname === href || pathname.startsWith(href + "/")}
          />
        ))}
      </div>

      {/* Divider */}
      <div className="w-6 border-t border-border my-3" />

      {/* Personal nav — scrollable if needed */}
      <div className="flex flex-col items-center gap-1 w-full px-2 flex-1 overflow-y-auto scrollbar-none">
        {PERSONAL_NAV.map(({ icon, href, label }) => {
          const cleanHref = href.split("#")[0];
          const locked = !isLoggedIn;
          const resolvedHref = locked ? `/signup?next=${cleanHref}` : href;
          const isActive =
            !locked &&
            (pathname === cleanHref || pathname.startsWith(cleanHref + "/"));
          return (
            <NavLink
              key={label}
              icon={icon}
              href={resolvedHref}
              label={label}
              locked={locked}
              isActive={isActive}
            />
          );
        })}
      </div>

      {/* Avatar / auth CTA at bottom */}
      <div className="mt-3">
        {isLoggedIn ? (
          <Link href="/dashboard" title="My Account">
            <button className="w-8 h-8 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-accent text-xs font-bold font-syne hover:bg-accent/30 transition-colors">
              AJ
            </button>
          </Link>
        ) : (
          <Link href="/signup" title="Create account">
            <button className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-muted text-xs hover:border-accent/40 hover:text-offwhite transition-colors">
              <Compass size={14} />
            </button>
          </Link>
        )}
      </div>
    </aside>
  );
}

const MOBILE_NAV = [
  { icon: Rss, href: "/feed", label: "Feed" },
  { icon: Search, href: "/discover", label: "Discover" },
  { icon: LayoutDashboard, href: "/dashboard", label: "Dashboard" },
  { icon: BarChart2, href: "/portfolio", label: "Portfolio" },
  { icon: Activity, href: "/market", label: "Market" },
];

export function MobileBottomNav({ isLoggedIn = true }: { isLoggedIn?: boolean }) {
  const pathname = usePathname();
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border flex items-center justify-around px-1 py-2">
      {MOBILE_NAV.map(({ icon: Icon, href, label }) => {
        const locked = !isLoggedIn && ["/dashboard", "/portfolio", "/notifications"].includes(href);
        const resolvedHref = locked ? `/signup?next=${href}` : href;
        const isActive = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={label}
            href={resolvedHref}
            className={cn(
              "flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors min-w-0",
              isActive ? "text-accent" : "text-muted"
            )}
          >
            <Icon size={20} />
            <span className="text-[9px] font-medium">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
