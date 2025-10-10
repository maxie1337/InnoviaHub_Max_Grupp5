import type { ChatMessage } from "@/types/chat";

// Enkel komponent för att visa meddelanden i chatten
export default function ChatMessageBubble({ message }: { message: ChatMessage }) {
  // Kollar om användare skickat meddelande
  const isUser = message.role === "user";
  return (
    // Skickar tillbaka texten
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`rounded-2xl px-4 py-2 max-w-xs text-sm whitespace-pre-wrap break-words ${
          isUser ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
        }`}
      >
        {message.text}
      </div>
    </div>
  );
}