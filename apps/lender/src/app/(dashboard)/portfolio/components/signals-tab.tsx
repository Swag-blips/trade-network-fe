import { EmptyState } from "./empty-state";

export function SignalsTab() {
  return (
    <section className="flex flex-col gap-lg px-20">
      <div className="flex flex-col gap-1 border-b border-grey-100 pb-lg">
        <h2 className="font-sans text-xl/[1.24] font-medium text-grey-900">
          Trade signals
        </h2>
        <p className="text-body/[normal] text-grey-600">
          Stay informed about important changes in this business.
        </p>
      </div>
      <EmptyState
        title="No trade signals yet"
        bodyWidth="w-120.5"
        className="py-xl"
      >
        There are no significant changes in this business&apos;s trading
        activity to report. New signals will appear here as they&apos;re
        detected.
      </EmptyState>
    </section>
  );
}
