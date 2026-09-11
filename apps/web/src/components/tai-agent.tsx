"use client";

import { useRef } from "react";
import { useEyeTracking } from "@/hooks/use-eye-tracking";

interface TaiAgentProps {
  size?: "xs" | "sm" | "md";
  className?: string;
}

const PX = { xs: 20, sm: 32, md: 56 } as const;

export function TaiAgent({ size = "md", className = "" }: TaiAgentProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const px = PX[size];
  const offset = useEyeTracking(ref, px * 0.045, px * 0.04);

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none relative inline-block shrink-0 ${size === "xs" ? "size-5" : size === "sm" ? "size-8" : "size-14"} ${className}`}
    >
      <span
        className="absolute top-1/2 left-1/2 size-[97.5%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-tai opacity-40"
        style={{ filter: `blur(${px * 0.625}px)` }}
      />
      <span className="absolute top-[12.8%] left-0 h-[74.4%] w-[96%] overflow-hidden rounded-full bg-tai">
        <span className="absolute top-1/2 left-[52.08%] flex h-[26.9%] w-[41.67%] -translate-x-1/2 -translate-y-1/2 items-center justify-between">
          <span
            className="h-full w-[25%] rounded-full bg-white transition-transform duration-150 ease-out motion-reduce:transition-none"
            style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
          />
          <span
            className="h-full w-[25%] rounded-full bg-white transition-transform duration-150 ease-out motion-reduce:transition-none"
            style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
          />
        </span>
      </span>
    </span>
  );
}
