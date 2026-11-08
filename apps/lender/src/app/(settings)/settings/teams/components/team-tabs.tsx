"use client";

import { useState } from "react";
import { Tabs } from "@repo/ui/tabs";
import { useMembers } from "@/hooks/use-members";
import { MembersPanel } from "./members-panel";
import { RolesPanel } from "./roles-panel";

const TABS = ["Members", "Roles"] as const;

export function TeamTabs() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Members");
  const { members, isPending, isError } = useMembers();

  return (
    <>
      <Tabs label="Team" tabs={TABS} value={tab} onChange={setTab} />
      {tab === "Members" ? (
        <MembersPanel
          members={members}
          empty={
            isError
              ? "We couldn't load your team. Refresh the page to try again."
              : isPending
                ? ""
                : "No members match these filters."
          }
        />
      ) : (
        <RolesPanel members={members} />
      )}
    </>
  );
}
