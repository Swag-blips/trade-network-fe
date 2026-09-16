import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkBadge02Icon } from "@hugeicons/core-free-icons";
import { BrandArc } from "@/components/brand-mark";
import { InitialsAvatar } from "@/components/avatars";

function VerifiedPill({ scale }: { scale: number }) {
  return (
    <span
      style={{
        fontSize: 8 * scale,
        gap: 4 * scale,
        padding: `${2 * scale}px ${4 * scale}px`,
      }}
      className="inline-flex items-center rounded-full bg-green-500 font-sans font-medium text-white"
    >
      <HugeiconsIcon icon={CheckmarkBadge02Icon} size={12 * scale} />
      Verified
    </span>
  );
}

function MockCard({
  scale,
  width,
  className,
  initials,
}: {
  scale: number;
  width: number;
  className: string;
  initials?: string;
}) {
  return (
    <div
      style={{ width, height: 68 * scale, borderRadius: 16 * scale }}
      className={`absolute overflow-hidden bg-white shadow-small-thick ${className}`}
    >
      <div style={{ left: 8 * scale, top: 6 * scale }} className="absolute">
        <InitialsAvatar initials={initials ?? "HO"} size={32 * scale} />
      </div>
      <div
        style={{
          left: 48 * scale,
          top: 15 * scale,
          width: 82 * scale,
          height: 6 * scale,
        }}
        className="absolute rounded-full bg-grey-100"
      />
      <div
        style={{
          left: 48 * scale,
          top: 27 * scale,
          width: 55 * scale,
          height: 6 * scale,
        }}
        className="absolute rounded-full bg-grey-100"
      />
      <div style={{ left: 165 * scale, top: 6 * scale }} className="absolute">
        <VerifiedPill scale={scale} />
      </div>
    </div>
  );
}

export function OpportunityBanner() {
  return (
    <section className="relative h-31.5 overflow-hidden rounded-lg bg-evergreen-700">
      <BrandArc
        arc="outer"
        aria-hidden
        className="absolute -top-20.75 left-[77.5%] h-67.75 w-71.5 rotate-34 text-evergreen-50 opacity-10"
      />

      <div className="absolute top-[28.5px] left-xl flex w-117.75 flex-col gap-1 text-evergreen-50">
        <h2 className="font-brand text-2xl/normal font-medium">
          Discover funding opportunities
        </h2>
        <p className="text-body-sm/[normal] opacity-80">
          Explore verified trade opportunities that match your funding mandate.
        </p>
      </div>

      <div
        aria-hidden
        className="absolute top-6 left-177.25 hidden h-20 w-56.75 lg:block"
      >
        <MockCard scale={0.793} width={180} className="top-6.5 right-5.75" />
        <MockCard scale={0.863} width={196} className="top-4 right-3.75" />
        <MockCard scale={1} width={227} className="top-0 right-0" />
      </div>
    </section>
  );
}
