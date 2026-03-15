"use client";
import { useState } from "react";
import { X, Check } from "lucide-react";
import toast from "react-hot-toast";

interface Props { onClose: () => void; onSuccess: () => void; }

export default function PetitionModal({ onClose, onSuccess }: Props) {
  const [step, setStep] = useState<"form" | "done">("form");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", isAnonymous: false, petition: "" });

  const handleSubmit = async () => {
    if (!form.petition.trim()) { toast.error("Please enter your petition"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/petitions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to submit");
      setStep("done");
    } catch (e: any) {
      toast.error(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full shadow-2xl">
        <div className="bg-gradient-to-r from-caritas-dark to-caritas-maroon p-6 rounded-t-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-cinzel text-caritas-gold text-xs tracking-widest">FREE — COMMUNITY PRAYER</p>
              <h2 className="font-cinzel text-white text-xl font-bold mt-1">Submit Petition</h2>
            </div>
            <button onClick={onClose} className="text-white/60 hover:text-white"><X size={20} /></button>
          </div>
        </div>

        <div className="p-6">
          {step === "form" ? (
            <div className="space-y-5">
              <p className="font-garamond text-gray-600 leading-relaxed italic">
                Your petition will be prayed over by the community and, where applicable, printed and offered before the altar.
              </p>

              <label className="flex items-center gap-3 cursor-pointer">
                <div className={`w-12 h-6 rounded-full transition-colors ${form.isAnonymous ? 'bg-caritas-red' : 'bg-gray-200'} relative`}
                  onClick={() => setForm(f => ({ ...f, isAnonymous: !f.isAnonymous }))}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.isAnonymous ? 'translate-x-7' : 'translate-x-1'}`} />
                </div>
                <span className="font-garamond text-gray-700">Submit anonymously</span>
              </label>

              {!form.isAnonymous && (
                <div>
                  <label className="font-cinzel text-xs text-caritas-dark tracking-wider block mb-2">YOUR NAME</label>
                  <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full border border-gray-200 rounded-sm px-4 py-3 font-garamond focus:outline-none focus:border-caritas-red"
                    placeholder="Your name (optional)" />
                </div>
              )}

              <div>
                <label className="font-cinzel text-xs text-caritas-dark tracking-wider block mb-2">YOUR PETITION *</label>
                <textarea value={form.petition} onChange={e => setForm(f => ({ ...f, petition: e.target.value }))}
                  rows={5} className="w-full border border-gray-200 rounded-sm px-4 py-3 font-garamond focus:outline-none focus:border-caritas-red resize-none"
                  placeholder="e.g. Lord, grant me success in my exams and protect my family..." />
              </div>

              <div className="bg-caritas-cream rounded-lg p-4">
                <p className="font-garamond text-sm text-gray-500 italic">
                  ✦ Petitions are free · Reviewed by the Catechist · Printed & offered during devotions
                </p>
              </div>

              <button onClick={handleSubmit} disabled={loading}
                className="w-full font-cinzel text-xs text-white bg-caritas-dark py-3 rounded-sm hover:bg-caritas-maroon transition-colors tracking-widest disabled:opacity-60">
                {loading ? "SUBMITTING..." : "SUBMIT PETITION"}
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Check size={28} className="text-green-600" />
              </div>
              <h3 className="font-cinzel text-caritas-dark text-xl font-bold mb-2">Petition Submitted!</h3>
              <p className="font-garamond text-gray-600 leading-relaxed">
                Your petition has been received. It will be reviewed and added to our prayer intentions.
              </p>
              <p className="font-playfair text-caritas-red italic mt-4 text-lg">
                "Ask and it will be given to you..." — Matthew 7:7
              </p>
              <button onClick={onClose}
                className="mt-6 font-cinzel text-xs text-white bg-caritas-red px-8 py-3 rounded-sm hover:bg-caritas-maroon transition-colors tracking-widest">
                CLOSE
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
