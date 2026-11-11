"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon, UserAdd01Icon } from "@hugeicons/core-free-icons";
import { UserAvatar } from "@repo/ui/avatars";
import { Button } from "@repo/ui/button";
import { DataTable } from "@repo/ui/data-table";
import { SearchInput } from "@repo/ui/search-input";
import { Select } from "@repo/ui/select";
import { usePermission } from "@/hooks/use-permission";
import type { Member, MemberStatus } from "../types/team";

const ANY = "Any Status";
const STATUSES: (MemberStatus | typeof ANY)[] = [ANY, "Active", "Invited"];

const DOT: Record<MemberStatus, string> = {
  Active: "bg-green-500",
  Invited: "bg-ochre-500",
};

export function MembersPanel({ members }: { members: Member[] }) {
  const canManage = usePermission("team:manage");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string>(ANY);

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
        empty="No members match these filters."
        columns={[
          {
            header: `Member (${visible.length})`,
            cell: (member) => (
              <span className="flex min-w-0 items-center gap-md">
                <UserAvatar name={member.name} size={40} />
                <span className="flex min-w-0 flex-col gap-1">
                  <span className="truncate text-body/[normal] font-medium text-grey-900">
                    {member.name}
                  </span>
                  <span className="truncate text-grey-600">{member.email}</span>
                </span>
              </span>
            ),
          },
          { header: "Role", width: 200, cell: (member) => member.role },
          {
            header: "Status",
            width: 124,
            cell: (member) => (
              <span className="flex items-center gap-xs">
                <span className={`size-2 rounded-full ${DOT[member.status]}`} />
                {member.status}
                <HugeiconsIcon icon={ArrowDown01Icon} size={16} />
              </span>
            ),
          },
        ]}
      />
    </div>
  );
}
