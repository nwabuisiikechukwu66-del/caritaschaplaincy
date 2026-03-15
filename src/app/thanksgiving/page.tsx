"use client";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import BookingModal from "@/components/modals/BookingModal";

export default function ThanksgivingPage() {
  const [thanksgivings, setThanksgivings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const load = () => {
    fetch("/api/mass-intentions?type=thanksgiving").then(r => r.json()).then(d => { setThanksgivings(Array.isArray(d) ? d : []); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  return (
    <div className="pt-20">
      <section className="red-section sacred-bg py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-3 mb-4"><div className="w-12 h-px bg-caritas-gold/60" /><span className="font-cinzel text-caritas-gold text-xs tracking-widest">Gratitude to God</span><div className="w-12 h-px bg-caritas-gold/60" /></div>
          <h1 className="font-cinzel text-white text-5xl font-bold mb-4">Thanksgiving Mass</h1>
          <p className="font-garamond text-white/70 text-xl italic max-w-2xl mx-auto">Offer a Mass of Thanksgiving to God for blessings received — ₦2,500</p>
          <button onClick={() => setShowModal(true)} className="mt-8 font-cinzel text-xs text-caritas-dark bg-caritas-gold px-8 py-3 rounded-sm hover:bg-yellow-400 transition-colors tracking-widest flex items-center gap-2 mx-auto">
            <Plus size={14} /> BOOK THANKSGIVING MASS
          </button>
        </div>
      </section>
      <section className="py-12 bg-caritas-cream">
        <div className="max-w-3xl mx-auto px-4">
          {loading ? <div className="text-center py-16"><div className="w-12 h-12 rounded-full border-4 border-caritas-red/20 border-t-caritas-red animate-spin mx-auto" /></div>
          : thanksgivings.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm">
              <p className="font-garamond text-gray-400 italic text-lg">No thanksgiving Masses booked yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {thanksgivings.map((item, i) => (
                <div key={item.id} className="bg-white rounded-xl p-6 shadow-sm flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-caritas-gold to-yellow-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">🙏</span>
                  </div>
                  <div>
                    <p className="font-garamond text-caritas-dark text-xl">{item.intention}</p>
                    <p className="font-cinzel text-gray-400 text-xs mt-2">{item.is_anonymous ? "Anonymous" : item.name} · {new Date(item.intention_date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      {showModal && <BookingModal type="thanksgiving" onClose={() => setShowModal(false)} onSuccess={() => { setShowModal(false); load(); }} />}
    </div>
  );
}
