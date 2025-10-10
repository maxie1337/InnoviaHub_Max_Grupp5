const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Streamar chat med gpt eller backend i realtid. Message = användarmeddelande, token = användarens token
export async function* streamChat(message: string, token?: string) {

  // Skickar en POST-förfrågan till API endpoint
  const response = await fetch(`${BASE_URL}/api/ai/chat/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}), // Här lägger vi till token om det finns
    },
    body: JSON.stringify({ question: message }), // Skickar vår förfrågan till backenden som JSON
  });

  // Om något gick fel så skickas ett felmeddelande
  if (!response.ok || !response.body) throw new Error("Chat stream failed");

  // Reader för realtidssvar
  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8"); 
  let buffer = "";

  // Läser strömmen kontinuerlig
  while (true) {
    const { value, done } = await reader.read(); 
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const parts = buffer.split("\n\n");

    // Loopar igenom all komplett data
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];

      if (part.startsWith("data:")) {
        // Tar bort data och mellanslag framför. Fixar korrekt stavning
        const data = part.replace(/^data:\s?/, "");

        // Skickar texten till frontend, rad för rad
        if (data && data !== "[DONE]") {
          yield data; 
        }
      }
    }

    buffer = parts[parts.length - 1];
  }
}