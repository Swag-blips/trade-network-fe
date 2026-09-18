import { CUSTOMER_STATUS, type CustomerStatus } from "../types/customer";

export function StatusChip({ status }: { status: CustomerStatus }) {
  const tone = CUSTOMER_STATUS[status];
  return (
    <span
      className={`inline-flex flex-none items-center gap-1 rounded-lg px-xs py-1 font-sans text-body-sm/[normal] font-medium ${tone.className}`}
    >
      {tone.label}
    </span>
  );
}
