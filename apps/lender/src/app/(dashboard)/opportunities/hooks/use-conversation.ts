import { useQuery } from "@tanstack/react-query";
import { readStatus } from "@/api/client";
import { conversationService } from "../services";
import { conversationKey } from "../utils/negotiation";

export function useConversation(id: string) {
  return useQuery({
    queryKey: conversationKey(id),
    queryFn: () => conversationService.get(id),
    retry: (failures, error) => readStatus(error) !== 404 && failures < 3,
  });
}
