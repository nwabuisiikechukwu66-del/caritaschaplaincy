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
          <p className="font-garamond text-white/70 text-xl italic">2024/2025 Academic Year Executive Council</p>
        </div>
      </section>
      <section className="py-16 bg-caritas-cream">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            {executives.map((exec: any) => (
              <div key={exec.id} className="holy-card bg-white rounded-xl p-6 text-center shadow-sm">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-caritas-red to-caritas-maroon flex items-center justify-center mx-auto mb-4">
                  {exec.photo_url ? <img src={exec.photo_url} alt={exec.name} className="w-full h-full object-cover rounded-full" /> : <span className="font-cinzel text-white text-2xl font-bold">{exec.name.charAt(0)}</span>}
                </div>
                <h3 className="font-cinzel text-caritas-dark font-bold text-sm">{exec.name}</h3>
                <p className="font-garamond text-caritas-red italic text-sm mt-1">{exec.position}</p>
                {exec.bio && <p className="font-garamond text-gray-500 text-xs mt-3 leading-relaxed border-t border-caritas-gold/10 pt-3">{exec.bio}</p>}
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
