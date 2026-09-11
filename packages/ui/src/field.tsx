import type { ReactNode } from "react";

export function Field({
  label,
  required = false,
  htmlFor,
  hint,
  children,
  className = "",
}: {
  label: string;
  required?: boolean;
  htmlFor?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex min-w-0 flex-col gap-xs ${className}`}>
      <label
        htmlFor={htmlFor}
        className="font-sans text-body-sm/[normal] font-medium text-grey-900"
      >
        {label}
        {required ? "*" : ""}
      </label>
      {children}
      {hint ? <p className="text-caption text-grey-600">{hint}</p> : null}
    </div>
  );
}
