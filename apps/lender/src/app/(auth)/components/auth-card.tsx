import type { ReactNode } from "react";

const WIDTH = {
  sm: "max-w-96.5",
  md: "max-w-122.75",
};

export function AuthCard({
  width,
  className = "",
  children,
}: {
  width: keyof typeof WIDTH;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      // 24px radius has no named token (the scale stops at --radius-xl,
      // 16px) and this drop-shadow matches no existing elevation token —
      // both kept verbatim from Figma.
      className={`flex w-full flex-col rounded-[24px] border border-grey-100 bg-white p-lg drop-shadow-[0px_1px_1px_rgba(2,34,33,0.1)] ${WIDTH[width]} ${className}`}
    >
      {children}
    </div>
  );
}
