"use client";
import Link from "next/link";
import { useState } from "react";
import { Flame, Plus, ChevronRight } from "lucide-react";
import PetitionModal from "@/components/modals/PetitionModal";

interface Petition {
  id: string;
  name?: string;
  petition: string;
  is_anonymous: boolean;
  created_at: string;
}

interface Props {
  petitions: Petition[];
}

export default function PetitionsSection({ petitions }: Props) {
  const [showModal, setShowModal] = useState(false);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left content */}
          <div>
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-caritas-gold/60" />
              <span className="font-cinzel text-caritas-gold text-xs tracking-widest uppercase">Community Prayer</span>
            </div>
            <h2 className="font-cinzel text-caritas-dark text-4xl font-bold mb-6">
              Petitions &<br/><span className="text-caritas-red">Prayer Requests</span>
            </h2>
            <div className="scripture pl-6 py-3 mb-6">
              <p className="font-playfair text-caritas-dark text-lg italic">
                "Ask and it will be given to you; seek and you will find; knock and the door will be opened to you."
              </p>
              <p className="font-cinzel text-caritas-gold text-xs mt-2 tracking-wider">— Matthew 7:7</p>
            </div>
            <div className="font-garamond text-gray-600 text-lg leading-relaxed space-y-4">
              <p>
                Submit your prayer petitions to be prayed over by the entire chaplaincy community. 
                Petitions are especially powerful during <strong>exam seasons</strong>, <strong>May Devotion</strong>, 
                and <strong>October Devotion</strong>, when they are printed and burned as a holy offering before the altar.
              </p>
              <p>
                You may submit anonymously. Every petition is a prayer — and prayer moves mountains.
              </p>
            </div>
            <div className="flex items-center gap-2 mt-4 text-sm text-caritas-red font-garamond italic">
              <Flame size={16} />
              <span>Petitions are printed and burnt as offering before God — free of charge</span>
            </div>

            <button onClick={() => setShowModal(true)}
              className="mt-8 inline-flex items-center gap-2 font-cinzel text-xs text-white bg-caritas-red px-8 py-3 rounded-sm hover:bg-caritas-maroon transition-colors tracking-widest">
              <Plus size={14} />
              SUBMIT PETITION
            </button>
          </div>

          {/* Petitions display */}
          <div className="space-y-4">
            <h3 className="font-cinzel text-caritas-dark text-sm tracking-wider mb-6">Recent Petitions</h3>

            {petitions.length > 0 ? petitions.slice(0, 5).map((p) => (
              <div key={p.id} className="bg-caritas-cream rounded-lg p-5 border border-caritas-gold/10 hover:border-caritas-gold/30 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-caritas-gold mt-2 flex-shrink-0" />
                  <div>
                    <p className="font-garamond text-caritas-dark text-lg leading-snug">{p.petition}</p>
                    <p className="font-cinzel text-caritas-gold/60 text-xs mt-2 tracking-wider">
                      {p.is_anonymous ? "— Anonymous" : `— ${p.name}`}
                    </p>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-16 border border-dashed border-gray-200 rounded-lg">
                <Flame size={40} className="text-gray-200 mx-auto mb-4" />
                <p className="font-garamond text-gray-400 italic text-lg">No petitions yet.</p>
                <p className="font-garamond text-gray-300 text-sm mt-2">Be the first to bring your needs before God.</p>
              </div>
            )}

            <Link href="/petitions"
              className="inline-flex items-center gap-2 font-cinzel text-xs text-caritas-red tracking-widest hover:text-caritas-crimson transition-colors group">
              VIEW ALL PETITIONS
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {showModal && <PetitionModal onClose={() => setShowModal(false)} onSuccess={() => setShowModal(false)} />}
    </section>
  );
}
