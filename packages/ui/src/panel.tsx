import type { ReactNode } from "react";

export function Panel({
  title,
  divided = false,
  children,
}: {
  title: string;
  divided?: boolean;
  children: ReactNode;
}) {
  return (
    <section className="flex w-full flex-col items-center justify-center gap-md rounded-xl border border-grey-100 bg-white px-5 py-2.5">
      <h3 className="w-full font-sans text-body font-medium text-grey-900">
        {title}
      </h3>
      {divided ? <hr className="w-full border-grey-100" /> : null}
      {children}
    </section>
  );
}
