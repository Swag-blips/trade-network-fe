import { Topbar } from "../components/topbar";
import { OpportunityBanner } from "./components/opportunity-banner";
import { OpportunityList } from "./components/opportunity-list";

export default function MatchedOpportunitiesPage() {
  return (
    <>
      <Topbar title="Matched opportunities" />
      <div className="min-h-px flex-1 overflow-y-auto px-lg py-md pb-2xl">
        <OpportunityBanner />
        <div className="pt-xl">
          <OpportunityList />
        </div>
      </div>
    </>
  );
}
