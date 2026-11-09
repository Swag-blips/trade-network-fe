import type { InputHTMLAttributes, ReactNode } from "react";

export type InputVariant = "form" | "auth" | "strong";

const VARIANTS: Record<InputVariant, string> = {
  form: "border-grey-300 text-body-sm/[normal]",
  auth: "border-grey-200 text-body/[normal]",
  strong: "border-grey-300 text-body/[normal]",
};

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leading?: ReactNode;
  variant?: InputVariant;
}

export function Input({
  leading,
  variant = "form",
  className = "",
  ...props
}: InputProps) {
  return (
    <div
      className={`flex h-10 w-full items-center gap-2.5 overflow-hidden rounded-md border bg-white px-sm font-sans text-grey-900 focus-within:border-evergreen-600 ${VARIANTS[variant]} ${className}`}
    >
      {leading ? (
        <span className="flex-none text-grey-900">{leading}</span>
      ) : null}
      <input
        className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-grey-500"
        {...props}
      />
    </div>
  );
}
