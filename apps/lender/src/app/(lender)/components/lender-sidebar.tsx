"use client";

import {
  AlmsIcon,
  ChartRingIcon,
  Home03Icon,
  Mailbox01Icon,
  PeerToPeer02Icon,
} from "@hugeicons/core-free-icons";
import { Sidebar, type SidebarSection } from "@repo/ui/sidebar";
import { useNewForYou } from "../hooks/use-new-for-you";
import { OrgMenu } from "./org-menu";

export function LenderSidebar() {
  const { data } = useNewForYou();

  const sections: SidebarSection[] = [
    {
      items: [
        { label: "Home", href: "/home", icon: Home03Icon },
        { label: "Portfolio", href: "/portfolio", icon: ChartRingIcon },
        { label: "Inbox", href: "/inbox", icon: Mailbox01Icon },
      ],
    },
    {
      label: "Opportunities",
      id: "sidebar-opportunities",
      items: [
        {
          label: "Matched",
          href: "/matched",
          icon: PeerToPeer02Icon,
          count: data?.fundingOpportunities,
        },
        { label: "Offers", href: "/offers", icon: AlmsIcon },
      ],
    },
  ];

  return <Sidebar sections={sections} footer={<OrgMenu />} />;
}
