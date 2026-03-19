import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  hoverable?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export default function Card({
  elevated = false,
  hoverable = false,
  padding = "md",
  className,
  children,
  ...props
}: CardProps) {
  const paddings = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={cn(
        "rounded-card border border-border",
        elevated ? "bg-card2" : "bg-card",
        paddings[padding],
        hoverable && "card-hover cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
