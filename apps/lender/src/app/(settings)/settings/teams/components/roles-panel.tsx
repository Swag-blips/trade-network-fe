import { HugeiconsIcon } from "@hugeicons/react";
import {
  Key01Icon,
  PlusSignIcon,
  SquareLock01Icon,
  User03Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@repo/ui/button";
import { usePermission } from "@/hooks/use-permission";
import { SYSTEM_ROLES } from "../utils/roles";
import type { Member, Role } from "../types/team";

function RoleCard({ role, memberCount }: { role: Role; memberCount: number }) {
  return (
    <article className="flex flex-col gap-sm rounded-lg border border-grey-100 bg-white p-md shadow-card">
      <div className="flex flex-col gap-1">
        <h3 className="truncate font-sans text-body/[normal] font-medium text-grey-900">
          {role.name}
        </h3>
        <p className="text-body-sm/[1.5] text-grey-600">{role.description}</p>
      </div>
      <hr className="border-grey-100" />
      <div className="flex items-center gap-sm text-body-sm/[normal] text-grey-600">
        <span className="flex items-center gap-xs">
          <HugeiconsIcon icon={Key01Icon} size={16} aria-label="Permissions" />
          {role.permissionCount}
        </span>
        <span className="flex flex-1 items-center gap-xs">
          <HugeiconsIcon icon={User03Icon} size={16} aria-label="Members" />
          {memberCount}
        </span>
        <HugeiconsIcon
          icon={SquareLock01Icon}
          size={20}
          aria-label="System role"
          className="flex-none text-grey-900"
        />
      </div>
    </article>
  );
}

export function RolesPanel({ members }: { members: Member[] }) {
  const canManage = usePermission("team:manage");

  return (
    <div className="flex flex-col gap-lg">
      <div className="flex items-center justify-between gap-md">
        <div className="flex min-w-0 flex-1 flex-col gap-xs">
          <h2 className="font-sans text-xl/[normal] font-medium text-grey-900">
            Roles
          </h2>
          <p className="text-body/[normal] text-grey-600">
            Manage roles and permissions tailored to your team.
          </p>
        </div>
        {canManage ? (
          <Button
            size="form"
            leadingIcon={<HugeiconsIcon icon={PlusSignIcon} />}
          >
            Create custom role
          </Button>
        ) : null}
      </div>

      <section className="flex flex-col">
        <h3 className="type-overline border-b border-grey-100 pb-md font-sans tracking-[0.24px] text-grey-600">
          System roles ({SYSTEM_ROLES.length})
        </h3>
        <div className="grid grid-cols-2 gap-md py-md">
          {SYSTEM_ROLES.map((role) => (
            <RoleCard
              key={role.name}
              role={role}
              memberCount={
                members.filter((member) => member.role === role.name).length
              }
            />
          ))}
        </div>
      </section>
    </div>
  );
}
