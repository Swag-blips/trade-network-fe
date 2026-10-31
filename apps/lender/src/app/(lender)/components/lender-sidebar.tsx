import {
  AlmsIcon,
  ChartRingIcon,
  Home03Icon,
  Mailbox01Icon,
  PeerToPeer02Icon,
} from "@hugeicons/core-free-icons";
import { Sidebar, type SidebarSection } from "@repo/ui/sidebar";
import { OrgFooter } from "./org-footer";

const SECTIONS: SidebarSection[] = [
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
        hasUpdates: true,
      },
      { label: "Offers", href: "/offers", icon: AlmsIcon },
    ],
  },
];

export function LenderSidebar() {
  return <Sidebar sections={SECTIONS} footer={<OrgFooter />} />;
}
