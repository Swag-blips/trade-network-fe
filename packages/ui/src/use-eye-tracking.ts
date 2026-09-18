"use client";

import { useEffect, useState, type RefObject } from "react";

export interface EyeOffset {
  x: number;
  y: number;
}

export function useEyeTracking(
  ref: RefObject<HTMLElement | null>,
  maxX: number,
  maxY: number,
): EyeOffset {
  const [offset, setOffset] = useState<EyeOffset>({ x: 0, y: 0 });

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) return;

    let frame = 0;

    function look(event: PointerEvent) {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const element = ref.current;
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        const distance = Math.hypot(dx, dy);
        if (distance < 1) {
          setOffset({ x: 0, y: 0 });
          return;
        }

        const reach = rect.width * 4;
        const strength = Math.min(distance / reach, 1);
        setOffset({
          x: (dx / distance) * maxX * strength,
          y: (dy / distance) * maxY * strength,
        });
      });
    }

    function reset() {
      cancelAnimationFrame(frame);
      setOffset({ x: 0, y: 0 });
    }

    window.addEventListener("pointermove", look);
    document.addEventListener("pointerleave", reset);
    return () => {
      window.removeEventListener("pointermove", look);
      document.removeEventListener("pointerleave", reset);
      cancelAnimationFrame(frame);
    };
  }, [ref, maxX, maxY]);

  return offset;
}
