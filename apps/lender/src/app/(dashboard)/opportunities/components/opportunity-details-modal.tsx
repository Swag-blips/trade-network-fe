"use client";

import type { ReactNode } from "react";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  Agreement03Icon,
  Alert02Icon,
  ArrowLeftRightIcon,
  ArrowRight01Icon,
  Calendar04Icon,
  CalendarClockIcon,
  Coins01Icon,
  FactoryIcon,
  File02Icon,
  InformationCircleIcon,
  ReceiptTextIcon,
  Target03Icon,
} from "@hugeicons/core-free-icons";
import { Avatar } from "@repo/ui/avatar";
import { FormDialog } from "@/components/form-dialog";
import {
  BodyPlaceholder,
  CLOSED,
  Metric,
  Notice,
  Party,
} from "./opportunity-detail";
import { useOpportunity } from "../hooks/use-opportunity";
import type { Opportunity } from "../types/opportunity";
import { shortDate } from "@/utils/date";
import { fullNaira, MATCH } from "../utils/format";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-md rounded-lg border border-grey-100 bg-white p-md">
      <h3 className="font-sans text-xl/[normal] font-medium text-grey-900">
        {title}
      </h3>
      <hr className="border-grey-100" />
      {children}
    </section>
  );
}

function Fact({
  icon,
  label,
  value,
}: {
  icon: IconSvgElement;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-xl text-body/[normal]">
      <dt className="flex w-47.5 flex-none items-center gap-xs text-grey-600">
        <HugeiconsIcon
          icon={icon}
          size={20}
          className="flex-none text-grey-800"
        />
        {label}
      </dt>
      <dd className="min-w-0 text-grey-900">{value}</dd>
    </div>
  );
}

function Details({ item }: { item: Opportunity }) {
  return (
    <div className="flex flex-col gap-xl">
      <div className="flex flex-col gap-lg">
        <div className="flex justify-center">
          <Avatar
            name={item.name}
            size={64}
            shape="square"
            className="rounded-lg border border-grey-200 bg-grey-50 text-2xl text-grey-600"
          />
        </div>
        <div className="flex flex-col gap-xs text-center">
          <h3 className="font-brand text-2xl/[normal] font-medium text-grey-900">
            {item.name}
          </h3>
          <p className="text-body/[normal] text-grey-600">
            <span className={`font-medium ${MATCH[item.match].text}`}>
              {MATCH[item.match].label}
            </span>
            {` · Expires ${shortDate(item.expiresAt)}`}
          </p>
        </div>
        <hr className="border-grey-100" />
      </div>

      {CLOSED.includes(item.status) ? (
        <Notice
          icon={InformationCircleIcon}
          text="This request is no longer available."
        />
      ) : null}

      <div className="grid grid-cols-2 gap-md">
        <Metric
          label="Trade value (Invoice)"
          value={fullNaira(item.tradeValue)}
          icon={ReceiptTextIcon}
        />
        <Metric
          label="Requested advance"
          value={fullNaira(item.advance)}
          icon={Coins01Icon}
        />
        <Metric
          label="Repayment tenure"
          value={`${item.tenorDays} days`}
          icon={CalendarClockIcon}
        />
        <Metric
          label="Needed before"
          value={shortDate(item.expiresAt)}
          icon={Calendar04Icon}
        />
      </div>

      <Section title="Trade details">
        <div className="flex flex-col gap-xl">
          <div className="flex items-center gap-xl">
            <Party
              role={item.kind === "Distributor" ? "Distributor" : "Seller"}
              name={item.name}
            />
            <HugeiconsIcon
              icon={ArrowLeftRightIcon}
              size={20}
              className="flex-none text-grey-800"
            />
            <Party role="Buyer" name={item.buyer} />
          </div>
          <dl className="flex flex-col gap-md">
            <Fact icon={FactoryIcon} label="Industry" value={item.industry} />
            <Fact
              icon={Target03Icon}
              label="Financing purpose"
              value={item.purpose}
            />
            <Fact
              icon={Agreement03Icon}
              label="Trade credit terms"
              value={`Pay in ${item.creditTermDays} days`}
            />
          </dl>
        </div>
      </Section>

      {item.documents.length > 0 ? (
        <Section title="Trade evidence">
          <ul className="flex flex-col gap-md">
            {item.documents.map((document) => (
              <li
                key={document.file}
                className="flex w-122 max-w-full items-center gap-md rounded-lg bg-white p-xs"
              >
                <HugeiconsIcon
                  icon={File02Icon}
                  className="flex-none text-grey-800"
                />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <p className="text-body/[normal] font-medium text-evergreen-600">
                    {document.label}
                  </p>
                  <p className="truncate text-body-sm/[normal] text-grey-600">
                    {document.file}
                  </p>
                </div>
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  className="flex-none text-grey-800"
                />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
    </div>
  );
}

export function OpportunityDetailsModal({
  id,
  onClose,
}: {
  id: string;
  onClose: () => void;
}) {
  const { data: item, isPending } = useOpportunity(id);

  return (
    <FormDialog
      title="Opportunity details"
      className="max-h-186.5 w-209"
      onClose={onClose}
    >
      <div className="py-xs">
        {isPending ? (
          <BodyPlaceholder />
        ) : item ? (
          <Details item={item} />
        ) : (
          <Notice
            icon={Alert02Icon}
            text="We couldn't load this request. Please try again."
          />
        )}
      </div>
    </FormDialog>
  );
}
