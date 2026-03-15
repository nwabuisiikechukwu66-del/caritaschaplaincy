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
    if (!data || !data.Mass) return null;

    const mass = data.Mass;
    const getReading = (type: string) => mass.find((r: any) => r.readingtype === type);
    const cleanText = (html: string = "") =>
      html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

    return {
      date,
      source: "universalis",
      liturgical_day: data.name || "",
      season: data.season || "",
      color: data.color || "green",
      first_reading: getReading("1")
        ? { reference: getReading("1").source, text: cleanText(getReading("1").text).slice(0, 700) }
        : null,
      responsorial_psalm: getReading("ps")
        ? { reference: getReading("ps").source, response: cleanText(getReading("ps").text).slice(0, 300) }
        : null,
      second_reading: getReading("2")
        ? { reference: getReading("2").source, text: cleanText(getReading("2").text).slice(0, 600) }
        : null,
      gospel_acclamation: cleanText(getReading("ga")?.text || ""),
      gospel: getReading("G")
        ? { reference: getReading("G").source, text: cleanText(getReading("G").text).slice(0, 800) }
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
