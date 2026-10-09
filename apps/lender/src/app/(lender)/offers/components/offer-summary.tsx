import { HugeiconsIcon } from "@hugeicons/react";
import {
  InformationCircleIcon,
  Store02Icon,
  WarehouseIcon,
} from "@hugeicons/core-free-icons";
import { ButtonLink } from "@repo/ui/button-link";
import { DetailRow } from "@repo/ui/detail-row";
import { InitialsAvatar } from "@repo/ui/avatars";
import type { Offer } from "../types/offer";

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
        <DetailRow label="Invoice value" size="sm">
          {offer.invoiceValue}
        </DetailRow>
        <DetailRow label="Requested advance" size="sm">
          {offer.requestedAdvance}
        </DetailRow>
        <DetailRow label="Tenor" size="sm">
          {offer.tenor}
        </DetailRow>
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
