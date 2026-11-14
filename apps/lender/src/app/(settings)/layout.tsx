import type { ReactNode } from "react";
import { DeletionGate } from "@/components/deletion-gate";
import { SettingsSidebar } from "./components/settings-sidebar";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-white">
      <SettingsSidebar />
      <div className="flex min-w-0 flex-1 flex-col border-l border-grey-100">
        <DeletionGate>{children}</DeletionGate>
      </div>
    </div>
  );
}
