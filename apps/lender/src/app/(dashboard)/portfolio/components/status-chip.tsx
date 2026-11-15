import { TRADE_STATUS, type TradeStatus } from "../types/portfolio";

export function StatusChip({ status }: { status: TradeStatus }) {
  const tone = TRADE_STATUS[status];
  return (
    <span
      className={`inline-flex flex-none items-center rounded-full px-xs py-1 font-sans text-body-sm/[normal] font-medium ${tone.className}`}
    >
      {tone.label}
    </span>
  );
}
