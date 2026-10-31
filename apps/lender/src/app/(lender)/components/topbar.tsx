import { HugeiconsIcon } from "@hugeicons/react";
import { LicenseDraftIcon } from "@hugeicons/core-free-icons";
import { Button } from "@repo/ui/button";
import { ProfileMenu } from "./profile-menu";

export function Topbar({ title }: { title: string }) {
  return (
    <header className="flex items-center gap-2.5 border-b border-grey-100 bg-white px-lg py-sm">
      <h1 className="min-w-0 flex-1 font-sans text-body font-medium text-grey-900">
        {title}
      </h1>
      <div className="flex flex-none items-center gap-md">
        <Button
          variant="secondary"
          leadingIcon={<HugeiconsIcon icon={LicenseDraftIcon} />}
        >
          Update mandate
        </Button>
        <ProfileMenu />
      </div>
    </header>
  );
}
