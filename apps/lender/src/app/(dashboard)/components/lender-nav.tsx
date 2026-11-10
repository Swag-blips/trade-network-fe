"use client";

import {
  BankIcon,
  Briefcase02Icon,
  Home05Icon,
  SearchList01Icon,
} from "@hugeicons/core-free-icons";
import { TopNav, type TopNavItem } from "@repo/ui/top-nav";
import { OrgMenu } from "./org-menu";

const ITEMS: TopNavItem[] = [
  { label: "Home", href: "/home", icon: Home05Icon },
  { label: "Verify business", icon: SearchList01Icon },
  { label: "Opportunities", href: "/opportunities", icon: BankIcon },
  { label: "Portfolio", href: "/portfolio", icon: Briefcase02Icon },
];

export function LenderNav() {
  return <TopNav items={ITEMS} homeHref="/home" trailing={<OrgMenu />} />;
}
