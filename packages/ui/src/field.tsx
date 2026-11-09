import type { ReactNode } from "react";

export type FieldVariant = "form" | "auth" | "question" | "caption";

const VARIANTS: Record<FieldVariant, { root: string; label: string }> = {
  form: { root: "gap-xs", label: "text-body-sm/[normal]" },
  auth: { root: "gap-xs", label: "text-body/[1.21]" },
  question: { root: "gap-sm", label: "text-body/[1.21]" },
  caption: { root: "gap-xs", label: "text-caption/[normal]" },
};

export function FieldError({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="text-caption text-red-error-500">
      {children}
    </p>
  );
}

export function Field({
  label,
  required = false,
  optional = false,
  htmlFor,
  hint,
  error,
  variant = "form",
  children,
  className = "",
}: {
  label: string;
  required?: boolean;
  /** Appends a muted "(Optional)". */
  optional?: boolean;
  htmlFor?: string;
  hint?: string;
  error?: string;
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
        {optional ? <span className="text-grey-500"> (Optional)</span> : null}
      </label>
      {children}
      {hint ? <p className="text-caption text-grey-600">{hint}</p> : null}
      {error ? <FieldError>{error}</FieldError> : null}
    </div>
  );
}
