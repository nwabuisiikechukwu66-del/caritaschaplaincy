import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default async function OfficialsArchivePage() {
  const [{ data: sData }, { data: cData }] = await Promise.all([
    supabase.from("sacristans").select("*").eq("is_current", false).order("academic_year", { ascending: false }),
    supabase.from("catechists").select("*").eq("is_current", false).order("academic_year", { ascending: false }),
  ]);
  const sacristans = sData || []; const catechists = cData || [];

  return (
    <div className="pt-20">
      <section className="red-section sacred-bg py-16 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <Link href="/officials" className="font-cinzel text-caritas-gold/70 text-xs tracking-widest hover:text-caritas-gold mb-4 inline-block">← BACK TO OFFICIALS</Link>
          <h1 className="font-cinzel text-white text-4xl font-bold">Officials Archive</h1>
        </div>
      </section>
      <section className="py-12 bg-caritas-cream">
        <div className="max-w-4xl mx-auto px-4">
          {sacristans.length > 0 && (
            <div className="mb-10">
              <h2 className="font-cinzel text-caritas-dark text-xl font-bold mb-4">Past Sacristans</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {sacristans.map((s: any) => (
                  <div key={s.id} className="bg-white rounded-xl p-4 text-center shadow-sm">
                    <div className="w-14 h-14 rounded-full bg-caritas-red/20 flex items-center justify-center mx-auto mb-2"><span className="font-cinzel text-caritas-red font-bold">{s.name.charAt(0)}</span></div>
                    <p className="font-cinzel text-caritas-dark text-xs font-bold">{s.name}</p>
                    <p className="font-garamond text-gray-500 text-xs">{s.role} · {s.academic_year}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {catechists.length > 0 && (
            <div>
              <h2 className="font-cinzel text-caritas-dark text-xl font-bold mb-4">Past Catechists</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {catechists.map((c: any) => (
                  <div key={c.id} className="bg-white rounded-xl p-4 text-center shadow-sm">
                    <div className="w-14 h-14 rounded-full bg-caritas-maroon/20 flex items-center justify-center mx-auto mb-2"><span className="font-cinzel text-caritas-maroon font-bold">{c.name.charAt(0)}</span></div>
                    <p className="font-cinzel text-caritas-dark text-xs font-bold">{c.name}</p>
                    <p className="font-garamond text-gray-500 text-xs">{c.role} · {c.academic_year}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {sacristans.length === 0 && catechists.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm"><p className="font-garamond text-gray-400 italic">No archived officials yet.</p></div>
          )}
        </div>
      </section>
    </div>
  );
}
