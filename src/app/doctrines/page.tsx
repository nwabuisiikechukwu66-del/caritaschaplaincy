"use client";
import { useState, useMemo } from "react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import doctrines from "@/data/doctrines.json";

const categories = Array.from(new Set((doctrines as any[]).map(d => d.category as string)));

export default function DoctrinesPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [openId, setOpenId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return (doctrines as any[]).filter(d => {
      const matchesQ = !q || d.question.toLowerCase().includes(q) || d.answer.toLowerCase().includes(q) || d.tags?.some((t: string) => t.toLowerCase().includes(q));
      const matchesCat = activeCategory === "All" || d.category === activeCategory;
      return matchesQ && matchesCat;
    });
  }, [query, activeCategory]);

  return (
    <div className="pt-20">
      <section className="red-section sacred-bg py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-px bg-caritas-gold/60" />
            <span className="font-cinzel text-caritas-gold text-xs tracking-widest">The Faith Once Delivered to the Saints</span>
            <div className="w-12 h-px bg-caritas-gold/60" />
          </div>
          <h1 className="font-cinzel text-white text-5xl font-bold mb-4">Catholic Doctrines</h1>
          <p className="font-garamond text-white/70 text-xl italic">
            Explore the rich treasury of Catholic teaching — scripture, tradition, saints, and the Magisterium
          </p>
        </div>
      </section>

      <section className="py-12 bg-caritas-cream">
        <div className="max-w-4xl mx-auto px-4">
          {/* Search */}
          <div className="relative mb-8">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-lg font-garamond text-lg focus:outline-none focus:border-caritas-red bg-white shadow-sm"
              placeholder="Search doctrines, saints, sacraments, history..."
              autoFocus
            />
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {["All", ...categories].map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`font-cinzel text-xs px-4 py-2 rounded-sm tracking-wider transition-colors ${activeCategory === cat
                    ? "bg-caritas-red text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-caritas-red hover:text-caritas-red"
                  }`}>
                {cat}
              </button>
            ))}
          </div>

          {/* Results count */}
          <p className="font-garamond text-gray-500 text-sm mb-6">
            {filtered.length} {filtered.length === 1 ? "result" : "results"} found
          </p>

          {/* Q&A accordion */}
          <div className="space-y-3">
            {filtered.map((d: any, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <button
                  onClick={() => setOpenId(openId === i ? null : i)}
                  className="w-full text-left px-6 py-5 flex items-start justify-between gap-4 hover:bg-caritas-cream transition-colors">
                  <div className="flex items-start gap-3">
                    <span className="font-cinzel text-caritas-gold text-xs mt-1 flex-shrink-0">Q.</span>
                    <p className="font-garamond text-caritas-dark text-lg font-medium leading-snug">{d.question}</p>
                  </div>
                  <span className="text-caritas-red flex-shrink-0 mt-1">
                    {openId === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </span>
                </button>

                {openId === i && (
                  <div className="px-6 pb-6 border-t border-gray-50">
                    <div className="flex items-start gap-3 mt-4">
                      <span className="font-cinzel text-caritas-red text-xs mt-1 flex-shrink-0">A.</span>
                      <div>
                        <p className="font-garamond text-gray-700 text-lg leading-relaxed">{d.answer}</p>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {d.source && (
                            <span className="font-cinzel text-xs text-caritas-gold bg-caritas-cream px-3 py-1 rounded-sm">{d.source}</span>
                          )}
                          <span className="font-cinzel text-xs text-caritas-red bg-caritas-rose px-3 py-1 rounded-sm">{d.category}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="text-center py-16 bg-white rounded-lg">
                <Search size={40} className="text-gray-200 mx-auto mb-4" />
                <p className="font-garamond text-gray-400 italic text-lg">No results found for &quot;{query}&quot;</p>
                <p className="font-garamond text-gray-300 text-sm mt-2">Try different keywords or browse by category</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
