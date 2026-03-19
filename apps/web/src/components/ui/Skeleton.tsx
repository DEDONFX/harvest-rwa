import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  rounded?: boolean;
}

export default function Skeleton({ className, rounded = false }: SkeletonProps) {
  return (
    <div
      className={cn(
        "skeleton",
        rounded ? "rounded-full" : "rounded-lg",
        className
      )}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-card p-4 space-y-3">
      <Skeleton className="h-28 w-full rounded-lg" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-2 w-full" />
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-8 flex-1" />
        <Skeleton className="h-8 w-8" />
      </div>
    </div>
  );
}
