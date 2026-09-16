import { Topbar } from "../components/topbar";
import {
  PortfolioBanner,
  PORTFOLIO_ICONS,
} from "./components/portfolio-banner";
import { PortfolioTable } from "./components/portfolio-table";
import { CUSTOMERS, PORTFOLIO_SUMMARY } from "./data";

export default function PortfolioPage() {
  return (
    <>
      <Topbar title="Portfolio" />
      <div className="min-h-px flex-1 overflow-y-auto pb-lg">
        <PortfolioBanner
          stats={[
            {
              label: "Available capital",
              value: PORTFOLIO_SUMMARY.availableCapital,
              caption: "remaining",
              icon: PORTFOLIO_ICONS.capital,
            },
            {
              label: "Outstanding",
              value: PORTFOLIO_SUMMARY.outstanding,
              caption: "balance receivable",
              icon: PORTFOLIO_ICONS.outstanding,
              tone: "danger",
            },
            {
              label: "Suppliers",
              value: String(PORTFOLIO_SUMMARY.suppliersFunded),
              caption: "funded",
              icon: PORTFOLIO_ICONS.suppliers,
            },
            {
              label: "Distributors",
              value: String(PORTFOLIO_SUMMARY.distributorsFunded),
              caption: "funded",
              icon: PORTFOLIO_ICONS.distributors,
            },
          ]}
        />
        <div className="flex flex-col pt-xl">
          <PortfolioTable customers={CUSTOMERS} />
        </div>
      </div>
    </>
  );
}
