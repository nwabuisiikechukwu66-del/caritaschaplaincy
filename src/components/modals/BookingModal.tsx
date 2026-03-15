"use client";
import { useState } from "react";
import { X, CreditCard, Building2, ExternalLink, Check } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  type: "intention" | "thanksgiving";
  onClose: () => void;
  onSuccess: () => void;
}

type Step = "form" | "payment" | "done";

export default function BookingModal({ type, onClose, onSuccess }: Props) {
  const [step, setStep] = useState<Step>("form");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", isAnonymous: false, intention: "", date: new Date().toISOString().split("T")[0] });
  const [reference, setReference] = useState("");

  const price = type === "intention" ? 100 : 2500;
  const label = type === "intention" ? "Mass Intention" : "Thanksgiving Mass";

  const handleSubmit = async () => {
    if (!form.isAnonymous && !form.name.trim()) { toast.error("Please enter your name or choose anonymous"); return; }
    if (!form.intention.trim()) { toast.error("Please enter your intention"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/mass-intentions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, type, amount: price }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setReference(data.id);
      setStep("payment");
    } catch (e: any) {
      toast.error(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handlePaystackPayment = async () => {
    if (typeof window === "undefined") return;
    const PaystackPop = (window as any).PaystackPop;
    const pk = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
    if (!pk || !PaystackPop) {
      toast.error("Paystack is not configured. Please use bank transfer.");
      return;
    }
    const handler = PaystackPop.setup({
      key: pk,
      email: "chaplaincy@caritas.edu.ng",
      amount: price * 100,
      currency: "NGN",
      ref: reference,
      metadata: { custom_fields: [{ display_name: "Intention", variable_name: "intention", value: form.intention }] },
      callback: async (response: any) => {
        await fetch(`/api/mass-intentions/${reference}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ payment_status: "paid", payment_reference: response.reference }) });
        setStep("done");
        toast.success("Payment successful! Your intention has been submitted for admin approval.");
      },
      onClose: () => toast("Payment cancelled."),
    });
    handler.openIframe();
  };

  return (
    <div className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-caritas-red to-caritas-maroon p-6 rounded-t-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-cinzel text-caritas-gold text-xs tracking-widest">BOOK A</p>
              <h2 className="font-cinzel text-white text-xl font-bold">{label}</h2>
              <p className="font-cinzel text-caritas-gold text-lg mt-1">₦{price.toLocaleString()}</p>
            </div>
            <button onClick={onClose} className="text-white/60 hover:text-white transition-colors"><X size={20} /></button>
          </div>
        </div>

        <div className="p-6">
          {step === "form" && (
            <div className="space-y-5">
              {/* Anonymous toggle */}
              <label className="flex items-center gap-3 cursor-pointer">
                <div className={`w-12 h-6 rounded-full transition-colors ${form.isAnonymous ? 'bg-caritas-red' : 'bg-gray-200'} relative`}
                  onClick={() => setForm(f => ({ ...f, isAnonymous: !f.isAnonymous }))}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.isAnonymous ? 'translate-x-7' : 'translate-x-1'}`} />
                </div>
                <span className="font-garamond text-gray-700">Submit anonymously</span>
              </label>

              {!form.isAnonymous && (
                <div>
                  <label className="font-cinzel text-xs text-caritas-dark tracking-wider block mb-2">YOUR NAME *</label>
                  <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full border border-gray-200 rounded-sm px-4 py-3 font-garamond text-gray-800 focus:outline-none focus:border-caritas-red"
                    placeholder="Enter your full name" />
                </div>
              )}

              <div>
                <label className="font-cinzel text-xs text-caritas-dark tracking-wider block mb-2">INTENTION / THANKSGIVING *</label>
                <textarea value={form.intention} onChange={e => setForm(f => ({ ...f, intention: e.target.value }))}
                  rows={4} className="w-full border border-gray-200 rounded-sm px-4 py-3 font-garamond text-gray-800 focus:outline-none focus:border-caritas-red resize-none"
                  placeholder={type === "intention" ? "e.g. For the healing of my mother, Maria..." : "e.g. Thanksgiving for passing my exams..."} />
              </div>

              <div>
                <label className="font-cinzel text-xs text-caritas-dark tracking-wider block mb-2">PREFERRED DATE</label>
                <input type="date" value={form.date} min={new Date().toISOString().split("T")[0]}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  className="w-full border border-gray-200 rounded-sm px-4 py-3 font-garamond text-gray-800 focus:outline-none focus:border-caritas-red" />
              </div>

              <button onClick={handleSubmit} disabled={loading}
                className="w-full font-cinzel text-xs text-white bg-caritas-red py-3 rounded-sm hover:bg-caritas-maroon transition-colors tracking-widest disabled:opacity-60">
                {loading ? "SUBMITTING..." : "PROCEED TO PAYMENT"}
              </button>
            </div>
          )}

          {step === "payment" && (
            <div className="space-y-5">
              <div className="bg-caritas-cream rounded-lg p-4 text-center">
                <p className="font-garamond text-gray-600 text-sm">Intention submitted. Please complete payment to confirm.</p>
                <p className="font-cinzel text-caritas-gold text-2xl mt-2">₦{price.toLocaleString()}</p>
              </div>

              {/* Bank Transfer */}
              <div className="border border-gray-200 rounded-lg p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 size={18} className="text-caritas-red" />
                  <h3 className="font-cinzel text-caritas-dark text-sm font-bold">BANK TRANSFER</h3>
                </div>
                <div className="space-y-2 font-garamond text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Bank</span><span className="font-semibold">First Bank Nigeria</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Account No.</span><span className="font-semibold text-caritas-red">3012345678</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Account Name</span><span className="font-semibold">Caritas Catholic Chaplaincy</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Amount</span><span className="font-semibold text-caritas-red">₦{price.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Reference</span><span className="font-semibold text-xs">{reference.slice(0, 8)}</span></div>
                </div>
                <p className="font-garamond text-gray-400 text-xs italic mt-3">Use your name or the reference as narration. Admin will verify and approve.</p>
              </div>

              {/* Paystack */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 h-px bg-gray-100" />
                  <span className="font-garamond text-gray-400 text-sm">or pay online</span>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>
                <button onClick={handlePaystackPayment}
                  className="w-full flex items-center justify-center gap-2 font-cinzel text-xs text-white bg-blue-600 py-3 rounded-sm hover:bg-blue-700 transition-colors tracking-widest">
                  <CreditCard size={14} />
                  PAY WITH PAYSTACK
                </button>
              </div>

              <button onClick={() => { setStep("done"); onSuccess(); }}
                className="w-full font-cinzel text-xs text-gray-500 border border-gray-200 py-2 rounded-sm hover:bg-gray-50 transition-colors tracking-wider">
                I HAVE TRANSFERRED — CLOSE
              </button>
            </div>
          )}

          {step === "done" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Check size={28} className="text-green-600" />
              </div>
              <h3 className="font-cinzel text-caritas-dark text-xl font-bold mb-2">Submitted!</h3>
              <p className="font-garamond text-gray-600 leading-relaxed">
                Your {label.toLowerCase()} has been received. It will appear on the website once the admin approves your payment.
              </p>
              <p className="font-garamond text-gray-400 text-sm italic mt-4">
                May God grant your intention through the intercession of Our Lady.
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
