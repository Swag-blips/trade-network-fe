import { HugeiconsIcon } from "@hugeicons/react";
import { HandshakeIcon } from "@hugeicons/core-free-icons";
import { BrandArc } from "@/components/brand-mark";
import { InitialsAvatar } from "@/components/avatars";

function MockRow() {
  return (
    <div className="flex items-center gap-2.5">
      <InitialsAvatar initials="HO" size={26} />
      <span className="flex flex-col gap-1">
        <span className="block h-[5px] w-[107px] rounded-full bg-grey-100" />
        <span className="block h-[5px] w-[72px] rounded-full bg-grey-100" />
      </span>
    </div>
  );
}

export function OffersBanner() {
  return (
    <section className="relative h-[126px] overflow-hidden rounded-lg bg-evergreen-700">
      <BrandArc
        arc="outer"
        aria-hidden
        className="absolute -top-[83px] left-[87.5%] h-[271px] w-[286px] rotate-[34deg] text-evergreen-50 opacity-10"
      />

      <div className="absolute top-[32.5px] left-xl flex w-[499px] flex-col gap-1 text-evergreen-50">
        <h2 className="font-brand text-[1.5rem]/[1.5] font-medium">
          Manage your offers
        </h2>
        <p className="text-body-sm opacity-80">
          Monitor negotiations, reply to counteroffers, and manage important
          offers.
        </p>
      </div>

      <div
        aria-hidden
        className="absolute top-[41px] left-[745px] hidden w-[188px] flex-col gap-sm rounded-xl bg-white p-2.5 shadow-small-thick lg:flex"
      >
        <p className="font-sans text-body-sm/[normal] font-medium text-grey-900">
          Offers
        </p>
        <MockRow />
        <MockRow />
      </div>

      <span
        aria-hidden
        className="absolute top-[54px] left-[906px] hidden size-10 items-center justify-center rounded-full bg-white text-evergreen-700 shadow-small-thick lg:flex"
      >
        <HugeiconsIcon icon={HandshakeIcon} size={22} />
      </span>
    </section>
  );
}
