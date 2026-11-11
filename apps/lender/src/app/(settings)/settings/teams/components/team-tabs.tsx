"use client";

import { useState } from "react";
import { Tabs } from "@repo/ui/tabs";
import { useMe } from "@/hooks/use-me";
import { MembersPanel } from "./members-panel";
import { RolesPanel } from "./roles-panel";
import type { Member } from "../types/team";

const TABS = ["Members", "Roles"] as const;

export function TeamTabs() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Members");
  const { data: me } = useMe();

  // No members endpoint yet. An organisation is created with only its Owner, and nobody can be invited.
  const members: Member[] = me
    ? [
        {
          id: me.id,
          name: `${me.firstName} ${me.lastName}`.trim(),
          email: me.email,
          role: "Owner",
          status: "Active",
        },
      ]
    : [];

  return (
    <>
      <Tabs label="Team" tabs={TABS} value={tab} onChange={setTab} />
      {tab === "Members" ? (
        <MembersPanel members={members} />
      ) : (
        <RolesPanel members={members} />
      )}
    </>
  );
}
