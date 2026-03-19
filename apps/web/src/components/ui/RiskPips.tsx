import { cn } from "@/lib/utils";

interface RiskPipsProps {
  score: number; // 1–10
  className?: string;
}

export function getRiskLabel(score: number) {
  if (score <= 2) return { label: "Very Low", color: "text-green", pip: "green" };
  if (score <= 4) return { label: "Low", color: "text-green", pip: "green" };
  if (score <= 6) return { label: "Medium", color: "text-gold", pip: "amber" };
  if (score <= 8) return { label: "High", color: "text-red", pip: "red" };
  return { label: "Very High", color: "text-red", pip: "red" };
}

export function getRiskBadgeClass(score: number) {
  if (score <= 4) return "bg-[rgba(0,200,150,0.15)] text-green border border-[rgba(0,200,150,0.3)]";
  if (score <= 6) return "bg-[rgba(249,168,37,0.15)] text-gold border border-[rgba(249,168,37,0.3)]";
  return "bg-[rgba(255,71,87,0.15)] text-red border border-[rgba(255,71,87,0.3)]";
}

export default function RiskPips({ score, className }: RiskPipsProps) {
  const risk = getRiskLabel(score);

  // 5 pips total
  const filledCount = score <= 2 ? 5 : score <= 4 ? 3 : score <= 6 ? 4 : 5;

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "pip",
              i < filledCount
                ? risk.pip === "green"
                  ? "pip-filled-green"
                  : risk.pip === "amber"
                  ? "pip-filled-amber"
                  : "pip-filled-red"
                : "pip-empty"
            )}
          />
        ))}
      </div>
      <span className={cn("text-[11px] font-medium font-dm", risk.color)}>
        {score}/10 · {risk.label}
      </span>
    </div>
  );
}
