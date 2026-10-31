"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, Coins01Icon } from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { useNewForYou } from "../../hooks/use-new-for-you";

interface UpdateItem {
  id: string;
  label: string;
  href: string;
  /** No badge while loading or at zero; the row itself always shows. */
  count?: number;
  icon: IconSvgElement;
}

function UpdateRow({ item }: { item: UpdateItem }) {
  return (
    <Link
      href={item.href}
      className="flex w-full items-center gap-md rounded-lg bg-white p-xs transition-colors hover:bg-grey-50"
    >
      <span className="relative flex size-10 flex-none items-center justify-center rounded-[20px] bg-[#e0f2fe]">
        <HugeiconsIcon icon={item.icon} size={20} className="text-ocean-700" />
        {item.count ? (
          <span className="absolute -top-0.5 left-6.75 flex min-w-4 items-center justify-center rounded-full border-2 border-white bg-evergreen-500 px-1 py-0.5 text-[10px]/none text-white">
            {item.count}
          </span>
        ) : null}
      </span>
      <span className="min-w-0 flex-1 text-body-sm font-medium text-grey-900">
        {item.label}
      </span>
      <HugeiconsIcon
        icon={ArrowRight01Icon}
        size={16}
        className="flex-none text-grey-900"
      />
    </Link>
  );
}

export function NewForYouCard() {
  const { data } = useNewForYou();

  const items: UpdateItem[] = [
    {
      id: "funding-opportunity",
      label: "Funding opportunity",
      href: "/matched",
      count: data?.fundingOpportunities,
      icon: Coins01Icon,
    },
  ];

  return (
    <section
      id="new-for-you"
      className="flex flex-col items-start overflow-hidden rounded-lg border border-grey-200 bg-white"
    >
      <div className="flex w-full flex-col justify-center gap-1 border-b border-grey-200 px-md py-sm">
        <h3 className="font-sans text-body font-medium text-grey-900">
          New for you
        </h3>
        <p className="text-caption text-grey-600">
          Updates that require your attention.
        </p>
      </div>
      <div className="flex w-full flex-col py-sm pr-1 pl-xs">
        {items.map((item) => (
          <UpdateRow key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
