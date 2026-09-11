import { notFound } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  InformationCircleIcon,
  MoneyReceive01Icon,
  Store02Icon,
  WarehouseIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@repo/ui/button";
import { DetailHeader } from "@/components/detail-header";
import { StatusChip } from "../components/status-chip";
import { CustomerTabs } from "../components/customer-tabs";
import { InitialsAvatar } from "@/components/avatars";
import { CUSTOMERS } from "../data";

export function generateStaticParams() {
  return CUSTOMERS.map((customer) => ({ id: customer.id }));
}

export default async function CustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const index = CUSTOMERS.findIndex((customer) => customer.id === id);
  const customer = CUSTOMERS[index];

  if (!customer) {
    notFound();
  }

  return (
    <>
      <DetailHeader
        backLabel="portfolio"
        itemLabel="customer"
        initials={customer.initials}
        name={customer.name}
        badge={<StatusChip status={customer.status} />}
        prevHref={
          CUSTOMERS[index - 1]
            ? `/portfolio/${CUSTOMERS[index - 1]!.id}`
            : undefined
        }
        nextHref={
          CUSTOMERS[index + 1]
            ? `/portfolio/${CUSTOMERS[index + 1]!.id}`
            : undefined
        }
      />

      <div className="flex min-h-px flex-1 flex-col overflow-y-auto pt-xs pb-lg">
        <div className="flex items-center px-lg">
          <div className="flex min-w-0 flex-1 items-center gap-md py-2.5">
            <InitialsAvatar initials={customer.initials} size={64} />
            <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
              <p className="font-sans text-[1.25rem]/[normal] font-medium text-black">
                {customer.name}
              </p>
              <span className="flex items-center gap-1">
                <HugeiconsIcon
                  icon={
                    customer.kind === "Distributor"
                      ? Store02Icon
                      : WarehouseIcon
                  }
                  size={16}
                  className="text-grey-800"
                />
                <span className="text-body-sm/[normal] text-grey-800">
                  {customer.kind}
                </span>
              </span>
            </div>
            <div className="flex flex-none items-center gap-md">
              <Button
                variant="secondary"
                size="form"
                leadingIcon={<HugeiconsIcon icon={InformationCircleIcon} />}
              >
                About
              </Button>
              <Button
                size="form"
                leadingIcon={<HugeiconsIcon icon={MoneyReceive01Icon} />}
              >
                Record repayment
              </Button>
            </div>
          </div>
        </div>

        <CustomerTabs customer={customer} />
      </div>
    </>
  );
}
