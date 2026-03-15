"use client";
import { useState, useEffect } from "react";
import { Calendar, Plus } from "lucide-react";

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", event_date: "", event_time: "", location: "", submitted_by: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => { setLoading(false); }, []);

  const handleSubmit = async () => {
    if (!form.title || !form.event_date) return;
    await fetch("/api/announcements", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: `[EVENT] ${form.title}`, content: `${form.description}\n\nDate: ${form.event_date} ${form.event_time}\nLocation: ${form.location}`, submitted_by: form.submitted_by }) });
    setSubmitted(true); setShowForm(false);
  };

  return (
    <div className="pt-20">
      <section className="red-section sacred-bg py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-3 mb-4"><div className="w-12 h-px bg-caritas-gold/60" /><span className="font-cinzel text-caritas-gold text-xs tracking-widest">Chaplaincy Calendar</span><div className="w-12 h-px bg-caritas-gold/60" /></div>
          <h1 className="font-cinzel text-white text-5xl font-bold mb-4">Events</h1>
          <p className="font-garamond text-white/70 text-xl italic">Upcoming activities at the chaplaincy</p>
          <button onClick={() => setShowForm(true)} className="mt-8 font-cinzel text-xs text-caritas-dark bg-caritas-gold px-6 py-3 rounded-sm hover:bg-yellow-400 transition-colors tracking-widest flex items-center gap-2 mx-auto">
            <Plus size={14} /> SUBMIT EVENT
          </button>
        </div>
      </section>
      <section className="py-12 bg-caritas-cream">
        <div className="max-w-3xl mx-auto px-4">
          {submitted && <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-center"><p className="font-garamond text-green-700">Event submitted for admin review. Thank you!</p></div>}
          {showForm && (
            <div className="bg-white rounded-xl p-8 shadow-sm mb-8">
              <h3 className="font-cinzel text-caritas-dark font-bold text-xl mb-6">Submit an Event</h3>
              <div className="space-y-4">
                <div><label className="font-cinzel text-xs tracking-wider block mb-2">EVENT TITLE *</label><input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full border border-gray-200 rounded-sm px-4 py-3 font-garamond focus:outline-none focus:border-caritas-red" /></div>
                <div><label className="font-cinzel text-xs tracking-wider block mb-2">DESCRIPTION</label><textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="w-full border border-gray-200 rounded-sm px-4 py-3 font-garamond focus:outline-none focus:border-caritas-red resize-none" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="font-cinzel text-xs tracking-wider block mb-2">DATE *</label><input type="date" value={form.event_date} onChange={e => setForm(f => ({ ...f, event_date: e.target.value }))} className="w-full border border-gray-200 rounded-sm px-4 py-3 font-garamond focus:outline-none focus:border-caritas-red" /></div>
                  <div><label className="font-cinzel text-xs tracking-wider block mb-2">TIME</label><input type="time" value={form.event_time} onChange={e => setForm(f => ({ ...f, event_time: e.target.value }))} className="w-full border border-gray-200 rounded-sm px-4 py-3 font-garamond focus:outline-none focus:border-caritas-red" /></div>
                </div>
                <div><label className="font-cinzel text-xs tracking-wider block mb-2">LOCATION</label><input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className="w-full border border-gray-200 rounded-sm px-4 py-3 font-garamond focus:outline-none focus:border-caritas-red" placeholder="e.g. School Auditorium" /></div>
                <div><label className="font-cinzel text-xs tracking-wider block mb-2">YOUR NAME</label><input value={form.submitted_by} onChange={e => setForm(f => ({ ...f, submitted_by: e.target.value }))} className="w-full border border-gray-200 rounded-sm px-4 py-3 font-garamond focus:outline-none focus:border-caritas-red" /></div>
                <div className="flex gap-3">
                  <button onClick={handleSubmit} className="font-cinzel text-xs text-white bg-caritas-red px-6 py-3 rounded-sm hover:bg-caritas-maroon tracking-widest">SUBMIT</button>
                  <button onClick={() => setShowForm(false)} className="font-cinzel text-xs text-gray-500 border border-gray-200 px-6 py-3 rounded-sm tracking-widest">CANCEL</button>
                </div>
              </div>
            </div>
          )}
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <Calendar size={48} className="text-gray-200 mx-auto mb-4" />
            <p className="font-garamond text-gray-400 italic text-lg">Events will appear here once admin-approved.</p>
            <p className="font-garamond text-gray-300 text-sm mt-2">Check announcements for the latest chaplaincy activities.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
