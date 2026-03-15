"use client";
import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

export default function SaintsPage() {
  const [date, setDate] = useState("");
  const [saint, setSaint] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    if (!date) setDate(today);

    setLoading(true);
    fetch(`/api/saints?date=${date || today}`)
      .then(r => r.json())
      .then(d => { setSaint(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [date]);

  const changeDate = (days: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    setDate(d.toISOString().split("T")[0]);
  };

  const formatted = new Date(date).toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="pt-20">
      <section className="red-section sacred-bg py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-px bg-caritas-gold/60" />
            <span className="font-cinzel text-caritas-gold text-xs tracking-widest">Cloud of Witnesses</span>
            <div className="w-12 h-px bg-caritas-gold/60" />
          </div>
          <h1 className="font-cinzel text-white text-5xl font-bold mb-4">Saint of the Day</h1>
          <p className="font-garamond text-white/70 text-xl italic">
            "The saints are like the stars. In His great mercy, He has scattered them in our path." — St. John of the Cross
          </p>
        </div>
      </section>

      <section className="py-12 bg-caritas-cream">
        <div className="max-w-3xl mx-auto px-4">
          {/* Date navigation */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <button onClick={() => changeDate(-1)}
              className="w-10 h-10 rounded-full border border-caritas-red/30 flex items-center justify-center hover:bg-caritas-red hover:text-white transition-colors text-caritas-dark">
              <ChevronLeft size={18} />
            </button>
            <div className="text-center">
              <p className="font-cinzel text-caritas-dark font-bold text-lg">{formatted}</p>
            </div>
            <button onClick={() => changeDate(1)}
              className="w-10 h-10 rounded-full border border-caritas-red/30 flex items-center justify-center hover:bg-caritas-red hover:text-white transition-colors text-caritas-dark">
              <ChevronRight size={18} />
            </button>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full border-4 border-caritas-gold/20 border-t-caritas-gold animate-spin mx-auto mb-6" />
              <p className="font-garamond text-gray-500 italic text-lg">Discovering today's saint...</p>
            </div>
          ) : saint ? (
            <div className="space-y-6">
              {/* Header card */}
              <div className="bg-gradient-to-br from-caritas-dark to-caritas-maroon rounded-xl p-10 text-white text-center sacred-bg">
                <div className="w-28 h-28 rounded-full bg-caritas-gold/20 border-2 border-caritas-gold/50 flex items-center justify-center mx-auto mb-6">
                  <Star size={44} className="text-caritas-gold" />
                </div>
                <p className="font-cinzel text-caritas-gold text-xs tracking-widest mb-3">{saint.feast_day}</p>
                <h2 className="font-cinzel text-white text-4xl font-bold mb-3">{saint.name}</h2>
                {saint.title && <p className="font-garamond text-caritas-gold/80 text-xl italic mb-4">{saint.title}</p>}
                <div className="flex flex-wrap justify-center gap-4 text-sm font-garamond text-white/60">
                  {saint.born && <span>Born: {saint.born}</span>}
                  {saint.died && <span>• Died: {saint.died}</span>}
                  {saint.nationality && <span>• {saint.nationality}</span>}
                </div>
              </div>

              {/* Quote */}
              {saint.quote && (
                <div className="border-l-4 border-caritas-gold bg-caritas-cream rounded-r-lg p-6">
                  <p className="font-playfair text-caritas-dark text-xl italic leading-relaxed">"{saint.quote}"</p>
                </div>
              )}

              {/* Short bio */}
              {saint.short_bio && (
                <div className="bg-white rounded-xl p-8 shadow-sm">
                  <h3 className="font-cinzel text-caritas-dark text-xl font-bold mb-4">In Brief</h3>
                  <div className="font-garamond text-gray-700 text-lg leading-relaxed prose prose-stone" dangerouslySetInnerHTML={{ __html: saint.short_bio }} />
                </div>
              )}

              {/* Full story */}
              {saint.story && (
                <div className="bg-white rounded-xl p-8 shadow-sm">
                  <h3 className="font-cinzel text-caritas-dark text-xl font-bold mb-6 flex items-center gap-2">
                    <Star size={18} className="text-caritas-gold" /> The Life of {saint.name}
                  </h3>
                  <div className="font-garamond text-gray-700 text-lg leading-relaxed prose prose-stone" dangerouslySetInnerHTML={{ __html: saint.story }} />
                </div>
              )}

              {/* Miracles */}
              {saint.miracles && (
                <div className="bg-caritas-cream rounded-xl p-8">
                  <h3 className="font-cinzel text-caritas-dark text-xl font-bold mb-4">Miracles & Intercessions</h3>
                  <div className="font-garamond text-gray-700 text-lg leading-relaxed prose prose-stone" dangerouslySetInnerHTML={{ __html: saint.miracles }} />
                </div>
              )}

              {/* Spiritual lesson */}
              {saint.spiritual_lesson && (
                <div className="bg-caritas-dark rounded-xl p-8 sacred-bg">
                  <h3 className="font-cinzel text-caritas-gold text-sm tracking-widest mb-4">SPIRITUAL LESSON</h3>
                  <div className="font-playfair text-white text-xl italic leading-relaxed prose prose-invert" dangerouslySetInnerHTML={{ __html: saint.spiritual_lesson }} />
                </div>
              )}

              {/* Patronage */}
              {saint.patronage?.length > 0 && (
                <div className="bg-white rounded-xl p-8 shadow-sm">
                  <h3 className="font-cinzel text-caritas-dark font-bold mb-4">Patronage</h3>
                  <div className="flex flex-wrap gap-2">
                    {saint.patronage.map((p: string) => (
                      <span key={p} className="bg-caritas-cream border border-caritas-gold/30 text-caritas-dark font-garamond text-sm px-3 py-1 rounded-full">{p}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Prayer */}
              {saint.prayer && (
                <div className="border border-caritas-gold/40 rounded-xl p-8 text-center">
                  <p className="font-cinzel text-caritas-gold text-xs tracking-widest mb-4">PRAYER TO {saint.name.toUpperCase()}</p>
                  <div className="font-playfair text-caritas-dark text-lg italic leading-relaxed prose prose-stone" dangerouslySetInnerHTML={{ __html: saint.prayer }} />
                  <p className="font-cinzel text-caritas-red text-sm mt-4">Amen.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm">
              <Star size={48} className="text-gray-200 mx-auto mb-4" />
              <p className="font-garamond text-gray-400 italic">Could not load saint for this date. Please configure your Gemini API key.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
