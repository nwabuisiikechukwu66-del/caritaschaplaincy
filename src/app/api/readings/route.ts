import { NextRequest, NextResponse } from "next/server";

// ─── Source 1: Universalis (best — full liturgical calendar) ───────────────
async function fetchFromUniversalis(date: string) {
  try {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const url = `https://universalis.com/${year}${month}${day}/jsonpmass.js`;
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return null;
    let text = await res.text();
    // Strip JSONP wrapper
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
        .replace(/&#39;/g, "'");
    };

    const formatLiturgicalText = (html: string = "") => {
      let clean = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      return decodeHTMLEntities(clean);
    };

    return {
      date,
      source: "universalis",
      liturgical_day: formatLiturgicalText(data.day || ""),
      season: data.season || "",
      color: data.color || "green",
      first_reading: data.Mass_R1
        ? { reference: data.Mass_R1.source, text: formatLiturgicalText(data.Mass_R1.text) }
        : null,
      responsorial_psalm: data.Mass_Ps
        ? { reference: data.Mass_Ps.source, response: formatLiturgicalText(data.Mass_Ps.text) }
        : null,
      second_reading: data.Mass_R2
        ? { reference: data.Mass_R2.source, text: formatLiturgicalText(data.Mass_R2.text) }
        : null,
      gospel_acclamation: formatLiturgicalText(data.Mass_GA?.text || ""),
      gospel: data.Mass_G
        ? { reference: data.Mass_G.source, text: formatLiturgicalText(data.Mass_G.text) }
        : null,
    };
  } catch (e) {
    console.error("Universalis error:", e);
    return null;
  }
}

// ─── Source 2: Catholic Lectionary API ────────────────────────────────────
async function fetchFromCatholicAPI(date: string) {
  try {
    const res = await fetch(
      `https://api.catholic.io/lectionary?date=${date}`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || data.error) return null;
    return { date, source: "catholic_api", ...data };
  } catch {
    return null;
  }
}

// ─── Source 3: Magisterium / USCCB fallback (simple fetch) ────────────────
async function fetchFromUSCCB(date: string) {
  try {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const year = d.getFullYear();
    const url = `https://bible.usccb.org/readings/${month}${day}${String(year).slice(2)}.cfm`;
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return null;
    // Just confirm the page exists — we can't parse it easily
    return null;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date") || new Date().toISOString().split("T")[0];

  // Try sources in order
  let readings =
    (await fetchFromUniversalis(date)) ||
    (await fetchFromCatholicAPI(date));

  if (!readings) {
    return NextResponse.json({
      date,
      error: true,
      liturgical_day: "Today's Readings",
      message:
        "Could not load readings automatically. Visit universalis.com or bible.usccb.org for today's readings.",
      external_links: {
        universalis: `https://universalis.com/${date.replace(/-/g, "")}/mass.htm`,
        usccb: "https://bible.usccb.org/daily-bible-reading",
        vaticannews: "https://www.vaticannews.va/en/word-of-the-day.html",
      },
    });
  }

  return NextResponse.json(readings);
}
