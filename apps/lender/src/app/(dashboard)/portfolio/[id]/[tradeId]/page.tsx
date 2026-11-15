import { TradeDetail } from "./components/trade-detail";

export default async function TradePage({
  params,
}: {
  params: Promise<{ id: string; tradeId: string }>;
}) {
  const { tradeId } = await params;

  return (
    <div className="min-h-px flex-1 overflow-y-auto bg-grey-50">
      <div className="mx-auto flex w-full max-w-content flex-col gap-xl px-xl py-xl">
        <TradeDetail id={tradeId} />
      </div>
    </div>
  );
}
