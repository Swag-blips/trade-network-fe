"use client";

import { useMandate } from "@/hooks/use-mandate";
import { MandateForm } from "./mandate-form";

function FormPlaceholder() {
  return (
    <div
      aria-hidden
      className="flex w-157.5 max-w-full animate-pulse flex-col gap-10"
    >
      <div className="h-20 rounded-md bg-grey-100" />
      <div className="h-20 rounded-md bg-grey-100" />
      <div className="h-40 rounded-md bg-grey-100" />
      <div className="h-48 rounded-lg bg-grey-100" />
    </div>
  );
}

export function MandateLoader() {
  const { data: mandate, isPending, isError } = useMandate();
  if (isPending) return <FormPlaceholder />;

  if (isError) {
    return (
      <p className="text-body-sm text-grey-600">
        We couldn&rsquo;t load your funding mandate. Please refresh to try
        again.
      </p>
    );
  }

  return <MandateForm mandate={mandate} />;
}
