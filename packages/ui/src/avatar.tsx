import type { ReactNode } from "react";

export interface AvatarProps {
  src?: string;
  name: string;
  size?: number;
  fallback?: ReactNode;
  className?: string;
}

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0] ?? "")
    .join("")
    .toUpperCase();
}

export function Avatar({
  src,
  name,
  size = 24,
  fallback,
  className,
}: AvatarProps) {
  return (
    <span
      className={`inline-flex flex-none items-center justify-center overflow-hidden rounded-full ${className ?? ""}`}
      style={{ width: size, height: size }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          width={size}
          height={size}
          className="size-full object-cover"
        />
      ) : (
        (fallback ?? (
          <span
            aria-hidden="true"
            className="font-sans leading-none font-medium"
            style={{ fontSize: Math.round(size * 0.4) }}
          >
            {initials(name)}
          </span>
        ))
      )}
    </span>
  );
}
