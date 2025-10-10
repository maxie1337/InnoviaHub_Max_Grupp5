import { useState } from "react";
import ChatPanel from "./ChatPanel";

interface Props {
  token?: string;
}
// Hanterar popup (öppna och stänga chatten)
export default function ChatBotPopup({ token }: Props) {
  // State för att hålla koll på om chatt är öppen eller stängd
  const [open, setOpen] = useState(false);

  return (
    <>
     {/* Är open true visas chatpanelen */}
      {open && (
        <div className="fixed bottom-20 left-4 z-50">
          <ChatPanel token={token} onClose={() => setOpen(false)} />
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-4 left-4 z-50 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition"
      >
        {/*Är chatten öppen = X, är den stängd = Chatbubbla*/}
        {open ? "✖" : "💬"}
      </button>
    </>
  );
}