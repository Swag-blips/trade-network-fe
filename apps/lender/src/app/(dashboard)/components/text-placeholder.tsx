/** Holds a name's place while the profile loads, so the line doesn't jump. */
export function TextPlaceholder({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block h-lh animate-pulse rounded-sm bg-grey-100 align-middle ${className}`}
    />
  );
}
