import type { ReactNode } from "react";
import { Wordmark } from "@/components/wordmark";
import { BrandMark } from "@/components/brand-mark";
import { AuthHeaderCta } from "./components/auth-header-cta";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-grey-50">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {/* 1036.558px / 1373.914px don't land on the 4px spacing scale — Figma's sub-pixel export, kept as literal px. */}
        <div className="relative size-[1036.558px]">
          <div className="absolute top-1/2 left-1/2 h-242.75 w-23 -translate-x-1/2 -translate-y-1/2 border border-evergreen-200/76" />
          <div className="absolute top-1/2 left-1/2 h-23 w-[1373.914px] -translate-x-1/2 -translate-y-1/2 border border-evergreen-200/76" />
          <div className="absolute top-1/2 left-1/2 h-23 w-[1373.914px] -translate-x-1/2 -translate-y-1/2 rotate-45 border border-evergreen-200/76" />
          <div className="absolute top-1/2 left-1/2 h-23 w-[1373.914px] -translate-x-1/2 -translate-y-1/2 -rotate-45 border border-evergreen-200/76" />
        </div>
      </div>

      <img
        src="/create-account-glow.svg"
        alt=""
        className="pointer-events-none absolute top-1/2 left-1/2 size-143 -translate-x-1/2 -translate-y-1/2"
      />

      <header className="absolute inset-x-0 top-0 flex items-center justify-between px-4 py-sm sm:px-lg">
        <Wordmark className="h-4 text-evergreen-900" />
        <AuthHeaderCta />
      </header>

      <main className="relative flex w-full max-w-96.5 flex-col items-center gap-2xl px-4 sm:px-0">
        <BrandMark className="h-10 w-13.25 text-evergreen-900" />
        {children}
      </main>
    </div>
  );
}
