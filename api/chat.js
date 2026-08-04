import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// gemini-2.5-flash is no longer available to new users. Default to
// gemini-2.5-pro; override with GEMINI_MODEL env var if needed.
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-pro";

const SYSTEM_PROMPT = `
You are the elegant AI concierge for CoGenesis, a luxury contemporary clothing brand.
Your tone is sophisticated, minimalist, polite, and articulate (1-3 sentences maximum).

Knowledge Base:
1. Returns Policy: We accept returns and exchanges within 7 days of delivery for unworn, unwashed items in original packaging. Refunds are processed to the original payment method.
2. Shipping: Domestic shipping takes 3-5 business days. International shipping takes 7-10 business days. Orders ship within 48 hours.
3. Pricing & Discounts: CoGenesis pieces are premium luxury. We do not offer discounts or sales.
4. Specific Products (FAQs):
   - **Linen Shirt:** Made from 100% Belgian flax linen. Pre-washed for softness.
   - **Structured Pants:** Tailored fit using organic Italian cotton.
   - **Silk Scarf:** 100% Mulberry silk.
5. Sizing: Most items are structured. For a relaxed fit, order one size up. Refer the customer to the online size chart on the product page.
6. Order Support: If a customer asks to cancel an order or check their order status, ask for their Order ID and tell them our human support team will reach out via email shortly.

Strict Guidelines:
* Respond elegantly. Do not use excessive emojis or slang.
* Answer only using the knowledge provided above. If you do not know the answer, politely state: "I'm sorry, I cannot answer that, but I will flag this for our team to contact you."
* Keep answers minimal.

User query follows.
`;

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not set.");
    sendJson(res, 500, {
      error: "Server is not configured. Missing GEMINI_API_KEY.",
    });
    return;
  }

  try {
    const { message, history } = req.body ?? {};

    if (!message || typeof message !== "string") {
      sendJson(res, 400, { error: "message is required" });
      return;
    }

    const normalizeRole = (role) => (role === "user" ? "user" : "model");
    const normalizeText = (m) =>
      typeof m.content === "string"
        ? m.content
        : m.parts?.[0]?.text ?? "";

    const messages = [
      { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
      ...(Array.isArray(history) ? history : [])
        .filter((m) => normalizeText(m))
        .map((m) => ({
          role: normalizeRole(m.role),
          parts: [{ text: normalizeText(m) }],
        })),
      { role: "user", parts: [{ text: message }] },
    ];

    const response = await genAI.models.generateContent({
      model: GEMINI_MODEL,
      contents: messages,
    });

    const responseText =
      response.text?.() ?? "I'm sorry, I couldn't answer that right now.";

    sendJson(res, 200, { reply: responseText });
  } catch (error) {
    console.error("Chat endpoint error:", error);
    sendJson(res, 500, { error: "Something went wrong processing your request." });
  }
}
