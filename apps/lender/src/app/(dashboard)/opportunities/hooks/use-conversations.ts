import { useInfiniteQuery } from "@tanstack/react-query";
import { conversationService } from "../services";
import type { ConversationQuery, InboxShow } from "../types/inbox";
import { CONVERSATIONS } from "../utils/negotiation";

const SHOW_PARAM: Record<InboxShow, ConversationQuery["show"]> = {
  All: "all",
  "On-going": "active",
  Funded: "funded",
};

export function useConversations(show: InboxShow) {
  return useInfiniteQuery({
    queryKey: [...CONVERSATIONS, "list", show],
    queryFn: ({ pageParam }) =>
      conversationService.list({
        show: SHOW_PARAM[show],
        cursor: pageParam,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (page) => page.nextCursor ?? undefined,
  });
}
