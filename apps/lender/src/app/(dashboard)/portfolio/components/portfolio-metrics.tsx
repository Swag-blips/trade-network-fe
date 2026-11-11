import {
  AlertCircleIcon,
  Clock02Icon,
  Layers01Icon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";
import { StatCard } from "./stat-card";
import { compactAmount, parseAmount, withKobo } from "@/utils/naira";
import type { Customer } from "../types/customer";
import { sum } from "../utils/amount";

export function PortfolioMetrics({ customers }: { customers: Customer[] }) {
  const outstanding = sum(customers.map((c) => parseAmount(c.outstanding)));
  const financed = sum(customers.map((c) => parseAmount(c.totalFunded)));
  const trades = sum(customers.map((c) => c.activeTrades));
  const atRisk = customers.filter(
    (c) => c.health === "at-risk" || c.health === "critical",
  ).length;
  const needAttention = customers.filter((c) => c.health === "watch").length;

  return (
    <div className="flex items-stretch gap-2.5">
      <StatCard
        featured
        className="w-80.25 flex-none"
        label="Total outstanding balance"
        value={`₦ ${withKobo(outstanding)}`}
        caption={`across ${trades} ${trades === 1 ? "trade" : "trades"}`}
        icon={Wallet01Icon}
      />
      <StatCard
        label="Total financed"
        value={`₦ ${compactAmount(financed)}`}
        caption="amount financed across trades"
        icon={Layers01Icon}
      />
      <StatCard
        label="At risk"
        value={atRisk}
        caption="portfolio at risk"
        icon={AlertCircleIcon}
      />
      <StatCard
        label="Need attention"
        value={needAttention}
        caption="portfolio requiring monitoring"
        icon={Clock02Icon}
      />
    </div>
  );
}
