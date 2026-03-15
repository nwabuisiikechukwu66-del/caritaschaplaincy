import { NextRequest, NextResponse } from "next/server";

// ─── Source 1: Universalis (has saint data alongside readings) ─────────────
async function fetchSaintFromUniversalis(date: string) {
  try {
    const d = new Date(date);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const url = `https://universalis.com/${y}${m}${day}/jsonpmass.js`;
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return null;
    let text = await res.text();
    text = text.replace(/^[^(]*\(/, "").replace(/\)[^)]*$/, "").trim();
    const data = JSON.parse(text);
    if (!data) return null;

    const decodeHTMLEntities = (text: string) => {
      return text
        .replace(/&#x2010;/g, "-")
        .replace(/&#x2011;/g, "-")
        .replace(/&#2013;/g, "–")
        .replace(/&#2014;/g, "—")
        .replace(/&#2018;/g, "‘")
        .replace(/&#2019;/g, "’")
        .replace(/&#201C;/g, "“")
        .replace(/&#201D;/g, "”")
        .replace(/&#160;/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&#8211;/g, "–")
        .replace(/&#8212;/g, "—")
        .replace(/&#8216;/g, "‘")
        .replace(/&#8217;/g, "’")
        .replace(/&#8220;/g, "“")
        .replace(/&#8221;/g, "”")
        .replace(/&#39;/g, "'")
        .replace(/&#x2014;/g, "—")
        .replace(/&#x2018;/g, "‘")
        .replace(/&#x2019;/g, "’")
        .replace(/&#x201C;/g, "“")
        .replace(/&#x201D;/g, "”")
        .replace(/&#x2026;/g, "...");
    };

    const formatLiturgicalText = (s: string = "") => {
      // Preserve structural tags but remove attributes
      let structural = s
        .replace(/<(p|br|div)[^>]*>/gi, " <$1> ")
        .replace(/<\/(p|div)>/gi, " </$1> ");

      // Strip all other HTML tags
      let clean = structural.replace(/<(?!\/?(p|br|div)\b)[^>]+>/gi, "");

      // Clean up whitespace while preserving structure
      clean = clean.replace(/[ \t]+/g, " ").trim();

      return decodeHTMLEntities(clean);
    };

    const stripHTML = (s: string = "") => {
      let clean = s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      return decodeHTMLEntities(clean);
    };

    const dayText = stripHTML(data.day || "");
    // The day field usually contains the saint name/feast e.g. "St Patrick" or "4th Sunday of Lent"
    if (!dayText) return null;
    return {
      name: dayText,
      feast_day: new Date(date).toLocaleDateString("en-US", { month: "long", day: "numeric" }),
      source: "universalis",
      short_bio: data.subtitle ? formatLiturgicalText(data.subtitle) : null,
      season: stripHTML(data.season || ""),
    };
  } catch {
    return null;
  }
}

// ─── Source 2: Vatican News Saint of the Day ──────────────────────────────
async function fetchFromVaticanNews(date: string) {
  try {
    const d = new Date(date);
    const month = d.toLocaleDateString("en-US", { month: "long" }).toLowerCase();
    const day = d.getDate();
    const url = `https://www.vaticannews.va/en/saints/${month}-${day}.html`;
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return null;
    const html = await res.text();
    // Extract title/name from og:title
    const titleMatch = html.match(/<meta property="og:title" content="([^"]+)"/);
    const descMatch = html.match(/<meta property="og:description" content="([^"]+)"/);
    if (!titleMatch) return null;
    return {
      name: titleMatch[1].replace(/^Saint of the Day:?\s*/i, "").trim(),
      short_bio: descMatch ? descMatch[1] : "",
      source: "vaticannews",
      feast_day: new Date(date).toLocaleDateString("en-US", { month: "long", day: "numeric" }),
      external_url: url,
    };
  } catch {
    return null;
  }
}

// ─── Source 3: Catholic.org Saints API ────────────────────────────────────
async function fetchFromCatholicOrg(date: string) {
  try {
    const d = new Date(date);
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const url = `https://www.catholic.org/saints/f_day/lstsaint.php?f_month=${month}&f_day=${day}`;
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return null;
    const html = await res.text();
    const nameMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
    if (!nameMatch) return null;
    return {
      name: nameMatch[1].trim(),
      feast_day: new Date(date).toLocaleDateString("en-US", { month: "long", day: "numeric" }),
      source: "catholic_org",
      external_url: url,
    };
  } catch {
    return null;
  }
}

// ─── Build rich saint story from Magisterium/Gemini ──────────────────────
async function enrichSaintWithAI(saintName: string, date: string): Promise<any> {
  const feastDay = new Date(date).toLocaleDateString("en-US", { month: "long", day: "numeric" });

  // Try Magisterium AI first
  const magKey = process.env.MAGISTERIUM_API_KEY;
  if (magKey) {
    try {
      const prompt = `Tell me everything about ${saintName}, the Catholic saint celebrated on ${feastDay}. Return ONLY valid JSON (no markdown, no explanation):
{"name":"${saintName}","feast_day":"${feastDay}","born":"string","died":"string","title":"e.g. Virgin and Martyr","nationality":"string","patronage":["list"],"short_bio":"2-3 engaging sentences","story":"A rich, detailed, inspiring narrative (minimum 400 words) about this saint's life written to make the reader want to become a saint too. Include vivid details, conversion, miracles, holy death.","miracles":"notable miracles and intercessions","spiritual_lesson":"one key spiritual lesson","prayer":"a short prayer to this saint","quote":"famous quote by or about this saint"}`;
      const res = await fetch("https://api.magisterium.com/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${magKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: "magisterium-ai", messages: [{ role: "user", content: prompt }] }),
        signal: AbortSignal.timeout(10000),
      });
      if (res.ok) {
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content?.replace(/```json|```/g, "").trim();
        if (text) return JSON.parse(text);
      }
    } catch { }
  }

  // Try Gemini as fallback for saint enrichment
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    try {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Tell me about ${saintName}, the Catholic saint celebrated on ${feastDay}. Return ONLY valid JSON (no markdown):
{"name":"${saintName}","feast_day":"${feastDay}","born":"string","died":"string","title":"string","nationality":"string","patronage":["list"],"short_bio":"2-3 engaging sentences","story":"Rich inspiring narrative 400+ words","miracles":"string","spiritual_lesson":"string","prayer":"string","quote":"string"}`;
      const result = await model.generateContent(prompt);
      const text = result.response.text().replace(/```json|```/g, "").trim();
      return JSON.parse(text);
    } catch { }
  }

  return null;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date") || new Date().toISOString().split("T")[0];

  // Step 1: Get saint name from liturgical sources
  const base =
    (await fetchSaintFromUniversalis(date)) ||
    (await fetchFromVaticanNews(date)) ||
    (await fetchFromCatholicOrg(date));

  // Step 2: Enrich with AI if we have a name
  if (base?.name) {
    const rich = await enrichSaintWithAI(base.name, date);
    if (rich) return NextResponse.json({ ...(base as any), ...rich, source_chain: [(base as any).source, rich.source || "ai"] });
    return NextResponse.json({ ...(base as any), story: (base as any).short_bio || "Story not available. Visit universalis.com for saint details.", error_partial: true });
  }

  // Step 3: Full AI fallback (no liturgical source worked)
  const feastDay = new Date(date).toLocaleDateString("en-US", { month: "long", day: "numeric" });
  const fullAI = await enrichSaintWithAI(`the saints celebrated on ${feastDay}`, date);
  if (fullAI) return NextResponse.json({ ...fullAI, source: "ai_full" });

  return NextResponse.json({
    name: "Saints of the Day",
    feast_day: feastDay,
    story: "Saint information could not be loaded at this time. Please visit universalis.com or vaticannews.va for today's saint.",
    error: true,
    external_links: {
      universalis: `https://universalis.com/${date.replace(/-/g, "")}/mass.htm`,
      vaticannews: "https://www.vaticannews.va/en/saints.html",
    },
  });
}
