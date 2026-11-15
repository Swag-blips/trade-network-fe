import { PageGlow } from "@/components/page-glow";
import { BorrowerDetail } from "../components/borrower-detail";

export default async function CustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="relative min-h-px flex-1 overflow-y-auto bg-grey-50">
      <PageGlow />
      <div className="relative mx-auto flex w-full max-w-content flex-col gap-xl px-xl py-xl">
        <BorrowerDetail id={id} />
      </div>
    </div>
  );
}
