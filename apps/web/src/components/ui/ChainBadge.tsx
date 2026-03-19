interface ChainBadgeProps {
  chain: "mantle" | "solana";
  size?: "sm" | "md";
  showLabel?: boolean;
}

// 8 evenly-spaced equal rectangular segments at 45° intervals — clean radial wheel
function MantleIcon({ size = 14, id = "cb" }: { size?: number; id?: string }) {
  const angles = [0, 45, 90, 135, 180, 225, 270, 315];
  const cx = 12, cy = 12, innerR = 3.6, segW = 2.4, segH = 4.8;
  const gId = `mnt-${id}`;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id={gId} x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#00C896" stopOpacity="1" />
        </linearGradient>
      </defs>
      {angles.map((angle, i) => {
        const rad = (angle - 90) * (Math.PI / 180);
        const x = cx + Math.cos(rad) * (innerR + segH / 2) - segW / 2;
        const y = cy + Math.sin(rad) * (innerR + segH / 2) - segH / 2;
        return (
          <rect
            key={i}
            x={x} y={y}
            width={segW} height={segH}
            rx={0.6}
            fill={`url(#${gId})`}
            transform={`rotate(${angle}, ${cx}, ${cy})`}
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

export { MantleIcon, SolanaIcon };

export default function ChainBadge({ chain, size = "sm", showLabel = true }: ChainBadgeProps) {
  const iconSize = size === "sm" ? 14 : 16;
  const px = size === "sm" ? "pl-1 pr-1.5 py-0.5 text-[9px]" : "pl-1.5 pr-2 py-1 text-[10px]";

  if (chain === "mantle") {
    return (
      <span
        className={`inline-flex items-center gap-1 font-bold rounded-full border ${px}`}
        style={{
          background: "rgba(0,200,150,0.1)",
          borderColor: "rgba(0,200,150,0.3)",
          color: "#00C896",
        }}
      >
        <MantleIcon size={iconSize} id="badge" />
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
