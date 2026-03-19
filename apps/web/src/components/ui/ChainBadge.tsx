interface ChainBadgeProps {
  chain: "mantle" | "solana";
  size?: "sm" | "md";
}

export default function ChainBadge({ chain, size = "sm" }: ChainBadgeProps) {
  const isMantle = chain === "mantle";
  const px = size === "sm" ? "px-1.5 py-0.5 text-[9px]" : "px-2 py-1 text-[10px]";

  if (isMantle) {
    return (
      <span
        className={`inline-flex items-center gap-1 font-bold tracking-wide rounded-full border ${px}`}
        style={{
          background: "rgba(59,158,255,0.12)",
          borderColor: "rgba(59,158,255,0.3)",
          color: "#3B9EFF",
        }}
      >
        <span className="font-black">M</span> MNT
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 font-bold tracking-wide rounded-full border ${px}`}
      style={{
        background: "rgba(153,69,255,0.12)",
        borderColor: "rgba(153,69,255,0.3)",
        color: "#9945FF",
      }}
    >
      ◎ SOL
    </span>
  );
}
