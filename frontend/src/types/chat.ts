export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "suggestion";
  text: string;
  timestamp: string;
  resourceId?: number;
}
