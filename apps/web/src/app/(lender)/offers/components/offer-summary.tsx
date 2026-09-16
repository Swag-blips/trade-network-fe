import { HugeiconsIcon } from "@hugeicons/react";
import {
  InformationCircleIcon,
  Store02Icon,
  WarehouseIcon,
} from "@hugeicons/core-free-icons";
import { ButtonLink } from "@/components/button-link";
import { InitialsAvatar } from "@/components/avatars";
import type { Offer } from "../types/offer";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex w-full items-center gap-1 text-body-sm">
      <span className="min-w-0 flex-1 text-grey-600">{label}</span>
      <span className="whitespace-nowrap text-grey-900">{value}</span>
    </div>
  );
}

export function OfferSummary({ offer }: { offer: Offer }) {
  return (
    <aside className="flex w-86 flex-none flex-col rounded-lg border border-grey-100 bg-white">
      <div className="flex w-full flex-col items-center justify-center gap-md px-5 py-md">
        <InitialsAvatar initials={offer.initials} size={64} />
        <div className="flex w-full flex-col items-center justify-center gap-1">
          <p className="w-full text-center font-sans text-xl/normal font-medium text-grey-900">
            {offer.applicant}
          </p>
          <span className="flex items-center justify-center gap-1">
            <HugeiconsIcon
              icon={offer.kind === "Distributor" ? Store02Icon : WarehouseIcon}
              size={16}
              className="text-grey-600"
            />
            <span className="text-body-sm/[normal] text-grey-600">
              {offer.kind}
            </span>
          </span>
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center gap-md px-5 py-md">
        <Row label="Invoice value" value={offer.invoiceValue} />
        <Row label="Requested advance" value={offer.requestedAdvance} />
        <Row label="Tenor" value={offer.tenor} />
      </div>

      <div className="flex w-full items-center border-t border-grey-100 px-5 py-md">
        <ButtonLink
          href="/matched"
          variant="secondary"
          size="form"
          className="flex-1"
          leadingIcon={<HugeiconsIcon icon={InformationCircleIcon} />}
        >
          View opportnity details
        </ButtonLink>
      </div>
    </aside>
  );
}
