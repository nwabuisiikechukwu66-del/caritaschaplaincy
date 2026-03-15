"use client";
import { useState, useEffect } from "react";
import { Plus, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import BookingModal from "@/components/modals/BookingModal";
import { formatDate } from "@/lib/utils";

export default function MassIntentionsPage() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [intentions, setIntentions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"intention" | "thanksgiving">("intention");

  const load = () => {
    setLoading(true);
    fetch(`/api/mass-intentions?date=${date}`)
      .then(r => r.json())
      .then(d => { setIntentions(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, [date]);

  const changeDate = (days: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    setDate(d.toISOString().split("T")[0]);
  };

  const formatted = new Date(date + "T12:00:00").toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="pt-20">
      <section className="red-section sacred-bg py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-px bg-caritas-gold/60" />
            <span className="font-cinzel text-caritas-gold text-xs tracking-widest">Offered at the Holy Sacrifice</span>
            <div className="w-12 h-px bg-caritas-gold/60" />
          </div>
          <h1 className="font-cinzel text-white text-5xl font-bold mb-4">Mass Intentions</h1>
          <p className="font-garamond text-white/70 text-xl italic max-w-2xl mx-auto">
            Every soul remembered before the altar of God — Mass Intention ₦100 · Thanksgiving ₦2,500
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <button onClick={() => { setModalType("intention"); setShowModal(true); }}
              className="font-cinzel text-xs text-caritas-dark bg-caritas-gold px-6 py-3 rounded-sm hover:bg-yellow-400 transition-colors tracking-widest flex items-center gap-2">
              <Plus size={14} /> BOOK INTENTION (₦100)
            </button>
            <button onClick={() => { setModalType("thanksgiving"); setShowModal(true); }}
              className="font-cinzel text-xs text-white border border-white/40 px-6 py-3 rounded-sm hover:bg-white/10 transition-colors tracking-widest flex items-center gap-2">
              <Plus size={14} /> BOOK THANKSGIVING (₦2,500)
            </button>
          </div>
        </div>
      </section>

      <section className="py-12 bg-caritas-cream">
        <div className="max-w-3xl mx-auto px-4">
          {/* Date Nav */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <button onClick={() => changeDate(-1)} className="w-10 h-10 rounded-full border border-caritas-red/30 flex items-center justify-center hover:bg-caritas-red hover:text-white transition-colors text-caritas-dark">
              <ChevronLeft size={18} />
            </button>
            <div className="text-center">
              <p className="font-cinzel text-caritas-dark font-bold">{formatted}</p>
              <p className="font-garamond text-gray-500 text-sm mt-1">{intentions.length} intention{intentions.length !== 1 ? "s" : ""} for this day</p>
            </div>
            <button onClick={() => changeDate(1)} className="w-10 h-10 rounded-full border border-caritas-red/30 flex items-center justify-center hover:bg-caritas-red hover:text-white transition-colors text-caritas-dark">
              <ChevronRight size={18} />
            </button>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="w-12 h-12 rounded-full border-4 border-caritas-red/20 border-t-caritas-red animate-spin mx-auto mb-4" />
              <p className="font-garamond text-gray-400 italic">Loading intentions...</p>
            </div>
          ) : intentions.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm">
              <BookOpen size={48} className="text-gray-200 mx-auto mb-4" />
              <p className="font-garamond text-gray-400 italic text-lg">No intentions booked for this date.</p>
              <p className="font-garamond text-gray-300 text-sm mt-2">Be the first — book a Mass intention below.</p>
              <button onClick={() => { setModalType("intention"); setShowModal(true); }}
                className="mt-6 font-cinzel text-xs text-white bg-caritas-red px-6 py-3 rounded-sm tracking-widest flex items-center gap-2 mx-auto">
                <Plus size={14} /> BOOK INTENTION
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {intentions.map((item, i) => (
                <div key={item.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-50 hover:border-caritas-gold/30 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-caritas-red to-caritas-maroon flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="font-cinzel text-white text-sm font-bold">{i + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-cinzel text-xs px-2 py-0.5 rounded-sm ${item.type === "thanksgiving" ? "bg-caritas-gold/20 text-yellow-700" : "bg-caritas-red/10 text-caritas-red"}`}>
                          {item.type === "thanksgiving" ? "Thanksgiving" : "Intention"}
                        </span>
                      </div>
                      <p className="font-garamond text-caritas-dark text-xl leading-snug">{item.intention}</p>
                      <p className="font-cinzel text-gray-400 text-xs mt-2 tracking-wider">
                        {item.is_anonymous ? "— Anonymous" : `— ${item.name}`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {showModal && <BookingModal type={modalType} onClose={() => setShowModal(false)} onSuccess={() => { setShowModal(false); load(); }} />}
    </div>
  );
}
