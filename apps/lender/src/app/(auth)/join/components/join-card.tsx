import type { ReactNode } from "react";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { AuthCard } from "../../components/auth-card";

export function JoinCard({
  icon,
  title,
  children,
}: {
  icon: IconSvgElement;
  title: string;
  children: ReactNode;
}) {
  return (
    <AuthCard width="sm" className="items-start gap-lg">
      <HugeiconsIcon icon={icon} size={32} className="text-grey-900" />
      <div className="flex w-full flex-col gap-lg">
        <h1 className="font-sans text-h4 font-medium text-grey-900">{title}</h1>
        {children}
      </div>
    </AuthCard>
  );
}
