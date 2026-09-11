import { HugeiconsIcon } from "@hugeicons/react";
import {
  AlmsIcon,
  ChartRingIcon,
  Home03Icon,
  Mailbox01Icon,
  PeerToPeer02Icon,
  Settings01Icon,
} from "@hugeicons/core-free-icons";
import {
  Sidebar,
  SidebarFooter,
  type SidebarSection,
} from "@/components/sidebar";
import { IconButton } from "@repo/ui/icon-button";
import { OrgAvatar } from "@/components/avatars";

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

const ORG = { name: "Owoka Investment Limited", role: "Capital provider" };

export function LenderSidebar() {
  return (
    <Sidebar
      sections={SECTIONS}
      footer={
        <SidebarFooter
          avatar={<OrgAvatar name={ORG.name} />}
          title={ORG.name}
          subtitle={ORG.role}
          action={
            <IconButton label="Organisation settings" size="sm">
              <HugeiconsIcon icon={Settings01Icon} />
            </IconButton>
          }
        />
      }
    />
  );
}
