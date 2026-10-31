import { HugeiconsIcon } from "@hugeicons/react";
import { LicenseDraftIcon } from "@hugeicons/core-free-icons";
import { Button } from "@repo/ui/button";

export function Topbar({ title }: { title: string }) {
  return (
    <header className="flex items-center gap-2.5 border-b border-grey-100 bg-white px-lg py-sm">
      <h1 className="min-w-0 flex-1 font-sans text-body font-medium text-grey-900">
        {title}
      </h1>
      <Button
        variant="outline"
        leadingIcon={<HugeiconsIcon icon={LicenseDraftIcon} />}
      >
        Update mandate
      </Button>
    </header>
  );
}
