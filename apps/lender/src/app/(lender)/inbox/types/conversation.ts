export interface Conversation {
  id: string;
  name: string;
  /** Photo URL; omit for the AI assistant. */
  photo?: string;
  isAssistant?: boolean;
  /** Shows the small company badge on the avatar. */
  fromCompany?: boolean;
  verified?: boolean;
  preview?: string;
  /** Messages you've already sent in this conversation. */
  sent?: string[];
  time?: string;
  unread?: number;
}
