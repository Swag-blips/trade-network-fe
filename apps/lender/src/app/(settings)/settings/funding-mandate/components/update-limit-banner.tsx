import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { IconButton } from "@repo/ui/icon-button";

export function UpdateLimitBanner({
  title,
  children,
  onDismiss,
}: {
  title: string;
  children: React.ReactNode;
  onDismiss: () => void;
}) {
  return (
    <div
      role="status"
      className="flex items-start gap-md border-l-4 border-orange-500 bg-orange-50 px-lg py-2.5"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="text-body/[1.5] font-medium text-grey-900">{title}</p>
        <p className="text-body-sm/[1.4] text-grey-800 opacity-80">
          {children}
        </p>
      </div>
      <IconButton label="Dismiss" size="xs" onClick={onDismiss}>
        <HugeiconsIcon icon={Cancel01Icon} />
      </IconButton>
    </div>
  );
}
