"use client";

import { UserAvatar } from "@repo/ui/avatars";
import { useDashboardProfile } from "@/hooks/use-dashboard-profile";
import { TextPlaceholder } from "../../components/text-placeholder";

function Glow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 h-55 overflow-hidden"
    >
      <div className="absolute -top-30 -left-7.25 size-54.5 rounded-full bg-evergreen-400 opacity-[0.06] blur-[60px]" />
      <div className="absolute -top-17.5 left-32.75 size-54.5 rounded-full bg-linen-400 opacity-[0.06] blur-[60px]" />
    </div>
  );
}

export function WelcomeBanner() {
  const { data: profile, isPending } = useDashboardProfile();
  const firstName = profile?.firstName ?? "";

  return (
    <div className="relative">
      <Glow />
      <div className="relative flex items-center gap-md px-lg pt-lg">
        <UserAvatar
          src={profile?.profilePictureUrl ?? undefined}
          name={firstName}
          size={64}
        />
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <p className="font-brand text-2xl/[1.5] font-medium text-grey-900">
            {isPending ? (
              <>
                Welcome, <TextPlaceholder className="w-24" />
              </>
            ) : firstName ? (
              `Welcome, ${firstName}.`
            ) : (
              // The profile failed to load; greet without a name rather than "Welcome, ."
              "Welcome."
            )}
          </p>
          <p className="text-body-sm text-grey-600">
            Here&rsquo;s what&rsquo;s happening across your dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
