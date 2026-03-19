interface ChainBadgeProps {
  chain: "mantle" | "solana";
  size?: "sm" | "md";
  showLabel?: boolean;
}

function MantleIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="12" fill="#3B9EFF" fillOpacity="0.15" />
      <path
        d="M5 17V7l4.5 5.5L12 7l2.5 5.5L19 7v10"
        stroke="#3B9EFF"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
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
