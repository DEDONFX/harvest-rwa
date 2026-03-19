"use client";

import { useState, useEffect } from "react";
import TickerTape from "./TickerTape";
import TopBar from "./TopBar";
import Sidebar, { MobileBottomNav } from "./Sidebar";
import RightRail from "./RightRail";
import ContextStrip from "./ContextStrip";
import { cn } from "@/lib/utils";
import { getIsLoggedIn } from "@/lib/auth";

interface AppShellProps {
  children: React.ReactNode;
  showRightRail?: boolean;
  showContextStrip?: boolean;
  className?: string;
}

export default function AppShell({
  children,
  showRightRail = true,
  showContextStrip = true,
  className,
}: AppShellProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(getIsLoggedIn());
  }, []);

  return (
    <div className="min-h-screen bg-ink">
      <TickerTape />
      <TopBar isLoggedIn={isLoggedIn} />
      <Sidebar isLoggedIn={isLoggedIn} />

      <div className="pt-[84px] md:pl-14 pb-16 md:pb-0 min-h-screen flex">
        {showContextStrip && <ContextStrip />}
        <div className={cn("flex-1 flex gap-6 min-w-0 max-w-[1440px] mx-auto px-6 py-6", className)}>
          <main className="flex-1 min-w-0">{children}</main>
          {showRightRail && <RightRail />}
        </div>
      </div>
      <MobileBottomNav isLoggedIn={isLoggedIn} />
    </div>
  );
}
