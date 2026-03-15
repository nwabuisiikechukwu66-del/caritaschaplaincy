"use client";
import { useState, useEffect } from "react";
import { Flame, Plus } from "lucide-react";
import PetitionModal from "@/components/modals/PetitionModal";

export default function PetitionsPage() {
  const [petitions, setPetitions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const load = () => {
    setLoading(true);
    fetch("/api/petitions").then(r => r.json()).then(d => { setPetitions(Array.isArray(d) ? d : []); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  return (
    <div className="pt-20">
      <section className="red-section sacred-bg py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-px bg-caritas-gold/60" />
            <span className="font-cinzel text-caritas-gold text-xs tracking-widest">Community Intercession</span>
            <div className="w-12 h-px bg-caritas-gold/60" />
          </div>
          <h1 className="font-cinzel text-white text-5xl font-bold mb-4">Petitions & Prayers</h1>
          <p className="font-garamond text-white/70 text-xl italic max-w-2xl mx-auto">
            "Ask and it will be given to you." Your petition burns as incense before the Lord — free of charge.
          </p>
          <button onClick={() => setShowModal(true)}
            className="mt-8 font-cinzel text-xs text-caritas-dark bg-caritas-gold px-8 py-3 rounded-sm hover:bg-yellow-400 transition-colors tracking-widest flex items-center gap-2 mx-auto">
            <Plus size={14} /> SUBMIT YOUR PETITION
          </button>
        </div>
      </section>

      <section className="py-12 bg-caritas-cream">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <Flame size={20} className="text-caritas-red" />
            <h2 className="font-cinzel text-caritas-dark text-xl font-bold">Community Prayer Intentions</h2>
            <span className="font-garamond text-gray-400 text-sm">({petitions.length} approved)</span>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="w-12 h-12 rounded-full border-4 border-caritas-red/20 border-t-caritas-red animate-spin mx-auto mb-4" />
              <p className="font-garamond text-gray-400 italic">Loading petitions...</p>
            </div>
          ) : petitions.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm">
              <Flame size={48} className="text-gray-200 mx-auto mb-4" />
              <p className="font-garamond text-gray-400 italic text-lg">No petitions yet.</p>
              <p className="font-garamond text-gray-300 text-sm mt-2">Be the first to bring your needs before God and His people.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {petitions.map((p) => (
                <div key={p.id} className="bg-white rounded-xl p-6 shadow-sm border border-caritas-gold/10 hover:border-caritas-gold/30 transition-colors">
                  <div className="flex items-start gap-3">
                    <Flame size={16} className="text-caritas-gold mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="font-garamond text-caritas-dark text-lg leading-snug">{p.petition}</p>
                      <p className="font-cinzel text-gray-400 text-xs mt-2 tracking-wider">
                        {p.is_anonymous ? "— Anonymous" : `— ${p.name || "Anonymous"}`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {showModal && <PetitionModal onClose={() => setShowModal(false)} onSuccess={() => { setShowModal(false); load(); }} />}
    </div>
  );
}
