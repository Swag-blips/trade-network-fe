"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { User03Icon, UserAdd01Icon } from "@hugeicons/core-free-icons";
import { UserAvatar } from "@repo/ui/avatars";
import { Button } from "@repo/ui/button";
import { DataTable } from "@repo/ui/data-table";
import { SearchInput } from "@repo/ui/search-input";
import { Select } from "@repo/ui/select";
import { useMe } from "@/hooks/use-me";
import { usePermission } from "@/hooks/use-permission";
import { DEFAULT_PHOTO } from "@/utils/avatar";
import { InvitationStatus } from "./invitation-status";
import { InviteDialog } from "@/components/invite-dialog";
import { MemberStatus } from "./member-status";
import type { Member, MemberStatus as Status } from "@/types/team";

const ANY = "Any Status";
const STATUSES: (Status | typeof ANY)[] = [
  ANY,
  "Active",
  "Pending",
  "Expired",
  "Deactivated",
];

export function MembersPanel({
  members,
  empty,
}: {
  members: Member[];
  empty: string;
}) {
  const canManage = usePermission("team:manage");
  const { data: me } = useMe();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string>(ANY);
  const [inviting, setInviting] = useState(false);

  const needle = query.trim().toLowerCase();
  const visible = members.filter(
    (member) =>
      (member.name.toLowerCase().includes(needle) ||
        member.email.toLowerCase().includes(needle)) &&
      (status === ANY || member.status === status),
  );

  return (
    <div className="flex flex-col gap-md">
      <div className="flex items-center justify-between gap-md">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search members"
          className="w-94"
        />
        <div className="flex flex-none items-center gap-md">
          <Select
            aria-label="Filter by status"
            variant="filter"
            value={status}
            onValueChange={setStatus}
            options={STATUSES}
          />
          {canManage ? (
            <>
              <span aria-hidden className="h-4 w-px bg-grey-200" />
              <Button
                size="form"
                leadingIcon={<HugeiconsIcon icon={UserAdd01Icon} />}
                onClick={() => setInviting(true)}
              >
                Invite member
              </Button>
            </>
          ) : null}
        </div>
      </div>

      <DataTable
        variant="outlined"
        rows={visible}
        gap={32}
        rowKey={(member) => member.id}
        empty={empty}
        columns={[
          {
            header: `Member (${visible.length})`,
            cell: (member) =>
              member.invitation ? (
                <span className="flex min-w-0 items-center gap-md">
                  <span className="flex size-10 flex-none items-center justify-center rounded-full border border-dashed border-grey-400 bg-white text-grey-500">
                    <HugeiconsIcon icon={User03Icon} />
                  </span>
                  <span className="truncate text-grey-800">{member.email}</span>
                </span>
              ) : (
                <span className="flex min-w-0 items-center gap-md">
                  <UserAvatar
                    src={DEFAULT_PHOTO}
                    name={member.name || member.email}
                    size={40}
                  />
                  <span className="flex min-w-0 flex-col gap-1">
                    <span className="truncate text-body/[normal] font-medium text-grey-900">
                      {member.name || member.email}
                    </span>
                    {member.name ? (
                      <span className="truncate text-grey-600">
                        {member.email}
                      </span>
                    ) : null}
                  </span>
                </span>
              ),
          },
          { header: "Role", width: 200, cell: (member) => member.role },
          {
            header: "Status",
            width: 124,
            cell: (member) =>
              member.invitation ? (
                <InvitationStatus
                  invitation={member.invitation}
                  status={member.status}
                  editable={canManage}
                />
              ) : (
                <MemberStatus
                  member={member}
                  editable={
                    canManage &&
                    member.role !== "Owner" &&
                    member.userId !== me?.id
                  }
                />
              ),
          },
        ]}
      />

      {inviting ? <InviteDialog onClose={() => setInviting(false)} /> : null}
    </div>
  );
}
