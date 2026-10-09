"use client";

import { useRef } from "react";
import { useEyeTracking } from "./use-eye-tracking";

/** `avatar` is the 24px Tai that sits inside a 40px avatar circle. */
const SIZES = {
  xs: { px: 20, className: "size-5" },
  avatar: { px: 24, className: "size-6" },
  sm: { px: 32, className: "size-8" },
  md: { px: 56, className: "size-14" },
} as const;

interface TaiAgentProps {
  size?: keyof typeof SIZES;
  className?: string;
}

export function TaiAgent({ size = "md", className = "" }: TaiAgentProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const { px, className: sizeClass } = SIZES[size];
  const offset = useEyeTracking(ref, px * 0.045, px * 0.04);

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none relative inline-block shrink-0 ${sizeClass} ${className}`}
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
