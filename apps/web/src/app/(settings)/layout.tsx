import type { ReactNode } from "react";
import { SettingsSidebar } from "./components/settings-sidebar";
import { AgentFab } from "@/components/agent-fab";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-white">
      <SettingsSidebar />
      <div className="flex min-w-0 flex-1 flex-col border-l border-grey-100">
        {children}
      </div>
      <AgentFab />
    </div>
  );
}
