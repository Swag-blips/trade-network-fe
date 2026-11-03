import { HugeiconsIcon } from "@hugeicons/react";
import { LicenseDraftIcon } from "@hugeicons/core-free-icons";
import { ButtonLink } from "@repo/ui/button-link";

export function Topbar({ title }: { title: string }) {
  return (
    <header className="flex items-center gap-2.5 border-b border-grey-100 bg-white px-lg py-sm">
      <h1 className="min-w-0 flex-1 font-sans text-body font-medium text-grey-900">
        {title}
      </h1>
      <ButtonLink
        href="/settings/funding-mandate"
        variant="outline"
        leadingIcon={<HugeiconsIcon icon={LicenseDraftIcon} />}
      >
        Update mandate
      </ButtonLink>
    </header>
  );
}
