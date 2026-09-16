import { HugeiconsIcon } from "@hugeicons/react";
import {
  Activity03Icon,
  Alert02Icon,
  Coins01Icon,
  DashboardSpeed01Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { TaiAgent } from "@/components/tai-agent";
import { HealthGauge } from "./health-gauge";
import type { Customer } from "../types/customer";

function Metric({
  icon,
  label,
  value,
}: {
  icon: IconSvgElement;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-51.25 flex-1 items-center overflow-hidden rounded-lg border border-grey-100 bg-white px-md py-2.5">
      <div className="flex min-w-0 flex-1 flex-col gap-md">
        <span className="flex size-8 items-center justify-center rounded-xl bg-evergreen-100">
          <HugeiconsIcon icon={icon} size={20} className="text-evergreen-700" />
        </span>
        <span className="flex flex-col gap-1">
          <span className="text-body-sm text-grey-800">{label}</span>
          <span className="font-brand text-[1.25rem]/[1.3] font-medium tracking-[0.16px] text-grey-900">
            {value}
          </span>
        </span>
      </div>
    </div>
  );
}

export function OverviewTab({ customer }: { customer: Customer }) {
  return (
    <div className="flex w-full flex-col gap-lg">
      <h2 className="w-full font-sans text-xl/normal font-medium text-grey-900">
        Overview
      </h2>

      <div className="flex w-full flex-col gap-md">
        <div className="flex w-full flex-wrap items-stretch gap-md">
          <Metric
            icon={Alert02Icon}
            label="Outstanding"
            value={customer.outstanding}
          />
          <Metric
            icon={Coins01Icon}
            label="Total amount funded"
            value={customer.totalFunded}
          />
          <Metric
            icon={DashboardSpeed01Icon}
            label="Obligor limit left"
            value={customer.obligorLimitLeft}
          />
          <Metric
            icon={Activity03Icon}
            label="Active funded trades"
            value={String(customer.activeTrades)}
          />
        </div>

        <div className="flex w-full flex-wrap items-stretch gap-md overflow-hidden">
          <section className="flex min-w-80 flex-1 flex-col gap-md self-stretch overflow-hidden rounded-lg border border-[#92bbfd] bg-white p-sm">
            <div className="flex w-full items-center">
              <span className="flex min-w-0 flex-1 items-center gap-xs">
                <TaiAgent size="xs" />
                <span className="font-sans text-caption/[normal] font-medium text-grey-800 uppercase">
                  AI Summary
                </span>
              </span>
            </div>
            <hr className="w-full border-grey-100" />
            <div className="flex w-full flex-col gap-xs">
              <p className="font-sans text-body font-medium text-grey-900">
                Portfolio summary
              </p>
              <p className="text-body text-grey-800">{customer.summary}</p>
            </div>
          </section>

          <section className="flex w-78.25 flex-none flex-col justify-center gap-lg rounded-xl border border-grey-100 bg-white pt-xs pb-lg">
            <h3 className="w-full text-center font-sans text-body font-medium text-grey-800">
              Portfolio health
            </h3>
            <HealthGauge level={customer.health} />
          </section>
        </div>
      </div>
    </div>
  );
}
