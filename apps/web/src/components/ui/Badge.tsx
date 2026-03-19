import { cn } from "@/lib/utils";

type BadgeVariant =
  | "default"
  | "accent"
  | "green"
  | "amber"
  | "red"
  | "cyan"
  | "outline";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

const variants: Record<BadgeVariant, string> = {
  default: "bg-card2 text-muted border border-border",
  accent: "bg-[rgba(108,92,231,0.15)] text-accent border border-[rgba(108,92,231,0.3)]",
  green: "bg-[rgba(0,200,150,0.15)] text-green border border-[rgba(0,200,150,0.3)]",
  amber: "bg-[rgba(249,168,37,0.15)] text-gold border border-[rgba(249,168,37,0.3)]",
  red: "bg-[rgba(255,71,87,0.15)] text-red border border-[rgba(255,71,87,0.3)]",
  cyan: "bg-[rgba(0,210,255,0.12)] text-accent2 border border-[rgba(0,210,255,0.25)]",
  outline: "bg-transparent text-muted border border-border",
};

export default function Badge({
  variant = "default",
  children,
  className,
  dot,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5",
        "text-[11px] font-medium uppercase tracking-wide font-dm",
        variants[variant],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full shrink-0",
            variant === "green" && "bg-green",
            variant === "amber" && "bg-gold",
            variant === "red" && "bg-red",
            variant === "accent" && "bg-accent",
            variant === "cyan" && "bg-accent2",
            variant === "default" && "bg-muted",
            variant === "outline" && "bg-muted"
          )}
        />
      )}
      {children}
    </span>
  );
}
