import { Alert02Icon, MoneySafeIcon } from "@hugeicons/core-free-icons";
import { Topbar } from "../components/topbar";
import { WelcomeBanner } from "./components/welcome-banner";
import { StatCard } from "./components/stat-card";
import { CapitalDeployedCard } from "./components/capital-deployed-card";
import {
  FUNDING_OPPORTUNITY_ICON,
  NewForYouCard,
  type UpdateItem,
} from "./components/new-for-you-card";
import { WelcomeModalHost } from "./components/welcome-modal-host";

const STATS = [
  {
    label: "Available capital",
    value: "₦700,000,000",
    caption: "remaining",
    icon: MoneySafeIcon,
  },
  {
    label: "Outstanding",
    value: "₦0",
    caption: "balance receivable",
    icon: Alert02Icon,
    muted: true,
  },
];

const UPDATES: UpdateItem[] = [
  {
    id: "funding-opportunity",
    label: "Funding opportunity",
    href: "/matched",
    count: 4,
    icon: FUNDING_OPPORTUNITY_ICON,
  },
];

export default function LenderHomePage() {
  return (
    <>
      <Topbar title="Home" />
      <div className="min-h-px flex-1 overflow-y-auto pb-lg">
        <WelcomeBanner />

        <div className="mt-xl grid grid-cols-[minmax(0,1fr)_375px] items-start gap-xl px-lg">
          <section id="dashboard-overview" className="flex flex-col">
            <h2 className="py-xs font-sans text-body font-medium text-grey-900">
              Overview
            </h2>
            <div className="mt-md flex flex-col gap-md">
              <div className="flex items-center gap-sm">
                {STATS.map((stat) => (
                  <StatCard key={stat.label} {...stat} />
                ))}
              </div>
              <CapitalDeployedCard
                title="Total capital deployed"
                period="Aug 01, 2026 - Sep 01, 2026"
                filterLabel="All time"
              />
            </div>
          </section>

          <NewForYouCard items={UPDATES} />
        </div>
      </div>
      <WelcomeModalHost />
    </>
  );
}
