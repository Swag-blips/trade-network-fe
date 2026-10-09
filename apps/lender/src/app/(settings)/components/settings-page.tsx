import type { ReactNode } from "react";

export function SettingsPage({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <>
      <header className="flex h-14.25 flex-none items-center border-b border-grey-100 px-xl">
        <h1 className="font-sans text-body font-medium text-grey-900">
          {title}
        </h1>
      </header>
      <div className="min-h-px flex-1 overflow-y-auto px-xl py-lg">
        {children}
      </div>
    </>
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
