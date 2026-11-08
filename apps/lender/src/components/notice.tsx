import type { ReactNode } from "react";

export type NoticeTone = "warning" | "success";

const TONES: Record<NoticeTone, string> = {
  warning: "border-orange-500 bg-orange-50",
  success: "border-green-500 bg-green-50",
};

export function Notice({
  tone = "warning",
  children,
}: {
  tone?: NoticeTone;
  children: ReactNode;
}) {
  return (
    <p
      className={`w-full border-l-4 px-lg py-2.5 text-body/[1.5] text-grey-900 ${TONES[tone]}`}
    >
      {children}
    </p>
  );
}
