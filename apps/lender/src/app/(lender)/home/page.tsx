import { Topbar } from "../components/topbar";
import { WelcomeBanner } from "./components/welcome-banner";
import { OverviewStats } from "./components/overview-stats";
import { CapitalDeployedCard } from "./components/capital-deployed-card";
import { NewForYouCard } from "./components/new-for-you-card";
import { WelcomeModalHost } from "./components/welcome-modal-host";

export default function LenderHomePage() {
  return (
    <>
      <Topbar title="Home" />
      <div className="min-h-px flex-1 overflow-y-auto pb-lg">
        <WelcomeBanner />

        <div className="mt-xl grid grid-cols-[minmax(0,1fr)_375px] items-start gap-xl px-lg">
          <section id="dashboard-overview" className="flex flex-col">
            <h2 className="border-b border-grey-100 py-xs font-sans text-body font-medium text-grey-900">
              Overview
            </h2>
            <div className="flex flex-col gap-md py-md">
              <OverviewStats />
              <CapitalDeployedCard />
            </div>
          </section>

          <NewForYouCard />
        </div>
      </div>
      <WelcomeModalHost />
    </>
  );
}
