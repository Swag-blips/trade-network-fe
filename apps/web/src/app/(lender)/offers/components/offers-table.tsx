"use client";

import { useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { FilterMailCircleIcon } from "@hugeicons/core-free-icons";
import { Select } from "@repo/ui/select";
import { InitialsAvatar } from "@/components/avatars";
import { StatusBadge } from "./status-badge";
import { OFFER_STATUS, type Offer } from "../types/offer";

const FILTERS = [
  "Any status",
  ...Object.values(OFFER_STATUS).map((status) => status.label),
];

export function OffersTable({ offers }: { offers: Offer[] }) {
  const [filter, setFilter] = useState(FILTERS[0]);

  const visible = offers.filter(
    (offer) =>
      filter === "Any status" || OFFER_STATUS[offer.status].label === filter,
  );

  return (
    <>
      <div className="flex items-center gap-md">
        <h2 className="min-w-0 flex-1 font-sans text-[1.25rem]/[1.5] font-medium text-grey-900">
          My offers
        </h2>
        <span className="flex flex-none items-center gap-sm">
          <HugeiconsIcon
            icon={FilterMailCircleIcon}
            size={20}
            className="text-grey-800"
          />
          <span className="text-body-sm/[normal] whitespace-nowrap text-grey-800">
            Filter by:
          </span>
          <Select
            aria-label="Filter offers"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            variant="chip"
          >
            {FILTERS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </Select>
        </span>
      </div>

      <div className="mt-md flex flex-col gap-xs">
        <div className="type-overline flex h-[35px] items-center gap-[52px] bg-grey-50 px-sm tracking-[0.24px] text-grey-500">
          <span className="min-w-0 flex-1">Applicant</span>
          <span className="w-[140px] flex-none">Sent on</span>
          <span className="w-[140px] flex-none">Expiry date</span>
          <span className="w-[160px] flex-none">Status</span>
        </div>

        {visible.length === 0 ? (
          <p className="px-sm py-md text-body-sm text-grey-500">
            No offers match this filter.
          </p>
        ) : (
          visible.map((offer) => (
            <Link
              key={offer.id}
              href={`/offers/${offer.id}`}
              className="relative flex items-center gap-[52px] rounded-md px-sm py-2.5 hover:bg-grey-50"
            >
              {offer.unread ? (
                <span
                  aria-label="Unread"
                  className="absolute top-px left-[7px] size-3 rounded-full bg-evergreen-900"
                />
              ) : null}
              <span className="flex min-w-0 flex-1 items-center gap-xs">
                <InitialsAvatar initials={offer.initials} size={40} />
                <span className="flex min-w-0 flex-1 flex-col justify-center gap-1">
                  <span className="font-sans text-body-sm/[normal] font-medium text-eucalyptus-900">
                    {offer.applicant}
                  </span>
                  <span className="text-caption/[normal] text-grey-800">
                    {offer.kind}
                  </span>
                </span>
              </span>
              <span className="w-[140px] flex-none text-body-sm/[normal] text-grey-800">
                {offer.sentOn}
              </span>
              <span className="w-[140px] flex-none text-body-sm/[normal] text-grey-800">
                {offer.expires}
              </span>
              <span className="flex w-[160px] flex-none items-center">
                <StatusBadge status={offer.status} />
              </span>
            </Link>
          ))
        )}
      </div>
    </>
  );
}
