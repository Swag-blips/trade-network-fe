import { OpportunityWorkspace } from "./components/opportunity-workspace";

export default function OpportunitiesPage() {
  return (
    <div className="min-h-px flex-1 overflow-y-auto bg-grey-50">
      <div className="mx-auto flex w-full max-w-content flex-col gap-xl px-xl pt-lg pb-xl">
        <OpportunityWorkspace
          title={
            <h1 className="min-w-0 flex-1 font-brand text-2xl/[1.24] font-medium text-grey-900">
              Financing opportunities
            </h1>
          }
        />
      </div>
    </div>
  );
}
