import type { ReactNode } from "react";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  AtIcon,
  Building05Icon,
  Call02Icon,
  Coins01Icon,
  CoinsSwapIcon,
  User03Icon,
} from "@hugeicons/core-free-icons";
import { Avatar } from "@repo/ui/avatar";
import { compactAmount } from "@/utils/naira";
import { EmptyState } from "./empty-state";
import { useFundings } from "../hooks/use-fundings";
import type { Borrower } from "../types/portfolio";

const FUNDED = new Set(["outstanding", "overdue", "repaid"]);

function InfoCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex w-full flex-col gap-md rounded-xl border border-grey-100 bg-white p-lg shadow-card">
      <h2 className="border-b border-grey-100 pb-md font-sans text-xl/[normal] font-medium text-grey-900">
        {title}
      </h2>
      {children}
    </section>
  );
}

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: IconSvgElement;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-lg text-body/[normal]">
      <span className="flex w-52 flex-none items-center gap-xs text-grey-600">
        <HugeiconsIcon icon={icon} size={20} className="text-grey-500" />
        {label}
      </span>
      <span className="min-w-0 truncate text-grey-900">{children}</span>
    </div>
  );
}

export function AboutTab({ borrower }: { borrower: Borrower }) {
  const { contact, counterparties } = borrower;
  const { data: fundings } = useFundings(borrower.id);
  const tradesFinanced = fundings?.filter((funding) =>
    FUNDED.has(funding.status),
  ).length;

  return (
    <div className="flex items-start gap-md">
      <div className="flex min-w-0 flex-1 flex-col gap-lg">
        <InfoCard title="About company">
          <p
            className={`text-body/[1.5] ${borrower.description ? "text-grey-800" : "text-grey-500"}`}
          >
            {borrower.description ?? "No description yet."}
          </p>
          <div className="flex flex-col gap-xl pt-xs">
            <InfoRow icon={Building05Icon} label="Industry">
              {borrower.industry}
            </InfoRow>
            <InfoRow icon={Coins01Icon} label="Total amount financed">
              <span className="font-medium">
                ₦{compactAmount(borrower.financed)}
              </span>
            </InfoRow>
            <InfoRow icon={CoinsSwapIcon} label="Total trades financed">
              <span className="font-medium">{tradesFinanced ?? "—"}</span>
            </InfoRow>
          </div>
        </InfoCard>

        <InfoCard title={`Trading counterparties (${counterparties.length})`}>
          <p className="text-body/[normal] text-grey-600">
            {counterparties.length > 0
              ? `Businesses ${borrower.name.replace(/\.$/, "")} has traded with.`
              : "No trading counterparties yet."}
          </p>
          <ul className="flex flex-col gap-md">
            {counterparties.map((counterparty) => (
              <li key={counterparty.name} className="flex items-center gap-sm">
                <Avatar
                  name={counterparty.name}
                  size={40}
                  shape="square"
                  className="border border-grey-200 bg-grey-50 text-grey-600"
                />
                <div className="flex min-w-0 flex-col gap-1">
                  <p className="truncate text-body/[1.24] font-medium text-grey-900">
                    {counterparty.name}
                  </p>
                  <p className="text-body-sm/[normal] text-grey-600">
                    {counterparty.trades}{" "}
                    {counterparty.trades === 1 ? "trade" : "trades"}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </InfoCard>
      </div>

      <div className="w-156 flex-none">
        <InfoCard title="Contact person">
          {contact ? (
            <div className="flex flex-col gap-xl pt-xs">
              <InfoRow icon={User03Icon} label="Primary contact">
                {contact.name}
              </InfoRow>
              <InfoRow icon={AtIcon} label="Email address">
                {contact.email}
              </InfoRow>
              <InfoRow icon={Call02Icon} label="Phone number">
                {contact.phone}
              </InfoRow>
            </div>
          ) : (
            <EmptyState
              title="No contact person yet"
              bodyWidth="w-91.75"
              className="py-lg"
            >
              The enterprise hasn&apos;t named a contact person for this
              account.
            </EmptyState>
          )}
        </InfoCard>
      </div>
    </div>
  );
}
