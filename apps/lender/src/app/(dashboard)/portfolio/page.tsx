import { PortfolioMetrics } from "./components/portfolio-metrics";
import { PortfolioTable } from "./components/portfolio-table";

export default function PortfolioPage() {
  return (
    <div className="min-h-px flex-1 overflow-y-auto bg-grey-50">
      <div className="mx-auto flex w-full max-w-content flex-col gap-10 px-xl py-xl">
        <div className="flex flex-col gap-xs">
          <h1 className="font-brand text-2xl/[1.24] font-medium text-grey-900">
            Portfolio Management
          </h1>
          <p className="text-body/[normal] text-grey-600">
            Monitor your financed trades, track repayments, and stay on top of
            outstanding balances.
          </p>
        </div>

        <div className="flex flex-col gap-lg">
          <PortfolioMetrics />
          <PortfolioTable />
        </div>
      </div>
    </div>
  );
}
