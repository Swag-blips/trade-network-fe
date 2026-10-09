import { HugeiconsIcon } from "@hugeicons/react";
import { HandshakeIcon } from "@hugeicons/core-free-icons";
import { BrandArc } from "@repo/ui/brand-mark";
import { InitialsAvatar } from "@repo/ui/avatars";

function MockRow() {
  return (
    <div className="flex items-center gap-2.5">
      <InitialsAvatar initials="HO" size={26} />
      <span className="flex flex-col gap-1">
        <span className="block h-1.25 w-26.75 rounded-full bg-grey-100" />
        <span className="block h-1.25 w-18 rounded-full bg-grey-100" />
      </span>
    </div>
  );
}

export function OffersBanner() {
  return (
    <section className="relative h-31.5 overflow-hidden rounded-lg bg-evergreen-700">
      <BrandArc
        arc="outer"
        aria-hidden
        className="absolute -top-20.75 left-[87.5%] h-67.75 w-71.5 rotate-34 text-evergreen-50 opacity-10"
      />

      <div className="absolute top-[32.5px] left-xl flex w-124.75 flex-col gap-1 text-evergreen-50">
        <h2 className="font-brand text-2xl/normal font-medium">
          Manage your offers
        </h2>
        <p className="text-body-sm opacity-80">
          Monitor negotiations, reply to counteroffers, and manage important
          offers.
        </p>
      </div>

      <div
        aria-hidden
        className="absolute top-10.25 left-186.25 hidden w-47 flex-col gap-sm rounded-xl bg-white p-2.5 shadow-small-thick lg:flex"
      >
        <p className="font-sans text-body-sm/[normal] font-medium text-grey-900">
          Offers
        </p>
        <MockRow />
        <MockRow />
      </div>

      <span
        aria-hidden
        className="absolute top-13.5 left-226.5 hidden size-10 items-center justify-center rounded-full bg-white text-evergreen-700 shadow-small-thick lg:flex"
      >
        <HugeiconsIcon icon={HandshakeIcon} size={22} />
      </span>
    </section>
  );
}
