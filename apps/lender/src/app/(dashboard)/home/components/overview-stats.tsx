"use client";

import { Alert02Icon, MoneySafeIcon } from "@hugeicons/core-free-icons";
import { naira } from "@/utils/naira";
import { TextPlaceholder } from "@/components/text-placeholder";
import { useDashboardOverview } from "../../hooks/use-dashboard-overview";
import { StatCard } from "@/components/stat-card";

export function OverviewStats() {
  const { data: overview, isPending, isError } = useDashboardOverview();

  function figure(amount: number | undefined) {
    if (isPending) return <TextPlaceholder className="w-32" />;
    if (isError || amount === undefined) return "—";
    return naira(amount);
  }

  return (
    <div className="flex items-center gap-sm">
      <StatCard
        label="Available capital"
        value={figure(overview?.availableCapital)}
        caption="remaining"
        icon={MoneySafeIcon}
      />
      <StatCard
        label="Outstanding"
        value={figure(overview?.outstandingAmount)}
        caption="balance receivable"
        icon={Alert02Icon}
        muted={!overview?.outstandingAmount}
      />
    </div>
  );
}
