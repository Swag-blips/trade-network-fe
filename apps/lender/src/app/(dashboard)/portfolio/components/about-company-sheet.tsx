"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  BankIcon,
  Building05Icon,
  Copy01Icon,
  SentIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@repo/ui/button";
import { IconButton } from "@repo/ui/icon-button";
import { useToast } from "@repo/ui/toast";
import { InitialsAvatar, OrgAvatar } from "@repo/ui/avatars";
import { DetailRow } from "@repo/ui/detail-row";
import { Panel } from "@repo/ui/panel";
import { Sheet } from "@repo/ui/sheet";
import { Tabs } from "@repo/ui/tabs";
import type { Customer, Relationship } from "../types/customer";

const TABS = ["Details", "Relationships"] as const;

function CompanyType({ kind }: { kind: Relationship["kind"] }) {
  return (
    <span className="flex items-center gap-1 text-body-sm text-grey-600">
      <HugeiconsIcon
        icon={kind === "capital-provider" ? BankIcon : Building05Icon}
        size={16}
      />
      {kind === "capital-provider" ? "Capital provider" : "Business"}
    </span>
  );
}

export function AboutCompanySheet({
  customer,
  onClose,
}: {
  customer: Customer;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Details");
  const { toast } = useToast();
  const { about } = customer;

  function copy(value: string, what: string) {
    navigator.clipboard.writeText(value);
    toast({ message: `${what} copied` });
  }

  return (
    <Sheet title="About company" onClose={onClose}>
      <div className="flex w-full flex-col gap-md px-md py-2.5">
        <div className="flex w-full flex-col items-center justify-center gap-lg px-5 py-md">
          <div className="flex w-full flex-col items-center gap-md">
            <span className="flex size-20 items-center justify-center rounded-full border border-linen-200 bg-linen-100 text-linen-600">
              <HugeiconsIcon icon={Building05Icon} size={32} />
            </span>
            <div className="flex w-full flex-col items-center gap-1">
              <p className="w-full text-center font-sans text-xl/normal font-medium text-grey-900">
                {customer.name}
              </p>
              <CompanyType kind="business" />
            </div>
          </div>
          <Button
            variant="secondary"
            size="form"
            leadingIcon={<HugeiconsIcon icon={SentIcon} />}
          >
            Send a message
          </Button>
        </div>

        <Tabs
          label="Company sections"
          tabs={TABS}
          value={tab}
          onChange={setTab}
          className="w-full pt-xs"
        />

        {tab === "Details" ? (
          <Panel title="Company details" divided>
            <DetailRow label="Business number">
              {about.businessNumber}
            </DetailRow>
            <DetailRow label="Address">
              <span className="w-44.25 text-grey-800 whitespace-normal">
                {about.address}
              </span>
            </DetailRow>
            <DetailRow label="Industry">{about.industry}</DetailRow>
            <DetailRow label="Email address">
              {about.email}
              <IconButton
                label="Copy email address"
                size="xs"
                className="text-evergreen-600"
                onClick={() => copy(about.email, "Email address")}
              >
                <HugeiconsIcon icon={Copy01Icon} />
              </IconButton>
            </DetailRow>
            <DetailRow label="Phone number">
              {about.phone}
              <IconButton
                label="Copy phone number"
                size="xs"
                className="text-evergreen-600"
                onClick={() => copy(about.phone, "Phone number")}
              >
                <HugeiconsIcon icon={Copy01Icon} />
              </IconButton>
            </DetailRow>
          </Panel>
        ) : (
          <Panel title="Trade relationships" divided>
            <ul className="flex w-full flex-col gap-md">
              {about.relationships.map((party) => (
                <li key={party.name} className="flex items-center gap-sm py-xs">
                  {party.kind === "capital-provider" ? (
                    <OrgAvatar name={party.name} size={40} />
                  ) : (
                    <InitialsAvatar
                      initials={party.initials}
                      size={40}
                      className="border-grey-200 bg-grey-100 text-grey-600"
                    />
                  )}
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="font-sans text-body text-grey-900">
                      {party.name}
                    </span>
                    <CompanyType kind={party.kind} />
                  </span>
                </li>
              ))}
            </ul>
          </Panel>
        )}
      </div>
    </Sheet>
  );
}
