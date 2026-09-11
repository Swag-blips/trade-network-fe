import { HugeiconsIcon } from "@hugeicons/react";
import {
  Alert02Icon,
  MoneySafeIcon,
  Store02Icon,
  WarehouseIcon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";

export interface PortfolioStat {
  label: string;
  value: string;
  caption: string;
  icon: IconSvgElement;
  tone?: "default" | "danger";
}

export const PORTFOLIO_ICONS = {
  capital: MoneySafeIcon,
  outstanding: Alert02Icon,
  suppliers: WarehouseIcon,
  distributors: Store02Icon,
};

function StatCard({ label, value, caption, icon, tone }: PortfolioStat) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-xs overflow-hidden rounded-lg border border-white/8 bg-white px-md py-2.5 shadow-[0_4px_4px_0_rgb(0_0_0/0.04)]">
      <div className="flex w-full items-center justify-center gap-xs">
        <p className="min-w-0 flex-1 font-sans text-body-sm font-medium text-grey-800">
          {label}
        </p>
        <span className="flex size-6 flex-none items-center justify-center rounded-full bg-evergreen-100">
          <HugeiconsIcon icon={icon} size={16} className="text-evergreen-700" />
        </span>
      </div>
      <div className="flex w-full flex-col gap-1">
        <p
          className={`font-brand text-[1.25rem]/[1.3] font-medium tracking-[0.16px] ${tone === "danger" ? "text-red-error-500" : "text-grey-900"}`}
        >
          {value}
        </p>
        <p className="text-caption/[normal] text-grey-600">{caption}</p>
      </div>
    </div>
  );
}

export function PortfolioBanner({ stats }: { stats: PortfolioStat[] }) {
  return (
    <section className="relative flex w-full items-center gap-md overflow-hidden rounded-b-[20px] bg-[linear-gradient(175.65deg,#2a8178_14.1%,#065653_67.4%)] px-5 pt-lg pb-md">
      <span
        aria-hidden
        className="absolute top-[-137px] left-[808px] hidden h-[310px] w-[338px] bg-evergreen-400 opacity-80 [mask-image:url(/portfolio-banner-dots.png)] [mask-position:44px_13px] [mask-repeat:no-repeat] [mask-size:286px_289px] lg:block"
      />
      <span
        aria-hidden
        className="absolute top-[-46px] left-[608px] hidden h-px w-[232px] -rotate-45 bg-linear-to-r from-transparent via-white/20 to-transparent lg:block"
      />
      <span
        aria-hidden
        className="absolute top-[44px] left-[628px] hidden h-px w-[232px] -rotate-45 bg-linear-to-r from-transparent via-white/20 to-transparent lg:block"
      />

      <div className="relative flex min-w-0 flex-1 flex-col items-center justify-center gap-xl">
        <div className="flex w-full flex-col gap-1">
          <h2 className="font-brand text-[1.5rem]/[1.24] font-medium text-evergreen-50">
            Manage portfolio
          </h2>
          <p className="text-body text-white opacity-80">
            Monitor your active investments and track repayment progress
          </p>
        </div>
        <div className="flex w-full flex-wrap items-stretch gap-xs">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
