"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import { SettingsPage, SectionHeading } from "../../components/settings-page";
import { MandateForm } from "./components/mandate-form";
import { useMandate } from "./hooks/use-mandate";

function FormPlaceholder() {
  return (
    <div aria-hidden className="flex animate-pulse flex-col gap-lg">
      <div className="h-16 w-tour-card rounded-md bg-grey-100" />
      <div className="h-16 rounded-md bg-grey-100" />
      <div className="h-48 rounded-lg bg-grey-100" />
      <div className="h-20 rounded-md bg-grey-100" />
    </div>
  );
}

export default function FundingMandatePage() {
  const { data: mandate, isPending, isError } = useMandate();

  return (
    <SettingsPage title="Funding mandate">
      <div className="flex max-w-126.5 flex-col gap-lg">
    
        <div className="flex items-center gap-xs rounded-md bg-azure-50 px-md py-sm">
          <HugeiconsIcon
            icon={InformationCircleIcon}
            size={20}
            className="flex-none text-azure-600"
          />
          <p className="text-body-sm text-azure-700">
            You can update your funding mandate once every 30 days. (1 left)
          </p>
        </div>

        <SectionHeading
          title="Funding mandate"
          description="Set your funding preferences and limits."
        />

        {isPending ? (
          <FormPlaceholder />
        ) : isError ? (
          <p className="text-body-sm text-grey-600">
            We couldn&rsquo;t load your funding mandate. Please refresh to try
            again.
          </p>
        ) : (
          <MandateForm mandate={mandate} />
        )}
      </div>
    </SettingsPage>
  );
}
