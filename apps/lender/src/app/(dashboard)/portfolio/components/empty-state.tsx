import type { ReactNode } from "react";

export function EmptyState({
  title,
  children,
  bodyWidth,
  className = "",
}: {
  title: string;
  children: ReactNode;
  bodyWidth: string;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-xs text-center ${className}`}
    >
      <p className="text-body/[1.5] font-medium text-grey-600">{title}</p>
      <p className={`max-w-full text-body-sm/[1.5] text-grey-500 ${bodyWidth}`}>
        {children}
      </p>
    </div>
  );
}
