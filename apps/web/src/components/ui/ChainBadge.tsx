interface ChainBadgeProps {
  chain: "mantle" | "solana";
  size?: "sm" | "md";
  showLabel?: boolean;
}

// Real Mantle logo: 20 segments alternating tall/short, white-at-top → green-at-bottom gradient
// gradientUnits="userSpaceOnUse" means ALL rects share the same coordinate-space gradient:
// segments at top of circle = white, segments at bottom = #00C896
function MantleIcon({ size = 14, gid = "cb" }: { size?: number; gid?: string }) {
  const cx = 12, cy = 12, innerR = 4.5, W = 2.2;
  const id = `mnt-${gid}`;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id={id} x1="6" y1="1" x2="18" y2="23" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#00C896" />
        </linearGradient>
      </defs>
      {Array.from({ length: 20 }, (_, i) => {
        const angle = i * 18;
        const h = i % 2 === 0 ? 5.5 : 3.0;
        const rad = (angle - 90) * (Math.PI / 180);
        const x = cx + Math.cos(rad) * (innerR + h / 2) - W / 2;
        const y = cy + Math.sin(rad) * (innerR + h / 2) - h / 2;
        return (
          <rect
            key={i}
            x={x} y={y}
            width={W} height={h}
            rx={0.45}
            fill={`url(#${id})`}
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
        <MantleIcon size={iconSize} gid="badge" />
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
