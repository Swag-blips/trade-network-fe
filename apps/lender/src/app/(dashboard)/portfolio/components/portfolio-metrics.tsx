"use client";

import {
  AlertCircleIcon,
  BankIcon,
  Clock02Icon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";
import { formatAmount, withKobo } from "@/utils/naira";
import { StatCard } from "./stat-card";
import { usePortfolioSummary } from "../hooks/use-portfolio-summary";

export function PortfolioMetrics() {
  const { data: portfolio } = usePortfolioSummary();
  const trades = portfolio?.activeFundings ?? 0;

  return (
    <div className="flex items-stretch gap-2.5">
      <StatCard
        featured
        className="w-80.25 flex-none"
        label="Total outstanding balance"
        value={portfolio ? `₦ ${withKobo(portfolio.outstanding)}` : "—"}
        caption={
          portfolio
            ? `across ${trades} ${trades === 1 ? "trade" : "trades"}`
            : undefined
        }
        icon={Wallet01Icon}
      />
      <StatCard
        label="Total financed"
        value={portfolio ? `₦ ${formatAmount(portfolio.financed)}` : "—"}
        caption="amount financed across trades"
        icon={BankIcon}
      />
      <StatCard
        label="At risk"
        value="—"
        caption="portfolio at risk"
        icon={AlertCircleIcon}
      />
      <StatCard
        label="Need attention"
        value="—"
        caption="portfolio requiring monitoring"
        icon={Clock02Icon}
      />
    </div>
  );
}
