"use client";

/** Owns the tablist only — panels stay at the call site. */
export function Tabs<Tab extends string>({
  label,
  tabs,
  value,
  onChange,
  className = "",
}: {
  label: string;
  tabs: readonly Tab[];
  value: Tab;
  onChange: (tab: Tab) => void;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className={`flex items-center gap-md border-b border-grey-100 ${className}`}
    >
      {tabs.map((tab) => {
        const active = tab === value;
        return (
          <button
            key={tab}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab)}
            className={`-mb-px cursor-pointer border-b-2 px-2.5 py-xs font-sans text-body/[normal] font-medium whitespace-nowrap transition-colors motion-reduce:transition-none ${
              active
                ? "border-evergreen-600 text-grey-900"
                : "border-transparent text-grey-500 hover:text-grey-900"
            }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
