"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Settings01Icon } from "@hugeicons/core-free-icons";
import { SidebarFooter } from "@repo/ui/sidebar";
import { IconButton } from "@repo/ui/icon-button";
import { OrgAvatar } from "@repo/ui/avatars";
import { useDashboardProfile } from "../hooks/use-dashboard-profile";
import { TextPlaceholder } from "./text-placeholder";

export function OrgFooter() {
  const { data: profile, isPending } = useDashboardProfile();
  const name = profile?.profileName ?? "";

  return (
    <SidebarFooter
      avatar={<OrgAvatar name={name} />}
      title={isPending ? <TextPlaceholder className="w-32" /> : name}
      subtitle="Capital provider"
      action={
        <IconButton label="Organisation settings" size="sm">
          <HugeiconsIcon icon={Settings01Icon} />
        </IconButton>
      }
    />
  );
}
