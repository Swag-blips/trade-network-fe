import { useQuery } from "@tanstack/react-query";
import { query } from "@/api/client";
import type { Invitation } from "@/types/team";

export const INVITATIONS_KEY = ["invitations"] as const;

export function useInvitations() {
  return useQuery({
    queryKey: INVITATIONS_KEY,
    queryFn: () => query<{ items: Invitation[] }>("/invitations"),
    select: (data) => data.items,
  });
}
