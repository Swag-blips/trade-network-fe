import type { ReactNode } from "react";
import { LenderSidebar } from "./components/lender-sidebar";
import { AgentFab } from "@/components/agent-fab";

export default function LenderLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-grey-50">
      <LenderSidebar />
      <div className="flex min-w-0 flex-1 flex-col pt-sm pr-xs">
        <div className="flex min-h-px flex-1 flex-col overflow-hidden rounded-xl border border-grey-200 bg-white shadow-soft-section">
          {children}
        </div>
      </div>
      <AgentFab />
    </div>
  );
}
