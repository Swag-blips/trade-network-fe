import {
  AlertCircleIcon,
  Clock02Icon,
  Layers01Icon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";
import { StatCard } from "@/components/stat-card";
import { compactAmount } from "@/utils/naira";
import type { Customer } from "../types/customer";
import { toAmount, withKobo } from "../utils/amount";

const sum = (values: number[]) =>
  values.reduce((total, value) => total + value, 0);

export function PortfolioMetrics({ customers }: { customers: Customer[] }) {
  const outstanding = sum(customers.map((c) => toAmount(c.outstanding)));
  const financed = sum(customers.map((c) => toAmount(c.totalFunded)));
  const trades = sum(customers.map((c) => c.activeTrades));
  const atRisk = customers.filter(
    (c) => c.health === "at-risk" || c.health === "critical",
  ).length;
  const needAttention = customers.filter((c) => c.health === "watch").length;

  return (
    <div className="flex items-stretch gap-2.5">
      <StatCard
        featured
        size="lg"
        className="w-80.25 flex-none"
        label="Total outstanding balance"
        value={`₦ ${withKobo(outstanding)}`}
        caption={`across ${trades} ${trades === 1 ? "trade" : "trades"}`}
        icon={Wallet01Icon}
      />
      <StatCard
        size="lg"
        label="Total financed"
        value={`₦ ${compactAmount(financed)}`}
        caption="amount financed across trades"
        icon={Layers01Icon}
      />
      <StatCard
        size="lg"
        label="At risk"
        value={atRisk}
        caption="portfolio at risk"
        icon={AlertCircleIcon}
      />
      <StatCard
        size="lg"
        label="Need attention"
        value={needAttention}
        caption="portfolio requiring monitoring"
        icon={Clock02Icon}
      />
    </div>
  );
}
