"use client";

import { MOCK_TICKER_ITEMS } from "@/lib/mock-data";

const colorMap: Record<string, string> = {
  green: "text-green",
  amber: "text-gold",
  blue: "text-accent2",
  red: "text-red",
};

const dotMap: Record<string, string> = {
  green: "bg-green",
  amber: "bg-gold",
  blue: "bg-accent2",
  red: "bg-red",
};

export default function TickerTape() {
  // Duplicate items to create seamless loop
  const items = [...MOCK_TICKER_ITEMS, ...MOCK_TICKER_ITEMS];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[28px] bg-surface border-b border-border ticker-wrap">
      <div className="ticker-inner flex items-center h-full gap-0">
        {items.map((item, i) => (
          <span
            key={`${item.id}-${i}`}
            className="inline-flex items-center gap-1.5 px-4 text-[11px] border-r border-border/40 h-full shrink-0"
          >
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotMap[item.color]}`} />
            <span className="text-muted font-mono">{item.address}</span>
            <span className={`font-medium ${colorMap[item.color]}`}>{item.type}</span>
            <span className="text-offwhite/70">{item.asset}</span>
            <span className={`font-mono font-medium ${colorMap[item.color]}`}>{item.amount}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
