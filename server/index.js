import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;
const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const MODEL = process.env.OLLAMA_MODEL || "llama3.2";

const SYSTEM_PROMPT = `You are the CoGenesis AI concierge — a calm, refined personal stylist for a luxury menswear house inspired by The Row, COS and Loro Piana. You speak in unhurried, editorial, old-money English.

Always:
- Address the customer as "you" and answer directly.
- Offer considered guidance on collections, sizing and fit, fabrics, styling, shipping and returns.
- Keep answers concise and warm — two to four sentences unless more is genuinely needed.
- Never use markdown or bullet symbols. Plain text only.
- If a question is outside fashion and shopping, steer it back to the atelier.
- Never invent order or tracking details; suggest checking the account under Purchases and sharing an order number with the team.

Speak in the register of a personal stylist, for example:
"Hello. I'd be happy to help you find the right piece for your wardrobe. Tell me what you're looking for today."`;

app.use(cors());
app.use(express.json());

function buildPrompt(question, history) {
  if (!history.length) return question;
  const lines = history.map((m) => {
    const speaker = m.role === "user" ? "Customer" : "Stylist";
    const content = String(m.content ?? "").slice(0, 800);
    return `${speaker}: ${content}`;
  });
  return `Conversation so far:\n\n${lines.join("\n\n")}\n\nCustomer: ${question}`;
}

app.get("/api/health", async (_req, res) => {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`);
    res.json({ ok: true, ollama: response.ok });
  } catch {
    res.json({ ok: true, ollama: false });
  }
});

app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body ?? {};

  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "message is required" });
  }

  const question = message.trim().slice(0, 2000);
  const convo = Array.isArray(history) ? history.slice(-8) : [];

  try {
    const ollamaResponse = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        prompt: buildPrompt(question, convo),
        system: SYSTEM_PROMPT,
        stream: false,
        options: { temperature: 0.7, num_predict: 320 },
      }),
    });

    if (!ollamaResponse.ok) {
      const errorText = await ollamaResponse.text();
      console.error("[ollama]", ollamaResponse.status, errorText.slice(0, 300));
      return res
        .status(502)
        .json({ error: `Ollama responded with status ${ollamaResponse.status}` });
    }

    const data = await ollamaResponse.json();
    const reply =
      (typeof data.response === "string" ? data.response : "").trim() ||
      "I couldn't find an answer just now — could you try rephrasing?";
    res.json({ reply });
  } catch (err) {
    console.error("[ollama] request failed:", err.message);
    res.status(502).json({
      error: "Unable to reach the local Ollama model. Is it running?",
    });
  }
});

app.listen(PORT, () => {
  console.log(
    `CoGenesis assistant server listening on http://localhost:${PORT} (model: ${MODEL})`
  );
});
