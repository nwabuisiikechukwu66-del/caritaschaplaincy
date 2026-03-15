import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Archive } from "lucide-react";

async function getData() {
  const { data } = await supabase.from("council_executives").select("*").eq("is_current", true).order("id");
  return data || [];
}

export default async function CouncilPage() {
  const executives = await getData().catch(() => []);
  return (
    <div className="pt-20">
      <section className="red-section sacred-bg py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-3 mb-4"><div className="w-12 h-px bg-caritas-gold/60" /><span className="font-cinzel text-caritas-gold text-xs tracking-widest">Servant Leaders</span><div className="w-12 h-px bg-caritas-gold/60" /></div>
          <h1 className="font-cinzel text-white text-5xl font-bold mb-4">Church Council</h1>
          <p className="font-garamond text-white/70 text-xl italic">Executive Council Administration</p>
        </div>
      </section>
      <section className="py-16 bg-caritas-cream">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
            {executives.map((exec: any) => (
              <div key={exec.id} className="holy-card bg-white rounded-sm p-8 text-center shadow-sm border border-caritas-gold/10 group flex flex-col h-full">
                <div className="w-24 h-24 rounded-full bg-caritas-cream border-2 border-caritas-gold/20 flex items-center justify-center mx-auto mb-6 overflow-hidden">
                  {exec.photo_url ? <img src={exec.photo_url} alt={exec.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" /> : <span className="font-cinzel text-caritas-gold text-3xl font-bold">{exec.name.charAt(0)}</span>}
                </div>
                <h3 className="font-cinzel text-caritas-dark font-bold text-sm tracking-tight group-hover:text-caritas-red transition-colors">{exec.name}</h3>
                <p className="font-garamond text-caritas-red italic text-base font-semibold mt-1">{exec.position}</p>
                <p className="text-[10px] font-cinzel text-gray-400 mt-1 uppercase tracking-widest">{exec.academic_year}</p>
                {exec.bio && <p className="font-garamond text-gray-500 text-sm mt-4 leading-relaxed border-t border-caritas-gold/10 pt-4 flex-1 italic">"{exec.bio}"</p>}
                {exec.contact && <p className="font-cinzel text-[10px] text-caritas-gold font-bold tracking-widest mt-4 pt-4 border-t border-caritas-gold/5">{exec.contact}</p>}
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link href="/archives/council" className="inline-flex items-center gap-2 font-cinzel text-xs text-caritas-dark border border-caritas-dark/30 px-6 py-3 rounded-sm hover:border-caritas-gold hover:text-caritas-gold transition-colors tracking-widest">
              <Archive size={14} /> VIEW PAST EXECUTIVES ARCHIVE
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
