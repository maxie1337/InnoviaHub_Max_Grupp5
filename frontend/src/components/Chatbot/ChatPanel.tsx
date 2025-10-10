import { useState, useEffect, useRef, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { UserContext } from "@/context/UserContext";
import { createBooking } from "@/api/bookingApi";
import { fetchResources } from "@/api/resourceApi";
import { streamChat } from "@/api/chatApi";
import { useBookingHub } from "@/hooks/useBookingHub";
import ChatMessageBubble from "./ChatMessageBubble";
import { Button } from "@/components/ui/button";
import type { ChatMessage } from "@/types/chat";
import type { Resource } from "@/types/resource";

interface PendingBooking {
  resourceId: number;
  date: string;
  timeslot: "FM" | "EM";
}

export default function ChatPanel({
  token,
  onClose,
}: {
  token?: string;
  onClose: () => void;
}) {
  // Hämtar användartoken från context
  const { token: ctxToken } = useContext(UserContext);
  const activeToken = token ?? ctxToken;

  // States för meddelande, input, laddning, resurser och bokningar
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [resources, setResources] = useState<Resource[]>([]);
  const [pendingBooking, setPendingBooking] = useState<PendingBooking | null>(null);
  const [selectedResourceId, setSelectedResourceId] = useState<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Smooth-scrollar till det senaste meddelandet
  useEffect(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  // Resurser hämtas när komponenten ChatPanel laddas.
  useEffect(() => {
    if (!activeToken) return;
    fetchResources(activeToken)
      .then(setResources)
      .catch(() => toast.error("Kunde inte hämta resurser!"));
  }, [activeToken]);

  // SignalR hook 
  useBookingHub(activeToken, () => {
    fetchResources(activeToken!).then(setResources).catch(() => {});
    toast("En bokning har uppdaterats!");
  });

  // Hanterar användarens skickade meddelande
  async function handleSend() {
    if (!input.trim()) return;

    const query = input.trim();
    setInput("");

    // Lägger till meddelandet direkt i chatten
    setMessages((prev) => [
      ...prev,
      {
        id: uuidv4(),
        role: "user",
        text: query,
        timestamp: new Date().toISOString(),
      },
    ]);

    setLoading(true);

    try {
      let fullText = "";

      // Streamar svar från GPT (från backend), rad för rad
      for await (const chunk of streamChat(query, activeToken)) {
        let parsed: any;
        try {
          parsed = JSON.parse(chunk); // Kollar om chuck är JSON (lediga resurser)
        } catch {
          parsed = null;
        }

        // Detta sker om GPT svarar att det finns lediga resurser
        if (parsed && parsed.type === "availability" && Array.isArray(parsed.resources)) {
          const items = parsed.resources.map((name: string) => {
            const match = resources.find((r) => r.name === name);
            return {
              id: uuidv4(),
              role: "suggestion" as const,
              text: name,
              resourceId: match?.resourceId,
              timestamp: new Date().toISOString(),
            };
          });

          // Visar de tillgänliga resurserna som klcikbara alternativ
          setMessages((prev) => [
            ...prev,
            {
              id: uuidv4(),
              role: "assistant",
              text: `Följande ${parsed.category} är tillgängliga för ${parsed.date}:`,
              timestamp: new Date().toISOString(),
            },
            ...items,
          ]);
          continue;
        }

        // Annars bygger vi på med GPT svar löpande
        fullText += chunk;
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== "ai"),
          {
            id: "ai",
            role: "assistant",
            text: fullText,
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    } catch (err) {
      // Skickar felmeddelande om något är fel vid kommunikation med backend
      console.error(err);
      toast.error("Kunde inte få tag på chatbotten, försök igen!");
    } finally {
      setLoading(false);
    }
  }

  // Funktionalitet för klick på en resurs i listan
  function handleSelectResource(resourceId: number) {
    setSelectedResourceId((prev) => (prev === resourceId ? null : resourceId));
    setPendingBooking((prev) =>
      prev && prev.resourceId === resourceId
        ? null
        : {
            resourceId,
            date: new Date().toISOString().split("T")[0],
            timeslot: "FM",
          }
    );
  }

  // Bekräftelse av bokning
  async function handleConfirmBooking() {
    if (!pendingBooking || !activeToken) return;
    try {
      await createBooking(activeToken, {
        resourceId: pendingBooking.resourceId,
        bookingDate: pendingBooking.date,
        timeslot: pendingBooking.timeslot,
      });

      const resource = resources.find(
        (r) => r.resourceId === pendingBooking.resourceId
      );
      // Meddelande skickas i chatten om man bekräftar en tid
      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          role: "assistant",
          text: `Bokningen skapad!\n\nResurs: ${
            resource?.name ?? pendingBooking.resourceId
          }\nTid: ${
            pendingBooking.timeslot === "FM"
              ? "Förmiddag (08–12)"
              : "Eftermiddag (12–16)"
          }\nDatum: ${pendingBooking.date}`,
          timestamp: new Date().toISOString(),
        },
      ]);

      setPendingBooking(null);
      setSelectedResourceId(null);
      toast.success("Bokning skapad!");
      fetchResources(activeToken).then(setResources).catch(() => {});
    } catch {
      toast.error("Kunde inte skapa bokning");
    }
  }

  // Delar upp förslag på bokningar och meddelande i olika block, så att de separeras.
  const renderBlocks = (() => {
    const blocks: Array<
      | { kind: "message"; item: ChatMessage }
      | { kind: "suggestions"; items: ChatMessage[] }
    > = [];

    for (let i = 0; i < messages.length; i++) {
      const m = messages[i];
      if (m.role !== "suggestion") {
        blocks.push({ kind: "message", item: m });
        continue;
      }
      // Grupperar flera förslag tillsammans
      const group: ChatMessage[] = [];
      while (i < messages.length && messages[i].role === "suggestion") {
        group.push(messages[i]);
        i++;
      }
      i--;
      blocks.push({ kind: "suggestions", items: group });
    }
    return blocks;
  })();

  return (
    <div className="bg-white border-2 rounded-2xl shadow-lg w-80 flex flex-col h-96 relative overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-3 border-b bg-gray-100">
        <h3 className="font-semibold">Bokningshjälpare</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-red-500 font-bold"
        >
          ✕
        </button>
      </div>

      {/* Lista för chatmeddelanden */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {renderBlocks.map((b, idx) => {
          if (b.kind === "message") {
            return <ChatMessageBubble key={b.item.id} message={b.item} />;
          }

          return (
            <div key={`sg-${idx}`} className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                {b.items.map((s) => (
                  <button
                    key={s.id}
                    onClick={() =>
                      s.resourceId && handleSelectResource(s.resourceId)
                    }
                    className={`px-3 py-2 rounded-lg text-sm text-left transition ${
                      selectedResourceId === s.resourceId
                        ? "bg-blue-200 font-semibold"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {s.text}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Bokningsruta i chatpanelen */}
      {pendingBooking && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-5 border shadow-lg w-72 text-center">
            <p className="text-sm mb-3">
              Du har valt{" "}
              {
                resources.find(
                  (r) => r.resourceId === pendingBooking.resourceId
                )?.name
              }
              .
            </p>

            <div className="flex flex-col gap-2 mb-3">
              <Button
                variant={
                  pendingBooking.timeslot === "FM" ? "default" : "outline"
                }
                onClick={() =>
                  setPendingBooking((p) =>
                    p ? { ...p, timeslot: "FM" } : p
                  )
                }
                className="w-full"
              >
                Förmiddag (08–12)
              </Button>
              <Button
                variant={
                  pendingBooking.timeslot === "EM" ? "default" : "outline"
                }
                onClick={() =>
                  setPendingBooking((p) =>
                    p ? { ...p, timeslot: "EM" } : p
                  )
                }
                className="w-full"
              >
                Eftermiddag (12–16)
              </Button>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                onClick={handleConfirmBooking}
                className="bg-green-600 hover:bg-green-700 text-white w-full"
              >
                Bekräfta bokning
              </Button>
              <Button
                variant="outline"
                onClick={() => setPendingBooking(null)}
                className="w-full"
              >
                Avbryt
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Input fält för meddelande */}
      <div className="p-3 border-t flex gap-2">
        <input
          type="text"
          value={input}
          disabled={loading}
          onChange={(e) => setInput(e.target.value)}
          className="border rounded-md flex-1 p-2 text-sm focus:outline-none"
          placeholder="Skriv ett meddelande..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <Button onClick={handleSend} disabled={loading}>
          Skicka
        </Button>
      </div>
    </div>
  );
}