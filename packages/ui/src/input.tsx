import type { InputHTMLAttributes, ReactNode } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leading?: ReactNode;
}

export function Input({ leading, className = "", ...props }: InputProps) {
  return (
    <div
      className={`flex h-10 w-full items-center gap-2.5 overflow-hidden rounded-md border border-grey-300 bg-white px-sm font-sans text-body-sm/[normal] text-grey-900 focus-within:border-evergreen-600 ${className}`}
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
