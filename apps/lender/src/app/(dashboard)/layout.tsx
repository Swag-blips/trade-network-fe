import type { ReactNode } from "react";
import { LenderNav } from "./components/lender-nav";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen flex-col bg-white">
      <LenderNav />
      <main className="flex min-h-px flex-1 flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}
