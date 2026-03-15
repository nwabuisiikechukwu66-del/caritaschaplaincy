import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Archive, Users, ArrowLeft } from "lucide-react";

export default async function SocietyDetailPage({ params }: { params: { id: string } }) {
  let society: any = null;
  let leaders: any[] = [];

  try {
    // Try UUID first
    let result = await supabase.from("societies").select("*").eq("id", params.id).single();

    // If not found, try slugified name
    if (!result.data) {
      const allSoc = await supabase.from("societies").select("*");
      result.data = allSoc.data?.find((s: any) => s.id === params.id || s.name.toLowerCase().replace(/\s+/g, '-') === params.id) || null;
    }

    society = result.data;
    if (society) {
      const { data: l } = await supabase.from("society_leaders").select("*").eq("society_id", society.id).eq("is_current", true);
      leaders = l || [];
    }
  } catch { }

  if (!society) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-caritas-cream">
        <div className="text-center">
          <p className="font-cinzel text-caritas-dark text-2xl font-bold mb-4">Society Not Found</p>
          <Link href="/societies" className="font-cinzel text-xs text-caritas-red tracking-widest hover:underline">← Back to Societies</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <section className="red-section sacred-bg py-20">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/societies" className="inline-flex items-center gap-2 font-cinzel text-xs text-caritas-gold/70 hover:text-caritas-gold mb-8 tracking-widest">
            <ArrowLeft size={14} /> BACK TO ALL SOCIETIES
          </Link>
          <div className="inline-block bg-caritas-gold/20 px-3 py-1 rounded-sm mb-4">
            <span className="font-cinzel text-caritas-gold text-xs tracking-widest">{society.type === "society" ? "PIOUS SOCIETY" : "ASSOCIATION"}</span>
          </div>
          <h1 className="font-cinzel text-white text-4xl md:text-5xl font-bold mb-4">{society.name}</h1>
          <div className="flex flex-wrap items-center gap-6 mt-6">
            {society.short_description && (
              <p className="font-garamond text-white/70 text-xl italic max-w-2xl">{society.short_description}</p>
            )}
            {society.patron_saint && (
              <div className="border-l border-caritas-gold/40 pl-6">
                <p className="font-cinzel text-caritas-gold text-[10px] tracking-widest uppercase mb-1">Patron Saint</p>
                <p className="font-cinzel text-white text-sm font-bold tracking-wider">{society.patron_saint}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 bg-caritas-cream">
        <div className="max-w-4xl mx-auto px-4 space-y-10">
          {society.about && (
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="font-cinzel text-caritas-dark text-2xl font-bold mb-4">About</h2>
              <p className="font-garamond text-gray-700 text-lg leading-relaxed">{society.about}</p>
            </div>
          )}
          {society.history && (
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="font-cinzel text-caritas-dark text-2xl font-bold mb-4">History</h2>
              <p className="font-garamond text-gray-700 text-lg leading-relaxed">{society.history}</p>
            </div>
          )}
          {society.why_join && (
            <div className="bg-caritas-dark rounded-xl p-8 sacred-bg">
              <h2 className="font-cinzel text-caritas-gold text-2xl font-bold mb-4">Why Join?</h2>
              <p className="font-garamond text-white/80 text-lg leading-relaxed">{society.why_join}</p>
            </div>
          )}
          {society.fun_facts && (
            <div className="bg-caritas-cream border border-caritas-gold/20 rounded-xl p-8">
              <h2 className="font-cinzel text-caritas-dark text-2xl font-bold mb-4">Fun Facts</h2>
              <p className="font-garamond text-gray-700 text-lg leading-relaxed">{society.fun_facts}</p>
            </div>
          )}

          {leaders.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Users size={20} className="text-caritas-red" />
                <h2 className="font-cinzel text-caritas-dark text-2xl font-bold">Current Leaders</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {leaders.map((l: any) => (
                  <div key={l.id} className="holy-card bg-white rounded-xl p-5 text-center shadow-sm">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-caritas-red to-caritas-maroon flex items-center justify-center mx-auto mb-3">
                      {l.photo_url ? <img src={l.photo_url} alt={l.name} className="w-full h-full object-cover rounded-full" /> : <span className="font-cinzel text-white font-bold">{l.name.charAt(0)}</span>}
                    </div>
                    <h3 className="font-cinzel text-caritas-dark text-xs font-bold">{l.name}</h3>
                    <p className="font-garamond text-caritas-red text-xs italic mt-1">{l.role}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-center">
            <Link href={`/archives/societies/${params.id}`}
              className="inline-flex items-center gap-2 font-cinzel text-xs text-caritas-dark border border-caritas-dark/30 px-6 py-3 rounded-sm hover:border-caritas-gold hover:text-caritas-gold transition-colors tracking-widest">
              <Archive size={14} /> PAST LEADERS ARCHIVE
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
