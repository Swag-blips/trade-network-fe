import { HugeiconsIcon } from "@hugeicons/react";
import { BankIcon } from "@hugeicons/core-free-icons";
import { Avatar } from "./avatar";

function PersonPlaceholder() {
  return (
    <svg
      viewBox="0 0 64 64"
      className="size-full"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="32" cy="32" r="32" className="fill-grey-300" />
      <g className="fill-grey-100">
        <circle cx="32" cy="22.4" r="9.6" />
        <path d="M12.8 54.4C12.8 43.7961 21.3961 35.2 32 35.2C42.6039 35.2 51.2 43.7961 51.2 54.4V64H12.8V54.4Z" />
      </g>
    </svg>
  );
}

export function UserAvatar({
  src,
  name,
  size = 24,
}: {
  src?: string;
  name: string;
  size?: number;
}) {
  return (
    <Avatar
      src={src}
      name={name}
      size={size}
      fallback={<PersonPlaceholder />}
    />
  );
}

export function OrgAvatar({
  name,
  size = 32,
}: {
  name: string;
  size?: number;
}) {
  return (
    <Avatar
      name={name}
      size={size}
      className="bg-linear-to-b from-[#53b8d8] to-ocean-500 text-white"
      fallback={
        <HugeiconsIcon
          icon={BankIcon}
          size={Math.round(size * 0.5)}
          className="text-white"
        />
      }
    />
  );
}

export function InitialsAvatar({
  initials,
  size = 40,
  className = "",
}: {
  initials: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.29) }}
      className={`inline-flex flex-none items-center justify-center overflow-hidden rounded-full border border-linen-200 bg-linen-100 font-sans font-medium text-linen-600 ${className}`}
    >
      {initials}
    </span>
  );
}
