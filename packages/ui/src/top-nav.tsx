"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { BrandMark } from "./brand-mark";

export interface TopNavItem {
  label: string;
  /** Left off for a destination that doesn't exist yet; it renders inert. */
  href?: string;
  icon: IconSvgElement;
}

export interface TopNavProps {
  items: TopNavItem[];
  homeHref: string;
  trailing: ReactNode;
}

const ITEM =
  "relative flex items-center gap-xs px-sm font-sans text-body/6 font-medium whitespace-nowrap transition-colors";

function NavItem({ item, active }: { item: TopNavItem; active: boolean }) {
  const content = (
    <>
      <HugeiconsIcon icon={item.icon} size={20} className="flex-none" />
      {item.label}
    </>
  );

  if (!item.href) {
    return (
      <span aria-disabled="true" className={`${ITEM} text-grey-600`}>
        {content}
      </span>
    );
  }

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={`${ITEM} focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-evergreen-600 ${
        active
          ? "bg-linear-to-b from-evergreen-100/0 to-evergreen-100/75 to-83% text-evergreen-600 after:absolute after:inset-x-0 after:bottom-0 after:h-0.75 after:bg-evergreen-600"
          : "text-grey-600 hover:text-grey-900"
      }`}
    >
      {content}
    </Link>
  );
}

export function TopNav({ items, homeHref, trailing }: TopNavProps) {
  const pathname = usePathname();

  return (
    <header className="flex-none border-b border-grey-100 bg-white">
      <div className="mx-auto flex w-full max-w-content items-center justify-between px-xl">
        <div className="flex items-center gap-sm self-stretch">
          <Link href={homeHref} aria-label="Home" className="flex-none">
            <BrandMark className="h-6 w-[31.609px] text-evergreen-900" />
          </Link>
          <span aria-hidden className="h-4.5 w-px bg-grey-200" />
          <nav className="flex gap-xs self-stretch">
            {items.map((item) => (
              <NavItem
                key={item.label}
                item={item}
                active={
                  !!item.href &&
                  (pathname === item.href ||
                    pathname.startsWith(`${item.href}/`))
                }
              />
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-md py-xs">
          <span aria-hidden className="h-5.25 w-px bg-grey-200" />
          {trailing}
        </div>
      </div>
    </header>
  );
}
