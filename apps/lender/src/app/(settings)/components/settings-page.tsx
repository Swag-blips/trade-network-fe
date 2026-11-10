import type { ReactNode } from "react";

export function SettingsPage({
  title,
  description,
  gap = "lg",
  children,
}: {
  title: string;
  description?: string;
  gap?: "lg" | "xl";
  children: ReactNode;
}) {
  return (
    <div className="min-h-px flex-1 overflow-y-auto">
      <div
        className={`flex flex-col px-xl pt-xl pb-lg ${gap === "xl" ? "gap-xl" : "gap-lg"}`}
      >
        <div className="flex flex-col gap-1">
          <h1 className="font-brand text-2xl/[1.5] font-medium text-grey-900">
            {title}
          </h1>
          {description ? (
            <p className="text-body/[normal] text-grey-600">{description}</p>
          ) : null}
        </div>

        {children}
      </div>
    </div>
  );
}

export function SectionHeading({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <h2 className="font-sans text-xl/normal font-medium text-grey-900">
        {title}
      </h2>
      {description ? (
        <p className="text-body-sm text-grey-600">{description}</p>
      ) : null}
    </div>
  );
}
