import type { ScheduleRow } from "@/components/schedule-table";

const ORDINALS = [
  "First",
  "Second",
  "Third",
  "Fourth",
  "Fifth",
  "Sixth",
  "Seventh",
  "Eighth",
  "Ninth",
  "Tenth",
  "Eleventh",
];

const DAY = 86_400_000;

/** The API's rule: one equal installment every 30 days, the last at maturity taking the rounding. */
export function repaymentSchedule(
  total: number,
  tenorDays: number,
  start: Date,
): ScheduleRow[] {
  const count = Math.max(1, Math.ceil(tenorDays / 30));
  const totalKobo = Math.round(total * 100);
  const eachKobo = Math.floor(totalKobo / count);

  return Array.from({ length: count }, (_, index) => {
    const last = index === count - 1;
    const due = new Date(
      start.getTime() + (last ? tenorDays : 30 * (index + 1)) * DAY,
    );
    return {
      label: last
        ? "Final repayment"
        : ORDINALS[index]
          ? `${ORDINALS[index]} installment`
          : `Installment ${index + 1}`,
      dueDate: due.toISOString(),
      amount: (last ? totalKobo - eachKobo * (count - 1) : eachKobo) / 100,
    };
  });
}
