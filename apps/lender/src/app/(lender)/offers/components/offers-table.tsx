"use client";

import { useState } from "react";
import { Select } from "@repo/ui/select";
import { DataTable } from "@repo/ui/data-table";
import { FilterBar } from "@repo/ui/filter-bar";
import { InitialsAvatar } from "@repo/ui/avatars";
import { StatusBadge } from "./status-badge";
import { OFFER_STATUS, type Offer } from "../types/offer";

const FILTERS = [
  "Any status",
  ...Object.values(OFFER_STATUS).map((status) => status.label),
];

export function OffersTable({ offers }: { offers: Offer[] }) {
  const [filter, setFilter] = useState(FILTERS[0]!);

  const visible = offers.filter(
    (offer) =>
      filter === "Any status" || OFFER_STATUS[offer.status].label === filter,
  );

  return (
    <>
      <div className="flex items-center gap-md">
        <h2 className="min-w-0 flex-1 font-sans text-xl/normal font-medium text-grey-900">
          My offers
        </h2>
        <FilterBar>
          <Select
            aria-label="Filter offers"
            value={filter}
            onValueChange={setFilter}
            options={FILTERS}
            variant="chip"
          />
        </FilterBar>
      </div>

      <div className="mt-md">
        <DataTable
          rows={visible}
          gap={52}
          rowKey={(offer) => offer.id}
          rowHref={(offer) => `/offers/${offer.id}`}
          unread={(offer) => Boolean(offer.unread)}
          empty="No offers match this filter."
          columns={[
            {
              header: "Applicant",
              cell: (offer) => (
                <>
                  <InitialsAvatar initials={offer.initials} size={40} />
                  <span className="ml-xs flex min-w-0 flex-1 flex-col justify-center gap-1">
                    <span className="font-sans text-body-sm/[normal] font-medium text-eucalyptus-900">
                      {offer.applicant}
                    </span>
                    <span className="text-caption/[normal] text-grey-800">
                      {offer.kind}
                    </span>
                  </span>
                </>
              ),
            },
            { header: "Sent on", width: 140, cell: (offer) => offer.sentOn },
            {
              header: "Expiry date",
              width: 140,
              cell: (offer) => offer.expires,
            },
            {
              header: "Status",
              width: 160,
              cell: (offer) => <StatusBadge status={offer.status} />,
            },
          ]}
        />
      </div>
    </>
  );
}
