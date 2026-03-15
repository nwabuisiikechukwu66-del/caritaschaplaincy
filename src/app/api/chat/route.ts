import { NextRequest, NextResponse } from "next/server";
import doctrines from "@/data/doctrines.json";

// ─── System prompt: "Ask a Padre" AI ────────────────────────────────────
const SYSTEM_PROMPT = `You are "Ask a Padre" — the AI theological guide of Caritas Catholic Chaplaincy, Caritas University, Amorji-Nike, Enugu, Nigeria.

You are warm, pastoral, and deeply knowledgeable in Catholic theology — like a wise, approachable priest who makes the faith beautiful and understandable.

CHAPLAINCY FACTS (always accurate):
- Chaplain: Rev. Fr. Davison Odoviro
- University Chaplaincy at: Caritas University, Amorji-Nike, Enugu State, Nigeria
- Founded by: Very Rev. Fr. Prof. Emmanuel Matthew Paul Edeh (also founder of Madonna University, OSISATECH, and the Jesus the Saviour/Saviourite Congregation)
- Spiritual charism: "Jesus is the Saviour of every human person" (Saviourite spirituality)
- Pope: Leo XIV | Diocese: Enugu | Bishop: Callistus Onaga | Aux. Bishop: Ernest Obodo
- Archbishop: Valerian Okeke (Metropolitan of Onitsha Province)
- Apostolic Nuncio to Nigeria: Archbishop Michael Crotty

MASS SCHEDULE:
- Lauds: 5:30 AM (School Podium)
- Morning Mass: 6:00 AM (School Podium)
- Sunday Mass: 8:00 AM (School Auditorium)
- Afternoon Mass: 3:00 PM (Fathers' Chapel — daily)
- Rosary & Vespers: 6:00 PM (School Podium)
- Adoration: Wednesdays 5:30 PM (School Auditorium)
- Benediction: Sundays 5:30 PM (School Auditorium)
- Confession: Saturdays 7:00 PM (or meet Fr. Odoviro anytime)
- May & October Devotion: Benediction with Rosary & Vespers at 5:30 PM

SERVICES:
- Mass Intention: ₦100 | Thanksgiving Mass: ₦2,500 | Petitions: FREE
- Bank: First Bank Nigeria | Account: 3012345678 | Name: Caritas Catholic Chaplaincy

DOCTRINAL FOUNDATION:
Base all theological answers on Sacred Scripture, Sacred Tradition, the Catechism of the Catholic Church (CCC), and Papal Magisterium. Never contradict official Catholic teaching.

RESPONSE STYLE:
- Warm, pastoral, intelligent — like a holy priest in conversation
- Structure: Direct answer → Brief explanation → Scripture or CCC reference → Encouragement
- Address users respectfully; use "dear friend" where appropriate
- Keep answers focused and helpful — not overly long unless asked for depth
- If you don't know, say so humbly and direct to a priest

You can answer questions about: Catholic doctrine, sacraments, saints, the chaplaincy schedule, how to book services, moral theology, prayer, the Bible, Church history, devotions, and anything Catholic.`;

// ─── Tier 1: Magisterium AI (best for Catholic content) ─────────────────
async function tryMagisterium(messages: any[]): Promise<string | null> {
  const key = process.env.MAGISTERIUM_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch("https://api.magisterium.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "magisterium-ai",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        max_tokens: 800,
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.choices?.[0]?.message?.content || null;
  } catch {
    return null;
  }
}

// ─── Tier 2: Gemini AI ────────────────────────────────────────────────────
async function tryGemini(messages: any[]): Promise<string | null> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  try {
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const userMessages = messages.filter((m: any) => m.role !== "system");
    const history = userMessages.slice(0, -1).map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));
    const chat = model.startChat({ history, systemInstruction: SYSTEM_PROMPT });
    const last = userMessages[userMessages.length - 1];
    const result = await chat.sendMessage(last.content);
    return result.response.text();
  } catch (e) {
    console.error("Gemini chat error:", e);
    return null;
  }
}

// ─── Tier 3: OpenAI fallback ──────────────────────────────────────────────
async function tryOpenAI(messages: any[]): Promise<string | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        max_tokens: 700,
      }),
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.choices?.[0]?.message?.content || null;
  } catch {
    return null;
  }
}

// ─── Tier 4: Local doctrine JSON search ──────────────────────────────────
function searchLocalDoctrines(query: string): string {
  const q = query.toLowerCase();
  const matches = (doctrines as any[])
    .filter((d) =>
      d.question.toLowerCase().includes(q) ||
      d.answer.toLowerCase().includes(q) ||
      d.tags?.some((t: string) => q.includes(t.toLowerCase()))
    )
    .slice(0, 3);

  if (matches.length === 0) {
    // Check if it's a chaplaincy-specific question
    const chaplainKeywords = ["mass", "time", "when", "schedule", "confession", "book", "intention", "petition", "society", "choir", "adoration", "rosary", "chaplain", "odoviro", "edeh", "caritas", "sacristan", "catechist"];
    const isChaplainQ = chaplainKeywords.some((k) => q.includes(k));
    if (isChaplainQ) {
      return `For chaplaincy-specific queries, here is what I know:\n\n**Mass Times:** Lauds 5:30am · Morning Mass 6am · Sunday Mass 8am (Auditorium) · Afternoon Mass 3pm (Fathers' Chapel) · Rosary & Vespers 6pm · Adoration Wednesdays 5:30pm · Benediction Sundays 5:30pm · Confession Saturdays 7pm.\n\n**Services:** Mass Intention ₦100 · Thanksgiving Mass ₦2,500 · Petitions FREE.\n\nFor more details, please visit the relevant page on this website or contact Fr. Davison Odoviro directly. ✝`;
    }
    return `I wasn't able to find a specific answer in my knowledge base at this moment. I recommend:\n\n1. Consulting the **Catechism of the Catholic Church** at vatican.va\n2. Speaking with **Fr. Davison Odoviro**, our chaplain\n3. Searching our **Catholic Doctrines** page on this website\n\nGod bless you. ✝`;
  }

  const result = matches
    .map((m) => `**${m.question}**\n\n${m.answer}${m.source ? `\n\n*Source: ${m.source}*` : ""}`)
    .join("\n\n---\n\n");

  return result + "\n\n*From our Catholic Doctrine database. Ask me anything else! ✝*";
}

// ─── Main handler ─────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    if (!messages?.length) return NextResponse.json({ error: "No messages provided" }, { status: 400 });

    // Attempt each tier in order
    const reply =
      (await tryMagisterium(messages)) ||
      (await tryGemini(messages)) ||
      (await tryOpenAI(messages)) ||
      searchLocalDoctrines(messages.filter((m: any) => m.role === "user").pop()?.content || "");

    return NextResponse.json({ reply });
  } catch (e) {
    console.error("Chat error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
