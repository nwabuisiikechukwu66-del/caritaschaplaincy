"use client";
import { useState, useEffect } from "react";
import { Heart, CreditCard, Building2, Check } from "lucide-react";
import toast from "react-hot-toast";

const defaultItems = [
  { id: "1", name: "Altar Candles (Monthly Supply)", description: "Keep the sanctuary illuminated for worship", target_amount: 15000, raised_amount: 0, category: "liturgical", bible_verse: "Your word is a lamp to my feet — Psalm 119:105" },
  { id: "2", name: "Missals & Hymnals", description: "Provide prayer books for the congregation", target_amount: 50000, raised_amount: 0, category: "liturgical", bible_verse: "Let the word of Christ dwell in you richly — Col 3:16" },
  { id: "3", name: "Priest Vestments", description: "Sacred garments for liturgical celebrations", target_amount: 120000, raised_amount: 0, category: "liturgical", bible_verse: "Clothe yourselves with love — Col 3:14" },
  { id: "4", name: "Sound System Maintenance", description: "Ensure clear proclamation of the Word", target_amount: 80000, raised_amount: 0, category: "infrastructure", bible_verse: "Cry aloud, spare not, lift up your voice — Is 58:1" },
  { id: "5", name: "Charity Outreach Fund", description: "Support the poor and vulnerable in our community", target_amount: 200000, raised_amount: 0, category: "charity", bible_verse: "Whoever is kind to the poor lends to the LORD — Prov 19:17" },
  { id: "6", name: "Chapel Renovation", description: "Restore and beautify our place of worship", target_amount: 500000, raised_amount: 0, category: "infrastructure", bible_verse: "How lovely is your dwelling place, O LORD — Psalm 84:1" },
  { id: "7", name: "Student Welfare Fund", description: "Support indigent Catholic students", target_amount: 100000, raised_amount: 0, category: "charity", bible_verse: "Whatever you did for the least of these — Matt 25:40" },
];

