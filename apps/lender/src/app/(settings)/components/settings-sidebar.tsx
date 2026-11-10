"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  CorporateIcon,
  Logout01Icon,
  UserCircleIcon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { OrgAvatar } from "@repo/ui/avatars";
import { useLogout } from "@/hooks/use-logout";
import { useMe } from "@/hooks/use-me";
import { useOrganization } from "@/hooks/use-organization";

interface SettingsItem {
  label: string;
  /** Left off for a page that doesn't exist yet; it renders inert. */
  href?: string;
}

interface SettingsGroup {
  label: string;
  icon: IconSvgElement;
  items: SettingsItem[];
}

const GROUPS: SettingsGroup[] = [
  {
    label: "Account",
    icon: UserCircleIcon,
    items: [
      { label: "Personal details", href: "/settings/profile" },
      { label: "Account security", href: "/settings/account-security" },
    ],
  },
  {
    label: "Organisation",
    icon: CorporateIcon,
    items: [
      { label: "Funding preference", href: "/settings/funding-mandate" },
      { label: "Company details", href: "/settings/company" },
      { label: "Team & Permissions" },
      { label: "Login activity" },
    ],
  },
];

const ITEM =
  "flex w-57.5 items-center gap-xs rounded-full py-xs pr-xs pl-lg text-body/[normal] transition-colors motion-reduce:transition-none";

function Item({ item, active }: { item: SettingsItem; active: boolean }) {
  if (!item.href) {
    return (
      <span aria-disabled="true" className={`${ITEM} text-grey-900`}>
        {item.label}
      </span>
    );
  }

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={`${ITEM} ${
        active
          ? "bg-evergreen-100 font-medium text-evergreen-700"
          : "text-grey-900 hover:bg-grey-100"
      }`}
    >
      {item.label}
    </Link>
  );
}

export function SettingsSidebar() {
  const pathname = usePathname();
  const { data: organization } = useOrganization();
  const { data: me } = useMe();
  const { mutate: logout, isPending: signingOut } = useLogout();
  const orgName = organization?.name ?? "";

  return (
    <aside className="flex w-65.5 flex-none flex-col gap-sm bg-grey-50 pt-xxs pb-lg">
      <div className="flex h-12 items-center px-md py-2.5">
        <Link
          href="/home"
          className="inline-flex items-center gap-xs rounded-full py-xs font-sans text-body-sm/[normal] font-medium text-evergreen-600"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={20} />
          Back
        </Link>
      </div>

      <div className="flex min-h-px flex-1 flex-col">
        <nav className="flex min-h-px flex-1 flex-col gap-xl px-md">
          <div className="flex flex-col gap-sm">
            <OrgAvatar name={orgName} size={40} shape="square" />
            <div className="flex min-w-0 flex-col gap-0.5">
              <p className="truncate text-body/[1.5] font-medium text-grey-900">
                {orgName}
              </p>
              <p className="truncate text-body-sm/[normal] text-grey-600">
                {me?.email}
              </p>
            </div>
          </div>

          {GROUPS.map((group) => (
            <div key={group.label} className="flex flex-col gap-sm">
              <div className="flex items-center gap-xs text-grey-600">
                <HugeiconsIcon
                  icon={group.icon}
                  size={16}
                  className="flex-none"
                />
                <span className="text-caption/[normal] font-medium uppercase">
                  {group.label}
                </span>
              </div>
              <ul className="flex flex-col gap-xs">
                {group.items.map((item) => (
                  <li key={item.label}>
                    <Item item={item} active={pathname === item.href} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="flex flex-col gap-md border-t border-grey-100 px-md pt-md">
          <button
            type="button"
            disabled={signingOut}
            onClick={() => logout()}
            className="flex cursor-pointer items-center gap-xs text-body-sm/[normal] text-grey-500 hover:text-grey-900 disabled:cursor-wait disabled:opacity-60"
          >
            <HugeiconsIcon icon={Logout01Icon} size={20} />
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}
