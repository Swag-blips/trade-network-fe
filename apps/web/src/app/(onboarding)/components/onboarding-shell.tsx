import type { ReactNode } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { Wordmark } from "@/components/wordmark";
import { OrgAvatar, UserAvatar } from "@/components/avatars";
import { SidebarFooter } from "@/components/sidebar";

/** Nav destinations don't exist yet this early in onboarding — skeleton placeholders stand in, same idea as the sidebar's real Tab rows. */
const NAV_SKELETON_WIDTHS = ["w-32", "w-32", "w-22", "w-32", "w-32"];

export function OnboardingShell({
  step,
  orgName,
  orgRole,
  children,
}: {
  step: 1 | 2;
  orgName: string;
  orgRole: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-white lg:h-screen lg:flex-row">
      <aside className="hidden w-65.5 flex-none flex-col gap-md border-r border-grey-200 pt-md pb-lg lg:flex">
        <div className="flex h-12 items-center px-md py-2.5">
          <Wordmark className="h-[13.435px] w-[149px] text-evergreen-900" />
        </div>

        <div className="flex min-h-px flex-1 flex-col">
          <nav className="flex min-h-px flex-1 flex-col gap-xs px-md">
            {NAV_SKELETON_WIDTHS.map((width, index) => (
              <span
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                aria-hidden="true"
                className={`h-3 ${width} rounded-full bg-grey-200`}
              />
            ))}
          </nav>

          <div className="flex flex-col gap-md border-t border-grey-100 px-md pt-md">
            <SidebarFooter
              avatar={<OrgAvatar name={orgName} />}
              title={orgName}
              subtitle={orgRole}
            />
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between px-4 py-md sm:px-lg">
          <Wordmark className="h-[13.435px] w-[149px] text-evergreen-900 lg:hidden" />
          <p className="hidden text-body-sm text-grey-500 lg:block">
            Step <span className="font-medium text-grey-900">{step}</span>/2
          </p>
          <button
            type="button"
            className="flex items-center gap-xs rounded-full p-1 hover:bg-grey-100"
          >
            <UserAvatar name={orgName} />
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              size={16}
              className="text-grey-600"
            />
          </button>
        </header>

        <div className="flex min-h-px flex-1 flex-col items-start px-4 py-lg sm:px-2xl sm:py-xl">
          {children}
        </div>
      </div>
    </div>
  );
}
