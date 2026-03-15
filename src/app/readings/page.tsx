"use client";
import { useState, useEffect } from "react";
import { BookOpen, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

export default function ReadingsPage() {
  const [date, setDate] = useState("");
  const [readings, setReadings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    if (!date) setDate(today);

    setLoading(true);
    setReadings(null);
    fetch(`/api/readings?date=${date || today}`)
      .then((r) => r.json())
      .then((data) => { setReadings(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [date]);

  const changeDate = (days: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    setDate(d.toISOString().split("T")[0]);
  };

  const isToday = date === new Date().toISOString().split("T")[0];
  const formatted = new Date(date + "T12:00:00").toLocaleDateString("en-NG", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const liturgicalColors: Record<string, string> = {
    green: "border-green-500",
    red: "border-caritas-red",
    white: "border-gray-300",
    purple: "border-purple-500",
    rose: "border-pink-400",
    gold: "border-caritas-gold",
  };

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="red-section sacred-bg py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-px bg-caritas-gold/60" />
            <span className="font-cinzel text-caritas-gold text-xs tracking-widest">Liturgy of the Word</span>
            <div className="w-12 h-px bg-caritas-gold/60" />
          </div>
          <h1 className="font-cinzel text-white text-5xl font-bold mb-4">Daily Readings</h1>
          <p className="font-garamond text-white/70 text-xl italic">
            "Your word is a lamp to my feet and a light to my path." — Psalm 119:105
          </p>
          <p className="font-garamond text-white/40 text-sm mt-4">
            Readings sourced from Universalis · universalis.com
          </p>
        </div>
      </section>

      <section className="py-12 bg-caritas-cream min-h-screen">
        <div className="max-w-3xl mx-auto px-4">
          {/* Date navigation */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <button
              onClick={() => changeDate(-1)}
              className="w-10 h-10 rounded-full border border-caritas-red/30 flex items-center justify-center hover:bg-caritas-red hover:text-white transition-colors text-caritas-dark"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="text-center">
              <p className="font-cinzel text-caritas-dark font-bold text-lg">{formatted}</p>
              {readings?.liturgical_day && (
                <p className="font-garamond text-caritas-red italic text-sm mt-1">{readings.liturgical_day}</p>
              )}
              {isToday && (
                <span className="font-cinzel text-xs text-caritas-gold bg-caritas-gold/10 px-2 py-0.5 rounded-sm tracking-wider">TODAY</span>
              )}
            </div>
            <button
              onClick={() => changeDate(1)}
              className="w-10 h-10 rounded-full border border-caritas-red/30 flex items-center justify-center hover:bg-caritas-red hover:text-white transition-colors text-caritas-dark"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="w-14 h-14 rounded-full border-4 border-caritas-red/20 border-t-caritas-red animate-spin mx-auto mb-6" />
              <p className="font-garamond text-gray-500 italic text-lg">Fetching the Word of God...</p>
            </div>
          ) : readings?.error ? (
            /* Error / fallback state */
            <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
              <BookOpen size={48} className="text-caritas-red/30 mx-auto mb-4" />
              <p className="font-cinzel text-caritas-dark text-xl font-bold mb-2">Readings Unavailable</p>
              <p className="font-garamond text-gray-500 mb-8">
                Could not load readings for this date. Please visit one of these trusted sources:
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {[
                  { label: "Universalis.com", url: readings.external_links?.universalis || "https://universalis.com" },
                  { label: "USCCB Daily Readings", url: "https://bible.usccb.org/daily-bible-reading" },
                  { label: "Vatican News", url: "https://www.vaticannews.va/en/word-of-the-day.html" },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 font-cinzel text-xs text-white bg-caritas-red px-5 py-3 rounded-sm hover:bg-caritas-maroon transition-colors tracking-widest"
                  >
                    {link.label} <ExternalLink size={12} />
                  </a>
                ))}
              </div>
            </div>
          ) : readings ? (
            <div className="space-y-5">
              {/* Season/color badge */}
              {readings.color && (
                <div className={`border-l-4 ${liturgicalColors[readings.color] || "border-caritas-gold"} bg-white rounded-r-xl pl-4 pr-6 py-3 flex items-center gap-3`}>
                  <span className="font-cinzel text-xs text-gray-400 tracking-wider uppercase">Liturgical Season</span>
                  <span className="font-garamond text-caritas-dark font-medium">{readings.season || readings.liturgical_day}</span>
                </div>
              )}

              {/* First Reading */}
              {readings.first_reading && (
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-5 h-5 rounded-full bg-caritas-red flex items-center justify-center text-white font-cinzel text-xs">1</span>
                    <p className="font-cinzel text-caritas-red text-xs tracking-widest">FIRST READING</p>
                  </div>
                  <p className="font-cinzel text-caritas-dark font-bold text-base mb-4">{readings.first_reading.reference}</p>
                  <p className="font-garamond text-gray-700 text-xl leading-relaxed prose prose-stone" dangerouslySetInnerHTML={{ __html: readings.first_reading.text }} />
                  <p className="font-cinzel text-caritas-gold text-xs tracking-wider mt-4">The word of the Lord. — Thanks be to God.</p>
                </div>
              )}

              {/* Responsorial Psalm */}
              {readings.responsorial_psalm && (
                <div className="bg-caritas-cream border border-caritas-gold/20 rounded-2xl p-8">
                  <p className="font-cinzel text-caritas-gold text-xs tracking-widest mb-1">RESPONSORIAL PSALM</p>
                  <p className="font-cinzel text-caritas-dark font-bold mb-4">{readings.responsorial_psalm.reference}</p>
                  <div className="font-playfair text-gray-700 text-xl leading-relaxed italic" dangerouslySetInnerHTML={{ __html: readings.responsorial_psalm.response }} />
                </div>
              )}

              {/* Second Reading */}
              {readings.second_reading && (
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-5 h-5 rounded-full bg-caritas-maroon flex items-center justify-center text-white font-cinzel text-xs">2</span>
                    <p className="font-cinzel text-caritas-maroon text-xs tracking-widest">SECOND READING</p>
                  </div>
                  <p className="font-cinzel text-caritas-dark font-bold text-base mb-4">{readings.second_reading.reference}</p>
                  <p className="font-garamond text-gray-700 text-xl leading-relaxed prose prose-stone" dangerouslySetInnerHTML={{ __html: readings.second_reading.text }} />
                  <p className="font-cinzel text-caritas-gold text-xs tracking-wider mt-4">The word of the Lord. — Thanks be to God.</p>
                </div>
              )}

              {/* Gospel Acclamation */}
              {readings.gospel_acclamation && (
                <div className="text-center py-3">
                  <div className="font-cinzel text-caritas-gold text-sm tracking-widest" dangerouslySetInnerHTML={{ __html: `✦ ${readings.gospel_acclamation} ✦` }} />
                </div>
              )}

              {/* Gospel */}
              {readings.gospel && (
                <div className="bg-caritas-dark rounded-2xl p-8 sacred-bg">
                  <p className="font-cinzel text-caritas-gold text-xs tracking-widest mb-1">HOLY GOSPEL</p>
                  <p className="font-cinzel text-white font-bold text-base mb-6">{readings.gospel.reference}</p>
                  <p className="font-garamond text-white/85 text-xl leading-relaxed prose prose-invert" dangerouslySetInnerHTML={{ __html: readings.gospel.text }} />
                  <p className="font-cinzel text-caritas-gold text-xs tracking-wider mt-6">
                    The Gospel of the Lord. — Praise to you, Lord Jesus Christ.
                  </p>
                </div>
              )}

              {/* Source credit */}
              <div className="text-center pt-2">
                <p className="font-garamond text-gray-400 text-sm italic">
                  Readings sourced from{" "}
                  <a href="https://universalis.com" target="_blank" rel="noreferrer" className="text-caritas-red hover:underline">
                    Universalis.com
                  </a>{" "}
                  · Roman Rite, Ordinary Form
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
