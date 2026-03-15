import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default async function CouncilArchivePage() {
  const { data } = await supabase.from("council_executives").select("*").eq("is_current", false).order("academic_year", { ascending: false });
  const past = data || [];
  const years = Array.from(new Set(past.map((e: any) => e.academic_year as string)));

  return (
    <div className="pt-20">
      <section className="red-section sacred-bg py-16 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <Link href="/council" className="font-cinzel text-caritas-gold/70 text-xs tracking-widest hover:text-caritas-gold mb-4 inline-block">← BACK TO COUNCIL</Link>
          <h1 className="font-cinzel text-white text-4xl font-bold">Past Council Executives</h1>
        </div>
      </section>
      <section className="py-12 bg-caritas-cream">
        <div className="max-w-4xl mx-auto px-4">
          {years.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm"><p className="font-garamond text-gray-400 italic">No archived executives yet.</p></div>
          ) : years.map(year => (
            <div key={year} className="mb-10">
              <h2 className="font-cinzel text-caritas-dark text-xl font-bold mb-4 flex items-center gap-3">
                <span className="bg-caritas-red text-white px-3 py-1 rounded-sm text-sm">{year}</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {past.filter((e: any) => e.academic_year === year).map((exec: any) => (
                  <div key={exec.id} className="bg-white rounded-xl p-4 text-center shadow-sm">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-caritas-red/50 to-caritas-maroon/50 flex items-center justify-center mx-auto mb-3">
                      {exec.photo_url ? <img src={exec.photo_url} alt={exec.name} className="w-full h-full rounded-full object-cover" /> : <span className="font-cinzel text-white font-bold">{exec.name.charAt(0)}</span>}
                    </div>
                    <h3 className="font-cinzel text-caritas-dark text-xs font-bold">{exec.name}</h3>
                    <p className="font-garamond text-gray-500 text-xs italic mt-0.5">{exec.position}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
