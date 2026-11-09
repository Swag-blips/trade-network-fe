import Image from "next/image";
import { OpportunityBanner } from "./components/opportunity-banner";
import { MatchingPreference } from "./components/matching-preference";
import { RequestsPane } from "./components/requests-pane";
import { FinancingPreference } from "./components/financing-preference";

export default function OpportunitiesPage() {
  return (
    <div className="min-h-px flex-1 overflow-y-auto bg-grey-50">
      <div className="mx-auto flex w-full max-w-content flex-col gap-xl px-xl pt-lg pb-xl">
        <OpportunityBanner />

        <section className="flex flex-col gap-lg">
          <div className="flex flex-col gap-2.5">
            <h1 className="font-brand text-2xl/[1.24] font-medium text-grey-900">
              Financing opportunities
            </h1>
            <MatchingPreference />
          </div>

          <div className="flex h-149.75 overflow-hidden rounded-lg border border-grey-100 shadow-card">
            <RequestsPane />
            <div className="relative flex min-w-0 flex-1 items-center justify-center overflow-hidden bg-white shadow-small-thick">
              <Image
                src="/opportunities/preview-glow.svg"
                alt=""
                width={2358}
                height={2358}
                unoptimized
                className="pointer-events-none absolute top-[calc(50%-9.5px)] left-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
              />
              <FinancingPreference />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
