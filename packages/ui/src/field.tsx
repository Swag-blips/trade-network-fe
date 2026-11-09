import type { ReactNode } from "react";

export type FieldVariant = "form" | "auth" | "question" | "caption";

const VARIANTS: Record<FieldVariant, { root: string; label: string }> = {
  form: { root: "gap-xs", label: "text-body-sm/[normal]" },
  auth: { root: "gap-xs", label: "text-body/[1.21]" },
  question: { root: "gap-sm", label: "text-body/[1.21]" },
  caption: { root: "gap-xs", label: "text-caption/[normal]" },
};

export function Field({
  label,
  required = false,
  htmlFor,
  hint,
  variant = "form",
  children,
  className = "",
}: {
  label: string;
  required?: boolean;
  htmlFor?: string;
  hint?: string;
  variant?: FieldVariant;
  children: ReactNode;
  className?: string;
}) {
  const styles = VARIANTS[variant];

  return (
    <div className={`flex min-w-0 flex-col ${styles.root} ${className}`}>
      <label
        htmlFor={htmlFor}
        className={`font-sans font-medium text-grey-900 ${styles.label}`}
      >
        {label}
        {required ? "*" : ""}
      </label>
      {children}
      {hint ? <p className="text-caption text-grey-600">{hint}</p> : null}
    </div>
  );
}
