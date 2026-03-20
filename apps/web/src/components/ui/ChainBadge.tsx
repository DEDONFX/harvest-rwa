import Image from "next/image";

export type ChainId = "mantle";

interface ChainBadgeProps {
  chain: ChainId;
  size?: "sm" | "md";
  showLabel?: boolean;
}

export const CHAIN_META: Record<ChainId, { label: string; logo: string; color: string; bg: string; border: string }> = {
  mantle: { label: "Mantle", logo: "/mantle-logo.png", color: "#00C896", bg: "rgba(0,200,150,0.1)", border: "rgba(0,200,150,0.3)" },
};

export function ChainIcon({ chain, size = 14 }: { chain: ChainId; size?: number }) {
  const meta = CHAIN_META[chain];
  return (
    <Image
      src={meta.logo}
      alt={meta.label}
      width={size}
      height={size}
      style={{ width: size, height: size, objectFit: "contain", flexShrink: 0 }}
    />
  );
}

export function MantleIcon({ size = 14 }: { size?: number }) {
  return <ChainIcon chain="mantle" size={size} />;
}

export default function ChainBadge({ chain, size = "sm", showLabel = true }: ChainBadgeProps) {
  const meta = CHAIN_META[chain];
  const iconSize = size === "sm" ? 13 : 15;
  const px = size === "sm" ? "pl-1 pr-1.5 py-0.5 text-[9px]" : "pl-1.5 pr-2 py-1 text-[10px]";
  return (
    <span
      className={`inline-flex items-center gap-1 font-bold rounded-full border ${px}`}
      style={{ background: meta.bg, borderColor: meta.border, color: meta.color }}
    >
      <ChainIcon chain={chain} size={iconSize} />
      {showLabel && meta.label}
    </span>
  );
}
