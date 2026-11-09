"use client";

export type RadioSize = "md" | "lg";

const SIZES: Record<RadioSize, { root: string; input: string; dot: string }> = {
  md: {
    root: "size-5",
    input: "size-5 border-2 border-grey-300",
    dot: "size-2.5",
  },
  lg: {
    root: "size-6",
    input: "size-6 border border-grey-500",
    dot: "size-3",
  },
};

export interface RadioProps {
  checked: boolean;
  onSelect: () => void;
  label: string;
  name: string;
  size?: RadioSize;
}

export function Radio({
  checked,
  onSelect,
  label,
  name,
  size = "md",
}: RadioProps) {
  const styles = SIZES[size];

  return (
    <span
      className={`relative inline-flex flex-none items-center justify-center ${styles.root}`}
    >
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onSelect}
        aria-label={label}
        className={`peer cursor-pointer appearance-none rounded-full bg-white checked:border-evergreen-600 focus-visible:outline-2 focus-visible:outline-evergreen-600 focus-visible:outline-offset-2 ${styles.input}`}
      />
      <span
        className={`pointer-events-none absolute rounded-full bg-evergreen-600 opacity-0 peer-checked:opacity-100 ${styles.dot}`}
      />
    </span>
  );
}
