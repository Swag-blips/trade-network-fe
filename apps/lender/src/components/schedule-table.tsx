import type { ReactNode } from "react";
import { naira } from "@/utils/naira";
import { shortDate } from "@/utils/date";

export interface ScheduleRow {
  label: string;
  dueDate: string;
  amount: number;
  status?: { label: string; className: string };
  overdue?: boolean;
  action?: ReactNode;
}

export function ScheduleTable({
  rows,
  total,
}: {
  rows: ScheduleRow[];
  total?: number;
}) {
  const withStatus = rows.some((row) => row.status);
  const withAction = rows.some((row) => row.action);
  const amountWidth = withAction ? "w-32" : "w-39";
  const statusWidth = withAction ? "w-24" : "w-35";

  return (
    <div className="overflow-hidden rounded-lg border border-grey-100">
      <div className="flex items-center gap-sm border-b border-grey-100 bg-grey-50 px-md py-2.5 text-caption font-medium text-grey-500 uppercase">
        <p className="min-w-0 flex-1">Due date</p>
        <p className={`${amountWidth} flex-none`}>
          {withStatus ? "Amount due" : "Amount"}
        </p>
        {withStatus ? (
          <p className={`${statusWidth} flex-none`}>Status</p>
        ) : null}
        {withAction ? <span className="w-28 flex-none" /> : null}
      </div>
      <div className="flex flex-col gap-xs p-md">
        <ul className="flex flex-col gap-xs">
          {rows.map((row) => (
            <li
              key={row.label}
              className="flex items-start gap-sm text-body/[1.4]"
            >
              <div className="flex min-w-0 flex-1 gap-2.5 pb-md">
                <span className="mt-1 size-2 flex-none rounded-full bg-grey-200" />
                <div className="flex min-w-0 flex-col gap-0.5">
                  <p className="text-grey-900">{row.label}</p>
                  <p className="text-body-sm/[1.4] text-grey-600">
                    {shortDate(row.dueDate)}
                  </p>
                </div>
              </div>
              <p
                className={`${amountWidth} flex-none font-medium ${row.overdue ? "text-red-error-500" : "text-grey-900"}`}
              >
                {naira(row.amount)}
              </p>
              {withStatus ? (
                <p
                  className={`${statusWidth} flex-none ${row.status?.className ?? ""}`}
                >
                  {row.status?.label}
                </p>
              ) : null}
              {withAction ? (
                <div className="flex w-28 flex-none justify-end">
                  {row.action}
                </div>
              ) : null}
            </li>
          ))}
        </ul>
        {total !== undefined ? (
          <div className="flex items-start gap-sm border-t border-grey-100 py-xs text-body/[1.4] font-medium text-grey-900">
            <p className="min-w-0 flex-1">Total repayment</p>
            <p className={`${amountWidth} flex-none`}>{naira(total)}</p>
            {withStatus ? <span className={`${statusWidth} flex-none`} /> : null}
            {withAction ? <span className="w-28 flex-none" /> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
