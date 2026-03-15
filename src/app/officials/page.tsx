import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Archive } from "lucide-react";

export default async function OfficialsPage() {
  let sacristans: any[] = [], catechists: any[] = [];
  try {
    const [s, c] = await Promise.all([
      supabase.from("sacristans").select("*").eq("is_current", true).then(r => r.data || []),
      supabase.from("catechists").select("*").eq("is_current", true).then(r => r.data || []),
    ]);
    sacristans = s; catechists = c;
  } catch { }

  const defaultSac = [{ name: "Frank Kelechi Oge", role: "Chief Sacristan" }, { name: "Ikechukwu Emmanuel Nwabuisi", role: "Assistant Sacristan" }];
  const defaultCat = [{ name: "John Ugwoke", role: "Chief Catechist" }, { name: "Kelvin Umeh", role: "Assistant Catechist" }, { name: "Gilbert Ekpangabang", role: "Assistant Catechist" }];
  const sacList = sacristans.length > 0 ? sacristans : defaultSac;
  const catList = catechists.length > 0 ? catechists : defaultCat;

  return (
    <div className="pt-20">
      <section className="red-section sacred-bg py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-3 mb-4"><div className="w-12 h-px bg-caritas-gold/60" /><span className="font-cinzel text-caritas-gold text-xs tracking-widest">Ministers of the Altar</span><div className="w-12 h-px bg-caritas-gold/60" /></div>
          <h1 className="font-cinzel text-white text-5xl font-bold mb-4">Sacristans & Catechists</h1>
        </div>
      </section>
      <section className="py-16 bg-caritas-cream">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            <div>
              <h2 className="font-cinzel text-caritas-dark text-2xl font-bold mb-6">Sacristans</h2>
              <div className="space-y-4">
                {sacList.map((s: any) => (
                  <div key={s.name} className="holy-card bg-white rounded-xl p-6 flex items-center gap-4 shadow-sm">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-caritas-red to-caritas-maroon flex items-center justify-center flex-shrink-0">
                      {s.photo_url ? <img src={s.photo_url} alt={s.name} className="w-full h-full rounded-full object-cover" /> : <span className="font-cinzel text-white font-bold text-xl">{s.name.charAt(0)}</span>}
                    </div>
                    <div>
                      <h3 className="font-cinzel text-caritas-dark font-bold">{s.name}</h3>
                      <p className="font-garamond text-caritas-red italic text-sm">{s.role}</p>
                      {s.bio && <p className="font-garamond text-gray-500 text-xs mt-3 border-t border-caritas-gold/10 pt-2 leading-relaxed italic">"{s.bio}"</p>}
                      {s.contact && <p className="font-cinzel text-[9px] text-caritas-gold tracking-widest mt-2">{s.contact}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="font-cinzel text-caritas-dark text-2xl font-bold mb-6">Catechists</h2>
              <div className="space-y-4">
                {catList.map((c: any) => (
                  <div key={c.name} className="holy-card bg-white rounded-xl p-6 flex items-center gap-4 shadow-sm">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-caritas-maroon to-caritas-dark flex items-center justify-center flex-shrink-0">
                      {c.photo_url ? <img src={c.photo_url} alt={c.name} className="w-full h-full rounded-full object-cover" /> : <span className="font-cinzel text-white font-bold text-xl">{c.name.charAt(0)}</span>}
                    </div>
                    <div>
                      <h3 className="font-cinzel text-caritas-dark font-bold">{c.name}</h3>
                      <p className="font-garamond text-caritas-red italic text-sm">{c.role}</p>
                      {c.bio && <p className="font-garamond text-gray-500 text-xs mt-3 border-t border-caritas-gold/10 pt-2 leading-relaxed italic">"{c.bio}"</p>}
                      {c.contact && <p className="font-cinzel text-[9px] text-caritas-gold tracking-widest mt-2">{c.contact}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="text-center">
            <Link href="/archives/officials" className="inline-flex items-center gap-2 font-cinzel text-xs text-caritas-dark border border-caritas-dark/30 px-6 py-3 rounded-sm hover:border-caritas-gold hover:text-caritas-gold transition-colors tracking-widest">
              <Archive size={14} /> VIEW OFFICIALS ARCHIVE
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
