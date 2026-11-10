import type { ReactNode } from "react";

export function DetailRow({
  label,
  size = "md",
  children,
}: {
  label: string;
  size?: "sm" | "md";
  children: ReactNode;
}) {
  return (
    <div
      className={`flex w-full items-center gap-1 ${size === "sm" ? "text-body-sm" : "text-body"}`}
    >
      <span className="min-w-0 flex-1 text-grey-600">{label}</span>
      <span className="flex flex-none items-center gap-1 whitespace-nowrap text-grey-900">
        {children}
      </span>
    </div>
  );
}