export default function DonationsPage() {
  const [items, setItems] = useState(defaultItems);
  const [selected, setSelected] = useState<any>(null);
  const [form, setForm] = useState({ name: "", email: "", amount: "", message: "" });
  const [step, setStep] = useState<"list" | "form" | "payment" | "done">("list");
  const [loading, setLoading] = useState(false);
  const [reference, setReference] = useState("");

  const handleProceed = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donor_name: form.name,
          email: form.email,
          item_id: selected.id,
          item_name: selected.name,
          amount: parseInt(form.amount || "0"),
          is_charity: selected.category === "charity",
          message: form.message,
        }),
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
      email: form.email || "chaplaincy@caritas.edu.ng",
      amount: parseInt(form.amount || "0") * 100,
      currency: "NGN",
      ref: reference,
      metadata: { custom_fields: [{ display_name: "Item", variable_name: "item", value: selected.name }] },
      callback: async (response: any) => {
        await fetch(`/api/donations/${reference}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ payment_status: "paid", payment_reference: response.reference }) });
        setStep("done");
        toast.success("Payment successful! God bless you.");
        // Reload items ideally, but for now it's okay
      },
      onClose: () => toast("Payment cancelled."),
    });
    handler.openIframe();
  };

  const handleDonate = (item: any) => {
    setSelected(item);
    setForm(f => ({ ...f, amount: item.target_amount.toString() }));
    setStep("form");
  };

  const categoryColor: Record<string, string> = {
    liturgical: "bg-caritas-red/10 text-caritas-red",
    infrastructure: "bg-blue-100 text-blue-700",
    charity: "bg-green-100 text-green-700",
  };

  return (
    <div className="pt-20">
      <section className="red-section sacred-bg py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-px bg-caritas-gold/60" />
            <span className="font-cinzel text-caritas-gold text-xs tracking-widest">Give & It Shall Be Given</span>
            <div className="w-12 h-px bg-caritas-gold/60" />
          </div>
          <h1 className="font-cinzel text-white text-5xl font-bold mb-4">Support the Mission</h1>
          <div className="max-w-xl mx-auto mt-4">
            <p className="font-playfair text-white/80 text-xl italic">"Store up for yourselves treasures in heaven..."</p>
            <p className="font-cinzel text-caritas-gold/70 text-xs tracking-widest mt-2">— Matthew 6:20</p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-caritas-cream">
        <div className="max-w-5xl mx-auto px-4">
          {step === "list" && (
            <>
              <div className="text-center mb-12">
                <h2 className="font-cinzel text-caritas-dark text-2xl font-bold mb-2">Chaplaincy Needs</h2>
                <p className="font-garamond text-gray-500 italic">Choose an item to support or donate to our general fund</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map(item => {
                  const pct = item.target_amount > 0 ? Math.min(100, Math.round((item.raised_amount / item.target_amount) * 100)) : 0;
                  return (
                    <div key={item.id} className="holy-card bg-white rounded-xl p-6 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`font-cinzel text-xs px-2 py-0.5 rounded-sm ${categoryColor[item.category] || "bg-gray-100 text-gray-600"}`}>{item.category}</span>
                      </div>
                      <h3 className="font-cinzel text-caritas-dark font-bold mb-2">{item.name}</h3>
                      <p className="font-garamond text-gray-600 text-sm leading-relaxed mb-3">{item.description}</p>
                      <p className="font-garamond text-caritas-gold text-xs italic mb-4 border-l-2 border-caritas-gold pl-3">{item.bible_verse}</p>

                      {item.target_amount > 0 && (
                        <div className="mb-4">
                          <div className="flex justify-between text-xs font-cinzel mb-1">
                            <span className="text-gray-400">Progress</span>
                            <span className="text-caritas-red">{pct}%</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-caritas-red to-caritas-crimson rounded-full transition-all" style={{ width: `${pct}%` }} />
                          </div>
                          <div className="flex justify-between text-xs font-garamond mt-1 text-gray-400">
                            <span>₦{item.raised_amount.toLocaleString()} raised</span>
                            <span>Goal: ₦{item.target_amount.toLocaleString()}</span>
                          </div>
                        </div>
                      )}

                      <button onClick={() => handleDonate(item)}
                        className="w-full font-cinzel text-xs text-white bg-caritas-red py-2.5 rounded-sm hover:bg-caritas-maroon transition-colors tracking-widest flex items-center justify-center gap-2">
                        <Heart size={12} /> DONATE TO THIS
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* General donation */}
              <div className="mt-10 bg-caritas-dark rounded-xl p-8 text-center sacred-bg">
                <h3 className="font-cinzel text-white text-xl font-bold mb-2">General Donation</h3>
                <p className="font-garamond text-white/60 mb-6">Support the chaplaincy however the Lord leads your heart</p>
                <button onClick={() => { setSelected({ name: "General Donation", id: "general" }); setStep("form"); }}
                  className="font-cinzel text-xs text-caritas-dark bg-caritas-gold px-8 py-3 rounded-sm hover:bg-yellow-400 transition-colors tracking-widest">
                  DONATE ANY AMOUNT
                </button>
              </div>
            </>
          )}

          {step === "form" && selected && (
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <h2 className="font-cinzel text-caritas-dark text-2xl font-bold mb-1">Donation Details</h2>
                <p className="font-garamond text-caritas-red italic mb-6">{selected.name}</p>
                <div className="space-y-4">
                  <div>
                    <label className="font-cinzel text-xs text-caritas-dark tracking-wider block mb-2">YOUR NAME *</label>
                    <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full border border-gray-200 rounded-sm px-4 py-3 font-garamond focus:outline-none focus:border-caritas-red"
                      placeholder="Full name" />
                  </div>
                  <div>
                    <label className="font-cinzel text-xs text-caritas-dark tracking-wider block mb-2">EMAIL</label>
                    <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full border border-gray-200 rounded-sm px-4 py-3 font-garamond focus:outline-none focus:border-caritas-red"
                      placeholder="email@example.com" />
                  </div>
                  <div>
                    <label className="font-cinzel text-xs text-caritas-dark tracking-wider block mb-2">AMOUNT (₦) *</label>
                    <input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                      className="w-full border border-gray-200 rounded-sm px-4 py-3 font-garamond focus:outline-none focus:border-caritas-red"
                      placeholder="Enter amount" />
                  </div>
                  <div>
                    <label className="font-cinzel text-xs text-caritas-dark tracking-wider block mb-2">MESSAGE (OPTIONAL)</label>
                    <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} rows={3}
                      className="w-full border border-gray-200 rounded-sm px-4 py-3 font-garamond focus:outline-none focus:border-caritas-red resize-none"
                      placeholder="Any special message..." />
                  </div>
                  <button onClick={handleProceed} disabled={!form.name || !form.amount || loading}
                    className="w-full font-cinzel text-xs text-white bg-caritas-red py-3 rounded-sm hover:bg-caritas-maroon transition-colors tracking-widest disabled:opacity-60">
                    {loading ? "SUBMITTING..." : "PROCEED TO PAYMENT"}
                  </button>
                  <button onClick={() => setStep("list")}
                    className="w-full font-cinzel text-xs text-gray-500 border border-gray-200 py-2 rounded-sm hover:bg-gray-50 tracking-widest">
                    BACK
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === "payment" && (
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <h2 className="font-cinzel text-caritas-dark text-2xl font-bold mb-6">Complete Donation</h2>
                <div className="bg-caritas-cream rounded-lg p-4 mb-6 text-center">
                  <p className="font-garamond text-gray-600">{selected?.name}</p>
                  <p className="font-cinzel text-caritas-gold text-2xl mt-1">₦{parseInt(form.amount || "0").toLocaleString()}</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-5 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 size={18} className="text-caritas-red" />
                    <h3 className="font-cinzel text-sm font-bold text-caritas-dark">BANK TRANSFER</h3>
                  </div>
                  <div className="space-y-2 font-garamond text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Bank</span><span className="font-semibold">First Bank Nigeria</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Account No.</span><span className="font-semibold text-caritas-red">3012345678</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Name</span><span className="font-semibold">Caritas Catholic Chaplaincy</span></div>
                  </div>
                  <p className="font-garamond text-gray-400 text-xs italic mt-3">Please use your name or reference as narration.</p>
                </div>

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

                <button onClick={() => { setStep("done"); }}
                  className="w-full font-cinzel text-xs text-gray-500 border border-gray-200 py-2 mt-4 rounded-sm hover:bg-gray-50 tracking-widest">
                  I HAVE TRANSFERRED — CLOSE
                </button>
              </div>
            </div>
          )}

          {step === "done" && (
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-xl p-8 shadow-sm text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <Check size={28} className="text-green-600" />
                </div>
                <h2 className="font-cinzel text-caritas-dark text-2xl font-bold mb-2">Thank You!</h2>
                <p className="font-garamond text-gray-600 mb-6 border-b border-gray-100 pb-6">
                  May God reward your generosity and bless the works of your hands.
                </p>
                <button onClick={() => { setStep("list"); setSelected(null); setForm({ name: "", email: "", amount: "", message: "" }); }}
                  className="w-full font-cinzel text-xs text-white bg-caritas-red py-3 rounded-sm hover:bg-caritas-maroon tracking-widest">
                  RETURN TO DONATIONS
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
