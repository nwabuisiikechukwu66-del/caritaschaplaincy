"use client";
import Link from "next/link";
import { ChevronRight, Sparkles, Cross } from "lucide-react";

interface Society { id: string; name: string; type: string; short_description: string; color_code?: string; }

export default function SocietiesPreview({ societies }: { societies: Society[] }) {
  return (
    <section className="py-24 red-section sacred-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-px bg-caritas-gold/60" />
            <span className="font-cinzel text-caritas-gold text-xs tracking-widest uppercase">Community & Fellowship</span>
            <div className="w-12 h-px bg-caritas-gold/60" />
          </div>
          <h2 className="font-cinzel text-white text-4xl font-bold">Associations & Societies</h2>
          <p className="font-garamond text-white/50 text-lg mt-4 italic max-w-2xl mx-auto">
            17 vibrant communities of faith, prayer, service and devotion awaiting you
          </p>
        </div>

        {/* Associations */}
        <div className="mb-20">
          <h3 className="font-cinzel text-caritas-gold text-[10px] tracking-[0.4em] uppercase mb-10 flex items-center gap-6">
            <div className="flex-1 h-px bg-caritas-gold/20" />
            Vibrant Associations
            <div className="flex-1 h-px bg-caritas-gold/20" />
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {societies.filter(s => s.type === "association").map((soc) => (
              <Link key={soc.id} href={`/societies/${soc.id}`}
                className="bg-white/5 border border-white/10 p-6 text-center hover:bg-white/10 hover:border-caritas-gold/40 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-8 h-8 opacity-10 group-hover:opacity-30 transition-opacity">
                  <div className="w-full h-full rotate-45 border-t border-r border-caritas-gold" />
                </div>
                <div className="w-10 h-10 rounded-full border border-caritas-gold/30 flex items-center justify-center mx-auto mb-4 text-caritas-gold group-hover:bg-caritas-gold group-hover:text-caritas-dark transition-all">
                  <Sparkles size={16} strokeWidth={1.5} />
                </div>
                <p className="font-cinzel text-white text-[11px] font-bold tracking-widest uppercase leading-snug">{soc.name}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Societies */}
        <div>
          <h3 className="font-cinzel text-caritas-gold text-[10px] tracking-[0.4em] uppercase mb-10 flex items-center gap-6">
            <div className="flex-1 h-px bg-caritas-gold/20" />
            Pious Societies
            <div className="flex-1 h-px bg-caritas-gold/20" />
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {societies.filter(s => s.type === "society").map((soc) => (
              <Link key={soc.id} href={`/societies/${soc.id}`}
                className="bg-white/5 border border-white/10 p-8 hover:bg-white/10 hover:border-caritas-gold/40 transition-all group flex gap-6 items-start">
                <div className="w-12 h-12 flex-shrink-0 bg-caritas-gold/5 border border-caritas-gold/20 flex items-center justify-center text-caritas-gold group-hover:bg-caritas-gold group-hover:text-caritas-dark transition-all">
                  <Cross size={24} strokeWidth={1} />
                </div>
                <div>
                  <p className="font-cinzel text-white text-xs font-bold mb-3 tracking-widest uppercase">{soc.name}</p>
                  <p className="font-garamond text-white/50 text-base leading-relaxed line-clamp-2 italic">{soc.short_description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <Link href="/societies"
            className="inline-flex items-center gap-3 font-cinzel text-sm text-white border border-caritas-gold/50 px-8 py-4 rounded-sm hover:bg-caritas-gold hover:text-caritas-dark hover:border-caritas-gold transition-all duration-300 group">
            EXPLORE ALL SOCIETIES
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
