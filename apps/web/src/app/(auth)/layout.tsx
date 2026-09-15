"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ButtonLink } from "@/components/button-link";
import { Wordmark } from "@/components/wordmark";
import { BrandMark } from "@/components/brand-mark";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const isLoginFlow = usePathname().startsWith("/login");

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-grey-50">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="relative size-[1036.558px]">
          <div className="absolute top-1/2 left-1/2 h-[971px] w-[92px] -translate-x-1/2 -translate-y-1/2 border border-evergreen-200/76" />
          <div className="absolute top-1/2 left-1/2 h-[92px] w-[1373.914px] -translate-x-1/2 -translate-y-1/2 rotate-45 border border-evergreen-200/76" />
          <div className="absolute top-1/2 left-1/2 h-[92px] w-[1373.914px] -translate-x-1/2 -translate-y-1/2 -rotate-45 border border-evergreen-200/76" />
        </div>
      </div>

      <img
        src="/create-account-glow.svg"
        alt=""
        className="pointer-events-none absolute top-1/2 left-1/2 size-[572px] -translate-x-1/2 -translate-y-1/2"
      />

      <header className="absolute inset-x-0 top-0 flex items-center justify-between px-4 py-sm sm:px-lg">
        <Wordmark className="h-4 text-evergreen-900" />
        <ButtonLink
          href={isLoginFlow ? "/create-account" : "/login"}
          variant="secondary"
          size="form"
        >
          {isLoginFlow ? "Create a new account" : "Login"}
        </ButtonLink>
      </header>

      <main className="relative flex w-full max-w-[386px] flex-col items-center gap-2xl px-4 sm:px-0">
        <BrandMark className="h-10 w-[53px] text-evergreen-900" />
        {children}
      </main>
    </div>
  );
}
