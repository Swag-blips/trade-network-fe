import type { ReactNode } from "react";

export function Notice({ children }: { children: ReactNode }) {
  return (
    <p className="w-full border-l-4 border-orange-500 bg-orange-50 px-lg py-2.5 text-body/[1.5] text-grey-900">
      {children}
    </p>
  );
}
