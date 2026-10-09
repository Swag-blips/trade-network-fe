import type { ReactNode } from "react";
import { Wordmark } from "@repo/ui/wordmark";
import { OrgAvatar } from "@repo/ui/avatars";
import { SidebarFooter } from "@repo/ui/sidebar";
import { Steps } from "./steps";

/** Until the company is saved the shell shows the same placeholder the comp does. */
const ORG_NAME = "Mycompany";

function Placeholder({ className }: { className: string }) {
  return (
    <span
      aria-hidden="true"
      className={`rounded-full bg-grey-100 ${className}`}
    />
  );
}

/** Nav destinations don't exist this early in onboarding, so they stand in as bars. */
function NavRow() {
  return (
    <div className="flex items-center gap-2.5">
      <Placeholder className="size-5" />
      <Placeholder className="h-3 w-42.25" />
    </div>
  );
}

export function OnboardingShell({ children }: { children: ReactNode }) {
  // The card owns the scrolling, so the page itself never does. `dvh` because
  // mobile browser chrome makes `100vh` taller than what you can actually see.
  return (
    <div className="flex h-dvh overflow-hidden bg-grey-50">
      <aside className="hidden w-65.5 flex-none flex-col gap-md pt-md pb-lg lg:flex">
        <div className="flex h-12 items-center justify-between px-md py-2.5">
          <Wordmark className="h-[13.435px] w-37.25 text-evergreen-900" />
          <Placeholder className="size-5" />
        </div>

        <div className="flex min-h-px flex-1 flex-col">
          <nav className="flex min-h-px flex-1 flex-col gap-lg px-md">
            <div className="flex flex-col gap-md">
              <NavRow />
              <NavRow />
            </div>
            <div className="flex flex-col gap-md">
              <Placeholder className="h-3 w-31.25" />
              <div className="flex flex-col gap-md">
                <NavRow />
                <NavRow />
              </div>
            </div>
          </nav>

          <div className="border-t border-grey-100 px-md pt-md">
            <SidebarFooter
              avatar={<OrgAvatar name={ORG_NAME} />}
              title={ORG_NAME}
              subtitle="Capital provider"
              action={<Placeholder className="size-5" />}
            />
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col pt-3 lg:pr-2">
        <div className="flex min-h-px flex-1 flex-col overflow-hidden rounded-t-lg border border-grey-100 bg-white shadow-soft-section">
          <header className="flex h-15 flex-none items-center border-b border-grey-100 px-lg py-sm">
            <Steps />
          </header>

          <div className="min-h-px flex-1 overflow-y-auto px-4 py-lg sm:px-20">
            <div className="flex max-w-177.5 flex-col gap-xl">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
