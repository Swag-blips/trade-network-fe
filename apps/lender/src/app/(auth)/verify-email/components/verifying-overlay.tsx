import { BrandArc } from "@repo/ui/brand-mark";

const ARC = "absolute w-[72.4%] text-white motion-safe:animate-brand-spin";

export function VerifyingOverlay() {
  return (
    <div
      role="status"
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/80"
    >
      <div className="flex flex-col items-center gap-xl">
        <div className="relative h-16 w-[84.291px]">
          <BrandArc
            arc="outer"
            className={`${ARC} top-0 left-[27.6%] h-[91.86%]`}
          />
          <BrandArc
            arc="inner"
            className={`${ARC} top-[9.47%] left-0 h-[90.53%]`}
          />
        </div>

        <p className="text-xl/normal whitespace-nowrap text-white">
          Loading...please wait
        </p>
      </div>
    </div>
  );
}
