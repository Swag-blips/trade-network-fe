export type ButtonVariant =
  "primary" | "secondary" | "tertiary" | "outline" | "ghost" | "destructive";

export type ButtonSize = "sm" | "md" | "lg" | "form" | "auth" | "flush";

const BASE =
  "group relative inline-flex cursor-pointer items-center justify-center " +
  "rounded-full font-sans font-medium " +
  "whitespace-nowrap transition-colors duration-100 ease-out " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-evergreen-600 " +
  "disabled:cursor-not-allowed motion-reduce:transition-none";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-evergreen-600 text-white " +
    "not-disabled:active:bg-evergreen-800 " +
    "not-disabled:hover:[&_[data-label]]:opacity-50 " +
    "not-disabled:active:[&_[data-label]]:opacity-100 " +
    "disabled:bg-evergreen-600/40",
  secondary:
    "inset-ring inset-ring-grey-200 bg-grey-100 text-grey-900 " +
    "not-disabled:hover:bg-grey-200 not-disabled:active:bg-grey-300 " +
    "disabled:inset-ring-grey-200 disabled:bg-grey-100 disabled:text-grey-900/40",
  tertiary:
    "inset-ring inset-ring-grey-200 bg-white text-grey-900 " +
    "not-disabled:hover:bg-grey-50 not-disabled:active:bg-grey-100 " +
    "disabled:inset-ring-grey-200 disabled:bg-white disabled:text-grey-900/40",
  outline:
    "inset-ring inset-ring-evergreen-600 bg-transparent text-evergreen-600 " +
    "not-disabled:hover:bg-grey-100 not-disabled:active:bg-grey-200 " +
    "disabled:inset-ring-evergreen-600/40 disabled:bg-white disabled:text-evergreen-600/40",
  ghost:
    "bg-transparent text-evergreen-600 " +
    "disabled:bg-white disabled:text-evergreen-600/40",
  destructive:
    "bg-destructive text-white " +
    "not-disabled:hover:bg-destructive-hover not-disabled:active:bg-destructive " +
    "disabled:bg-destructive-hover/20",
};

const SIZES: Record<ButtonSize, { button: string; content: string }> = {
  sm: {
    button: "px-1.5 py-1 text-body-sm/[normal]",
    content: "gap-xxs [&_svg]:size-4",
  },
  md: {
    button: "p-xs text-body-sm/[normal]",
    content: "gap-xs [&_svg]:size-5",
  },
  lg: {
    button: "px-lg py-md text-body/[normal]",
    content: "gap-xs [&_svg]:size-5",
  },
  form: {
    button: "px-md py-xs text-body-sm/[normal]",
    content: "gap-xs [&_svg]:size-5",
  },
  auth: {
    button: "px-md py-2.5 text-body/[normal]",
    content: "gap-xs [&_svg]:size-5",
  },
  flush: {
    button: "py-xs text-body-sm/[normal]",
    content: "gap-xs [&_svg]:size-5",
  },
};

function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/**
 * Button styling without the <button> element — for anchors and links, which
 * need the same visuals but cannot be a <button>.
 */
export function buttonClasses({
  variant = "primary",
  size = "md",
}: { variant?: ButtonVariant; size?: ButtonSize } = {}) {
  return {
    root: cx(BASE, VARIANTS[variant], SIZES[size].button),
    content: cx("inline-flex items-center", SIZES[size].content),
  };
}
