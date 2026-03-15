"use client";
import Link from "next/link";
import { Archive } from "lucide-react";

interface Official { id: string; name: string; role: string; photo_url?: string; }

export default function OfficialsSection({
  sacristans, catechists
}: { sacristans: Official[]; catechists: Official[]; }) {
  const OfficialCard = ({ name, role, photo_url }: Official) => (
    <div className="holy-card bg-white rounded-lg p-6 text-center shadow-sm">
      <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-gradient-to-br from-caritas-red/10 to-caritas-gold/20 border-2 border-caritas-gold/30 flex items-center justify-center overflow-hidden">
        {photo_url ? (
          <img src={photo_url} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="font-cinzel text-caritas-gold text-2xl">✝</span>
        )}
      </div>
      <p className="font-cinzel text-caritas-dark text-sm font-bold mb-1">{name}</p>
      <p className="font-garamond text-caritas-red text-sm italic">{role}</p>
    </div>
  );

  return (
    <section className="py-20 bg-caritas-cream sacred-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-px bg-caritas-red/40" />
            <span className="font-cinzel text-caritas-red text-xs tracking-widest uppercase">Serving the Altar</span>
            <div className="w-12 h-px bg-caritas-red/40" />
          </div>
          <h2 className="font-cinzel text-caritas-cream text-4xl font-bold">Sacristans & Catechists</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Sacristans */}
          <div>
            <h3 className="font-cinzel text-caritas-cream text-xl font-semibold mb-6 flex items-center gap-3">
              <span className="text-caritas-gold">⛪</span> Sacristans
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {sacristans.map(s => <OfficialCard key={s.id} {...s} />)}
            </div>
          </div>

          {/* Catechists */}
          <div>
            <h3 className="font-cinzel text-caritas-cream text-xl font-semibold mb-6 flex items-center gap-3">
              <span className="text-caritas-gold">📖</span> Catechists
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {catechists.map(c => <OfficialCard key={c.id} {...c} />)}
            </div>
          </div>
        </div>

        <div className="text-center mt-10">
          <Link href="/archive?type=officials"
            className="inline-flex items-center gap-2 font-cinzel text-xs text-gray-400 hover:text-caritas-gold tracking-widest transition-colors border border-gray-200 hover:border-caritas-gold/40 px-6 py-3 rounded-sm">
            <Archive size={14} /> VIEW PAST OFFICIALS
          </Link>
        </div>
      </div>
    </section>
  );
}
