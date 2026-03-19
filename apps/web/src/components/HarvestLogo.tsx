interface HarvestLogoProps {
  variant?: "full" | "icon" | "inline";
  /** Controls the icon square size in px */
  size?: number;
  className?: string;
}

/** SVG icon mark only — the amber square with H + rising yield arrow */
function IconMark({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      <rect width="44" height="44" rx="8" fill="#C8872A" />
      {/* H letterform */}
      <path
        d="M12 10 L12 34 M12 22 L22 22 M22 10 L22 34"
        stroke="#080809"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Rising yield arrow */}
      <path
        d="M26 28 L30 22 L34 25 L38 16"
        stroke="#080809"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="38" cy="16" r="2.5" fill="#080809" />
    </svg>
  );
}

/**
 * Official Harvest.rwa logo.
 *
 * variant="icon"   — amber square mark only (sidebar, favicon)
 * variant="inline" — mark + HARVEST.rwa on one line (topbar, nav)
 * variant="full"   — mark + stacked HARVEST / .RWA (auth screens)
 */
export default function HarvestLogo({
  variant = "inline",
  size = 28,
  className,
}: HarvestLogoProps) {
  if (variant === "icon") {
    return <IconMark size={size} />;
  }

  if (variant === "inline") {
    const fontSize = Math.round(size * 0.65);
    return (
      <div
        className={className}
        style={{ display: "flex", alignItems: "center", gap: Math.round(size * 0.3) }}
      >
        <IconMark size={size} />
        <span
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 800,
            fontSize,
            lineHeight: 1,
            letterSpacing: "0.02em",
            color: "#EFEFEF",
            whiteSpace: "nowrap",
          }}
        >
          HARVEST
          <span style={{ color: "#E8A03C" }}>.rwa</span>
        </span>
      </div>
    );
  }

  // variant === "full" — stacked
  const fontSize = Math.round(size * 0.55);
  return (
    <div
      className={className}
      style={{ display: "flex", alignItems: "center", gap: Math.round(size * 0.3) }}
    >
      <IconMark size={size} />
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
        <span
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 800,
            fontSize: Math.round(size * 0.52),
            letterSpacing: "0.08em",
            color: "#EFEFEF",
          }}
        >
          HARVEST
        </span>
        <span
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 700,
            fontSize: Math.round(size * 0.35),
            letterSpacing: "0.12em",
            color: "#E8A03C",
          }}
        >
          .RWA
        </span>
      </div>
    </div>
  );
}
