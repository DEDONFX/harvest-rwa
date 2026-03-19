interface ChainBadgeProps {
  chain: "mantle" | "solana";
  size?: "sm" | "md";
  showLabel?: boolean;
}

function MantleIcon({ size = 14 }: { size?: number }) {
  // Radial wheel of rectangular segments — matches the real Mantle logo
  const segments = [
    { angle: 0,   w: 1.8, h: 4.2 },
    { angle: 16,  w: 1.6, h: 3.2 },
    { angle: 31,  w: 1.8, h: 5.0 },
    { angle: 47,  w: 1.6, h: 3.6 },
    { angle: 62,  w: 1.8, h: 4.6 },
    { angle: 78,  w: 1.5, h: 2.8 },
    { angle: 93,  w: 1.8, h: 4.0 },
    { angle: 109, w: 1.6, h: 3.4 },
    { angle: 124, w: 1.8, h: 4.8 },
    { angle: 140, w: 1.6, h: 3.0 },
    { angle: 155, w: 1.8, h: 4.4 },
    { angle: 171, w: 1.5, h: 3.6 },
    { angle: 186, w: 1.8, h: 4.2 },
    { angle: 202, w: 1.6, h: 3.2 },
    { angle: 217, w: 1.8, h: 5.0 },
    { angle: 233, w: 1.6, h: 3.6 },
    { angle: 248, w: 1.8, h: 4.6 },
    { angle: 264, w: 1.5, h: 2.8 },
    { angle: 279, w: 1.8, h: 4.0 },
    { angle: 295, w: 1.6, h: 3.4 },
    { angle: 310, w: 1.8, h: 4.8 },
    { angle: 326, w: 1.6, h: 3.0 },
    { angle: 341, w: 1.8, h: 4.4 },
  ];
  const cx = 12, cy = 12, innerR = 3.8;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="mnt-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#00C896" />
        </linearGradient>
      </defs>
      {segments.map((seg, i) => {
        const rad = (seg.angle - 90) * (Math.PI / 180);
        const x = cx + Math.cos(rad) * (innerR + seg.h / 2) - seg.w / 2;
        const y = cy + Math.sin(rad) * (innerR + seg.h / 2) - seg.h / 2;
        const opacity = 0.5 + (i % 3) * 0.2;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={seg.w}
            height={seg.h}
            rx={0.4}
            fill="url(#mnt-grad)"
            fillOpacity={opacity}
            transform={`rotate(${seg.angle}, ${cx}, ${cy})`}
          />
        );
      })}
    </svg>
  );
}

function SolanaIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="12" fill="#9945FF" fillOpacity="0.15" />
      <path d="M6.5 15.5h9l-2 2h-9l2-2z" fill="#9945FF" />
      <path d="M6.5 11.5h9l-2 2h-9l2-2z" fill="#9945FF" fillOpacity="0.7" />
      <path d="M6.5 7.5h9l-2 2h-9l2-2z" fill="#14F195" />
    </svg>
  );
}

export default function ChainBadge({ chain, size = "sm", showLabel = true }: ChainBadgeProps) {
  const iconSize = size === "sm" ? 14 : 16;
  const px = size === "sm" ? "pl-1 pr-1.5 py-0.5 text-[9px]" : "pl-1.5 pr-2 py-1 text-[10px]";

  if (chain === "mantle") {
    return (
      <span
        className={`inline-flex items-center gap-1 font-bold rounded-full border ${px}`}
        style={{
          background: "rgba(59,158,255,0.1)",
          borderColor: "rgba(59,158,255,0.25)",
          color: "#3B9EFF",
        }}
      >
        <MantleIcon size={iconSize} />
        {showLabel && "Mantle"}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 font-bold rounded-full border ${px}`}
      style={{
        background: "rgba(153,69,255,0.1)",
        borderColor: "rgba(153,69,255,0.25)",
        color: "#9945FF",
      }}
    >
      <SolanaIcon size={iconSize} />
      {showLabel && "Solana"}
    </span>
  );
}
