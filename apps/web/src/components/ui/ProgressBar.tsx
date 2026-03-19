"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface ProgressBarProps {
  value: number; // 0–100
  className?: string;
  height?: number;
  animated?: boolean;
  showLabel?: boolean;
}

export default function ProgressBar({
  value,
  className,
  height = 6,
  animated = true,
  showLabel = false,
}: ProgressBarProps) {
  const [width, setWidth] = useState(0);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      requestAnimationFrame(() => setWidth(Math.min(Math.max(value, 0), 100)));
    } else {
      setWidth(Math.min(Math.max(value, 0), 100));
    }
  }, [value]);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className="flex-1 rounded-full bg-divider overflow-hidden"
        style={{ height }}
      >
        <div
          className="h-full progress-fill rounded-full"
          style={{
            width: `${width}%`,
            transition: animated ? "width 0.8s ease" : "none",
          }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-mono text-muted shrink-0">
          {value.toFixed(0)}%
        </span>
      )}
    </div>
  );
}
