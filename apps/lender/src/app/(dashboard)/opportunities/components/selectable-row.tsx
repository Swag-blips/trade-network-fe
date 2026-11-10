import type { ReactNode } from "react";

export function SelectableRow({
  selected,
  onSelect,
  className = "",
  children,
}: {
  selected: boolean;
  onSelect: () => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-current={selected || undefined}
      onClick={onSelect}
      className={`relative flex w-full cursor-pointer gap-sm border-y p-md text-left transition-colors motion-reduce:transition-none ${
        selected
          ? "border-grey-100 bg-grey-50"
          : "border-transparent bg-white hover:bg-grey-50"
      } ${className}`}
    >
      {selected ? (
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 w-1 bg-evergreen-500"
        />
      ) : null}
      {children}
    </button>
  );
}
