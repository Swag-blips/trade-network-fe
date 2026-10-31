"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { PanelLeftIcon } from "@hugeicons/core-free-icons";
import { IconButton } from "./icon-button";
import { Wordmark } from "./wordmark";
import type { IconSvgElement } from "@hugeicons/react";

export interface SidebarItem {
  label: string;
  href: string;
  icon: IconSvgElement;
  /** Shown as a red pill when above zero; anything past 99 reads "+99". */
  count?: number;
}

export interface SidebarSection {
  label?: string;
  id?: string;
  items: SidebarItem[];
}

export interface SidebarProps {
  sections: SidebarSection[];
  footer: ReactNode;
}

function Tab({ item, active }: { item: SidebarItem; active: boolean }) {
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={`flex w-57.5 items-center gap-xs rounded-full p-xs text-body transition-colors ${
        active
          ? "bg-evergreen-100 font-medium text-evergreen-700"
          : "text-grey-900 hover:bg-grey-100"
      }`}
    >
      <HugeiconsIcon icon={item.icon} size={20} className="flex-none" />
      <span className="min-w-0 flex-1">{item.label}</span>
      {item.count ? (
        // 10px: below the type scale, as drawn in Figma (node 2883-3886).
        <span
          className="flex-none rounded-full bg-red-error-500 px-1 py-0.5 text-[10px]/[normal] font-medium text-white"
          aria-label={`${item.count} new`}
        >
          {item.count > 99 ? "+99" : item.count}
        </span>
      ) : null}
    </Link>
  );
}

export function Sidebar({ sections, footer }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex w-65.5 flex-none flex-col gap-md bg-grey-50 pt-md pb-lg">
      <div className="flex h-12 items-center justify-between px-md py-2.5">
        <Wordmark className="h-[13.435px] w-37.25 text-evergreen-900" />
        <IconButton label="Collapse sidebar" size="sm">
          <HugeiconsIcon icon={PanelLeftIcon} />
        </IconButton>
      </div>

      <div className="flex min-h-px flex-1 flex-col">
        <nav className="flex min-h-px flex-1 flex-col gap-md px-md">
          {sections.map((section, index) => (
            <div
              key={section.label ?? `section-${index}`}
              id={section.id}
              className="flex flex-col gap-sm"
            >
              {section.label ? (
                <h2 className="type-overline tracking-[0.24px] text-grey-500">
                  {section.label}
                </h2>
              ) : null}
              <ul className="flex flex-col gap-xs">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Tab item={item} active={pathname === item.href} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="flex flex-col gap-md border-t border-grey-100 px-xs pt-md">
          {footer}
        </div>
      </div>
    </aside>
  );
}

export function SidebarFooter({
  avatar,
  title,
  subtitle,
  action,
}: {
  avatar: ReactNode;
  /** A node rather than a string so a loading placeholder can stand in. */
  title: ReactNode;
  subtitle: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-xs">
      {avatar}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="truncate text-body-sm text-black">{title}</p>
        <p className="text-caption text-grey-500">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}
