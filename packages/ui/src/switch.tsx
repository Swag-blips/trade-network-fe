"use client";

export interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
}

export function Switch({
  checked,
  onCheckedChange,
  label,
  disabled = false,
}: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={`relative inline-flex h-6 w-11 flex-none cursor-pointer items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-evergreen-600 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none ${
        checked ? "bg-evergreen-600" : "bg-grey-300"
      }`}
    >
      <span
        className={`absolute size-5 rounded-full bg-white transition-[left] duration-150 motion-reduce:transition-none ${
          checked ? "left-[22px]" : "left-0.5"
        }`}
      />
    </button>
  );
}
