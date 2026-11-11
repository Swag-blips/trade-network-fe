import { HugeiconsIcon } from "@hugeicons/react";
import {
  ComputerIcon,
  MoreHorizontalIcon,
  SmartPhone01Icon,
} from "@hugeicons/core-free-icons";
import { IconButton } from "@repo/ui/icon-button";
import type { LoginSession } from "../types/session";
import { describeDevice, sessionDay, sessionTime } from "../utils/session";

export function SessionRow({ session }: { session: LoginSession }) {
  const device = describeDevice(session.userAgent);

  return (
    <li className="flex items-center gap-lg bg-white p-md">
      <div className="flex min-w-0 flex-1 items-center gap-md">
        <span className="flex size-10 flex-none items-center justify-center rounded-full border border-grey-200 bg-white text-grey-900">
          <HugeiconsIcon
            icon={device.kind === "mobile" ? SmartPhone01Icon : ComputerIcon}
            size={20}
          />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="text-body/[1.5] font-medium text-grey-900">
            {device.label}
          </p>
          <p className="text-body-sm/[normal] text-grey-600">
            {sessionDay(session.createdAt)} • {sessionTime(session.createdAt)}{" "}
            • IP: {session.ipAddress}
          </p>
        </div>
      </div>
      <IconButton label="Session options" variant="tertiary" size="lg">
        <HugeiconsIcon icon={MoreHorizontalIcon} />
      </IconButton>
    </li>
  );
}
