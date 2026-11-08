import { useQuery } from "@tanstack/react-query";
import { query, readStatus } from "@/api/client";
import type { Member, MemberResponse } from "@/types/team";
import { useInvitations } from "./use-invitations";

export const MEMBERS_KEY = ["team", "members"] as const;

function toMember(item: MemberResponse): Member {
  return {
    id: item.id,
    userId: item.userId,
    name: `${item.firstName} ${item.lastName}`.trim(),
    email: item.email,
    role: item.role.name,
    status: "Active",
  };
}

export function useMembers() {
  const { data: invitations = [] } = useInvitations();
  const {
    data: members = [],
    isPending,
    isError,
  } = useQuery({
    queryKey: MEMBERS_KEY,
    queryFn: async () =>
      (await query<{ items: MemberResponse[] }>("/members")).items.map(
        toMember,
      ),
    retry: (failures, error) => {
      const status = readStatus(error);
      return (status === undefined || status >= 500) && failures < 3;
    },
  });

  if (isPending || isError) return { members: [], isPending, isError };

  return {
    isPending,
    isError,
    members: [
      ...members,
      ...invitations.map((invitation): Member => ({
        id: invitation.id,
        name: "",
        email: invitation.email,
        role: invitation.role.name,
        status: invitation.status === "EXPIRED" ? "Expired" : "Pending",
        invitation,
      })),
    ],
  };
}
