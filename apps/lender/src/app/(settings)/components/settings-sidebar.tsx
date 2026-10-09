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

interface SettingsItem {
  label: string;
  href: string;
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
      { label: "My profile", href: "/settings/profile" },
      { label: "Preferences", href: "/settings/preferences" },
      { label: "Delete account", href: "/settings/delete-account" },
    ],
  },
  {
    label: "Organisation",
    icon: CorporateIcon,
    items: [
      { label: "Company details", href: "/settings/company" },
      { label: "Funding mandate", href: "/settings/funding-mandate" },
    ],
  },
];

export function SettingsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-65.5 flex-none flex-col gap-md bg-grey-50 pt-xxs pb-lg">
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
        <nav className="flex min-h-px flex-1 flex-col gap-lg px-md">
          <h2 className="font-sans text-body font-medium text-grey-900">
            Settings
          </h2>

          {GROUPS.map((group) => (
            <div key={group.label} className="flex flex-col gap-sm">
              <div className="flex items-center gap-xs">
                <HugeiconsIcon
                  icon={group.icon}
                  size={16}
                  className="flex-none text-grey-500"
                />
                <span className="text-caption/[normal] font-medium text-grey-500 uppercase">
                  {group.label}
                </span>
              </div>
              <ul className="flex flex-col gap-xs">
                {group.items.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={`flex w-57.5 items-center gap-xs rounded-full py-xs pr-xs pl-lg text-body-sm/[normal] transition-colors motion-reduce:transition-none ${
                          active
                            ? "bg-evergreen-100 font-medium text-evergreen-700"
                            : "text-grey-900 hover:bg-grey-100"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="flex flex-col gap-md border-t border-grey-100 px-md pt-md">
          <button
            type="button"
            className="flex items-center gap-xs text-body-sm/[normal] text-grey-500 hover:text-grey-900"
          >
            <HugeiconsIcon icon={Logout01Icon} size={20} />
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}
