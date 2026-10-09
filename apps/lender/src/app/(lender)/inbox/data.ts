import type { Conversation } from "./types/conversation";

/** Tai is pinned above a divider; everything after it is a person. */
export const ASSISTANT: Conversation = {
  id: "tai",
  name: "Tai (AI assistant)",
  isAssistant: true,
  verified: true,
};

export const CONVERSATIONS: Conversation[] = [
  {
    id: "titan-suppliers",
    name: "Simi from Titan Suppliers",
    photo: "/avatars/simi.png",
    fromCompany: true,
    sent: ["Hi Titan Suppliers, We’re currently reviewing this opportunity"],
  },
];
