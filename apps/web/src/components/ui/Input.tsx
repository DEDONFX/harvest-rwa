"use client";

import { cn } from "@/lib/utils";
import { InputHTMLAttributes, ReactNode, forwardRef } from "react";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "prefix" | "suffix"> {
  label?: string;
  error?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, prefix, suffix, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-xs font-medium text-muted uppercase tracking-wide font-dm">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {prefix && (
            <div className="absolute left-3 text-muted pointer-events-none">
              {prefix}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full bg-card border border-border rounded-btn",
              "px-4 py-3 text-sm text-offwhite placeholder:text-muted2 font-dm",
              "transition-all duration-150",
              prefix && "pl-9",
              suffix && "pr-9",
              error && "border-red",
              className
            )}
            {...props}
          />
          {suffix && (
            <div className="absolute right-3 text-muted pointer-events-none">
              {suffix}
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs text-red font-dm">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
