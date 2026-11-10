import type { ReactNode } from "react";
import { ProviderLockup } from "@/components/provider-lockup";
import { AuthHeaderCta } from "./components/auth-header-cta";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-grey-50">
      <header className="flex flex-none items-center justify-between px-4 py-md sm:px-lg">
        <ProviderLockup />
        <AuthHeaderCta />
      </header>

      <main className="flex flex-1 items-center justify-center px-4 pb-7.5 sm:px-0">
        {children}
      </main>
    </div>
  );
}
