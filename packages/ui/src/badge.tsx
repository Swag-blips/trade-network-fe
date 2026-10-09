import type { ReactNode } from "react";

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-sm bg-grey-100 px-1.5 py-0.5 font-sans text-[0.625rem]/[normal] font-medium tracking-[0.5px] text-grey-600 uppercase">
      {children}
    </span>
  );
}
