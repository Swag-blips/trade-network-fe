import type { ReactNode } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { CloudUploadIcon } from "@hugeicons/core-free-icons";
import { Button } from "@repo/ui/button";

export function UploadRow({
  label,
  action,
  hint,
  preview,
}: {
  label: string;
  action: string;
  hint: string;
  preview: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-xs">
      <p className="font-sans text-body-sm/[normal] font-medium text-grey-900">
        {label}
      </p>
      <div className="flex items-center gap-md">
        {preview}
        <div className="flex min-w-0 flex-1 flex-col items-start">
          <Button
            variant="ghost"
            size="flush"
            leadingIcon={<HugeiconsIcon icon={CloudUploadIcon} />}
          >
            {action}
          </Button>
          <p className="text-caption text-grey-600">{hint}</p>
        </div>
      </div>
    </div>
  );
}
