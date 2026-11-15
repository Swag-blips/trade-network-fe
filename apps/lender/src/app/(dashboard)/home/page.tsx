import { PageGlow } from "@/components/page-glow";
import { Greeting } from "./components/greeting";
import { HomeMetrics } from "./components/home-metrics";
import { RecentUpdates } from "./components/recent-updates";

export default function LenderHomePage() {
  return (
    <div className="relative min-h-px flex-1 overflow-y-auto">
      <PageGlow />
      <div className="relative mx-auto flex w-full max-w-252 flex-col gap-xl px-lg py-10">
        <div className="flex flex-col gap-lg">
          <Greeting />
          <HomeMetrics />
        </div>
        <RecentUpdates />
      </div>
    </div>
  );
}
