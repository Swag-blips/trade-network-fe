import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon } from "@hugeicons/core-free-icons";
import { Button } from "@repo/ui/button";
import { SettingsPage } from "../../components/settings-page";

export default function DeleteAccountPage() {
  return (
    <SettingsPage title="Delete account">
      <section className="max-w-[506px] overflow-hidden rounded-lg border border-grey-200">
        <div className="flex flex-col gap-1 p-md">
          <h2 className="font-sans text-body font-medium text-grey-900">
            Delete your account
          </h2>
          <p className="text-body-sm text-grey-600">
            Permanently delete your account and all data associated with it,
            this action cannot be undone.
          </p>
        </div>
        <div className="border-t border-grey-200 bg-grey-50 p-md">
          <Button
            variant="destructive"
            size="form"
            leadingIcon={<HugeiconsIcon icon={Delete02Icon} />}
          >
            Delete account
          </Button>
        </div>
      </section>
    </SettingsPage>
  );
}
