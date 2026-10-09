export interface PriorityItem {
  id: string;
  label: string;
  href: string;
  count?: number;
}

export interface OpportunityItem {
  id: string;
  name: string;
  kind: string;
  initials: string;
  amount: string;
  expires: string;
  match: number;
  href: string;
}

export type ChatAsset =
  | { type: "priority-list"; title: string; items: PriorityItem[] }
  | {
      type: "opportunities";
      title: string;
      items: OpportunityItem[];
      action?: { label: string; href: string };
    };

export type AssistantBlock = { type: "text"; text: string } | ChatAsset;

export interface UserMessage {
  id: string;
  role: "user";
  text: string;
}

export interface AssistantMessage {
  id: string;
  role: "assistant";
  blocks: AssistantBlock[];
  suggestions?: string[];
}

export type ChatMessage = UserMessage | AssistantMessage;

export type ChatAssetType = ChatAsset["type"];
