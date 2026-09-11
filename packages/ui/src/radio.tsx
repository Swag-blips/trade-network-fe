"use client";

export interface RadioProps {
  checked: boolean;
  onSelect: () => void;
  label: string;
  name: string;
}

export function Radio({ checked, onSelect, label, name }: RadioProps) {
  return (
    <span className="relative inline-flex size-5 flex-none items-center justify-center">
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onSelect}
        aria-label={label}
        className="peer size-5 cursor-pointer appearance-none rounded-full border-2 border-grey-300 bg-white checked:border-evergreen-600 focus-visible:outline-2 focus-visible:outline-evergreen-600 focus-visible:outline-offset-2"
      />
      <span className="pointer-events-none absolute size-2.5 rounded-full bg-evergreen-600 opacity-0 peer-checked:opacity-100" />
    </span>
  );
}
