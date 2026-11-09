import type { ReactNode } from "react";
import Image from "next/image";
import { BrandMark } from "@repo/ui/brand-mark";
import { ProviderLockup } from "@/components/provider-lockup";
import { StepCount, StepProgress } from "./steps";

function OnboardingAside() {
  return (
    <aside className="relative hidden w-119.5 flex-none overflow-hidden lg:block">
      <div className="absolute top-[-7.53%] left-0 h-[118.74%] w-[108.58%]">
        <Image
          src="/brand/onboarding-photo.webp"
          alt=""
          fill
          priority
          sizes="520px"
          className="object-cover"
        />
      </div>
      {/* Off-palette stops, verbatim from Figma. */}
      <div className="absolute inset-0 bg-linear-to-b from-[rgba(13,47,43,0)] from-[6.856%] to-[#0d2f2b] to-[79.861%]" />

      <div className="absolute bottom-[-506.74px] left-48 flex h-[1116.742px] w-[1108.912px] items-center justify-center">
        <Image
          src="/onboarding/aside-polygon.svg"
          alt=""
          width={994}
          height={984}
          unoptimized
          className="h-[984.396px] w-[993.536px] max-w-none flex-none rotate-[-97.72deg]"
        />
      </div>

      <div className="absolute right-3.5 bottom-31 left-8.5 flex flex-col gap-md text-evergreen-50">
        <p className="font-brand text-[32px]/[1.24] font-medium">
          Where capital meets opportunity.
        </p>
        <p className="max-w-[403px] text-[20px]/[1.5] opacity-80">
          Connect with businesses seeking trade financing and unlock new
          opportunities to grow your portfolio.
        </p>
      </div>

      <BrandMark className="absolute right-7 bottom-7.5 h-10 w-13.25 text-evergreen-50" />
    </aside>
  );
}

export function OnboardingShell({ children }: { children: ReactNode }) {
  // Each step owns its scrolling, so the page itself never does. `dvh` because
  // mobile browser chrome makes `100vh` taller than what you can actually see.
  return (
    <div className="flex h-dvh overflow-hidden bg-white">
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-none items-center justify-between border-b border-grey-100 px-4 py-md sm:px-lg">
          <ProviderLockup />
          <StepCount />
        </header>
        <StepProgress />
        {children}
      </div>

      <OnboardingAside />
    </div>
  );
}
