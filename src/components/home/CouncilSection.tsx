"use client";
import Link from "next/link";
import { Archive } from "lucide-react";

const positions = [
  "President","Vice President","General Secretary","Assistant Secretary",
  "Financial Secretary","Treasurer","Provost I","Provost II","PRO"
];
const positionIcons: Record<string, string> = {
  "President": "⚜️", "Vice President": "🏛️", "General Secretary": "📜",
  "Assistant Secretary": "✍️", "Financial Secretary": "💰", "Treasurer": "🏦",
  "Provost I": "🔱", "Provost II": "🔱", "PRO": "📢"
};

interface Executive { id: string; name: string; position: string; photo_url?: string; bio?: string; }

export default function CouncilSection({ executives }: { executives: Executive[] }) {
  const getExec = (pos: string) => executives.find(e => e.position === pos);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-px bg-caritas-gold/40" />
            <span className="font-cinzel text-caritas-gold text-xs tracking-widest uppercase">Leadership</span>
            <div className="w-12 h-px bg-caritas-gold/40" />
          </div>
          <h2 className="font-cinzel text-caritas-dark text-4xl font-bold">Church Council</h2>
          <p className="font-garamond text-gray-500 text-lg mt-4 italic max-w-xl mx-auto">
            Serving the student community with faith, dedication, and apostolic zeal
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {positions.map((pos) => {
            const exec = getExec(pos);
            return (
              <div key={pos} className="holy-card bg-caritas-cream rounded-lg p-6 text-center">
                <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-gradient-to-br from-caritas-red/20 to-caritas-maroon/30 flex items-center justify-center text-2xl border-2 border-caritas-gold/20 overflow-hidden">
                  {exec?.photo_url ? (
                    <img src={exec.photo_url} alt={exec.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{positionIcons[pos] || "✝"}</span>
                  )}
                </div>
                <p className="font-cinzel text-caritas-dark text-xs font-bold mb-1 leading-tight">{pos}</p>
                {exec?.name && exec.name !== pos ? (
                  <p className="font-garamond text-gray-600 text-sm">{exec.name}</p>
                ) : (
                  <p className="font-garamond text-gray-400 text-sm italic">Position Open</p>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center mt-10 flex justify-center gap-6">
          <Link href="/council" className="font-cinzel text-xs text-caritas-red tracking-widest hover:text-caritas-crimson">
            FULL PROFILES
          </Link>
          <Link href="/archive?type=council"
            className="inline-flex items-center gap-2 font-cinzel text-xs text-gray-400 hover:text-caritas-gold tracking-widest">
            <Archive size={14} />
            VIEW ARCHIVE
          </Link>
        </div>
      </div>
    </section>
  );
}
