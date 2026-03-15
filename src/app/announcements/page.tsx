"use client";
import { useState, useEffect } from "react";
import { Bell, Plus } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", submitted_by: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch("/api/announcements").then(r => r.json()).then(d => { setAnnouncements(Array.isArray(d) ? d : []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.content.trim()) return;
    setSubmitting(true);
    await fetch("/api/announcements", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSubmitting(false);
    setSubmitted(true);
    setShowForm(false);
  };

  return (
    <div className="pt-20">
      <section className="red-section sacred-bg py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-px bg-caritas-gold/60" />
            <span className="font-cinzel text-caritas-gold text-xs tracking-widest">Stay Informed</span>
            <div className="w-12 h-px bg-caritas-gold/60" />
          </div>
          <h1 className="font-cinzel text-white text-5xl font-bold mb-4">Announcements</h1>
          <p className="font-garamond text-white/70 text-xl italic">News, events, and updates from the chaplaincy</p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <button onClick={() => setShowForm(true)}
              className="font-cinzel text-xs text-caritas-dark bg-caritas-gold px-6 py-3 rounded-sm hover:bg-yellow-400 transition-colors tracking-widest flex items-center gap-2">
              <Plus size={14} /> SUBMIT ANNOUNCEMENT
            </button>
          </div>
        </div>
      </section>

      <section className="py-12 bg-caritas-cream">
        <div className="max-w-3xl mx-auto px-4">
          {submitted && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 text-center">
              <p className="font-garamond text-green-700">Your announcement has been submitted for admin review. Thank you!</p>
            </div>
          )}

          {showForm && (
            <div className="bg-white rounded-xl p-8 shadow-sm mb-10 border border-caritas-gold/20">
              <h3 className="font-cinzel text-caritas-dark font-bold text-xl mb-6">Submit an Announcement</h3>
              <div className="space-y-4">
                <div>
                  <label className="font-cinzel text-xs text-caritas-dark tracking-wider block mb-2">TITLE *</label>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    className="w-full border border-gray-200 rounded-sm px-4 py-3 font-garamond focus:outline-none focus:border-caritas-red"
                    placeholder="Announcement title" />
                </div>
                <div>
                  <label className="font-cinzel text-xs text-caritas-dark tracking-wider block mb-2">CONTENT *</label>
                  <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={5}
                    className="w-full border border-gray-200 rounded-sm px-4 py-3 font-garamond focus:outline-none focus:border-caritas-red resize-none"
                    placeholder="Announcement details..." />
                </div>
                <div>
                  <label className="font-cinzel text-xs text-caritas-dark tracking-wider block mb-2">YOUR NAME</label>
                  <input value={form.submitted_by} onChange={e => setForm(f => ({ ...f, submitted_by: e.target.value }))}
                    className="w-full border border-gray-200 rounded-sm px-4 py-3 font-garamond focus:outline-none focus:border-caritas-red"
                    placeholder="Your name (optional)" />
                </div>
                <p className="font-garamond text-gray-400 text-sm italic">Your submission will be reviewed before appearing publicly.</p>
                <div className="flex gap-3">
                  <button onClick={handleSubmit} disabled={submitting}
                    className="font-cinzel text-xs text-white bg-caritas-red px-6 py-3 rounded-sm hover:bg-caritas-maroon transition-colors tracking-widest disabled:opacity-60">
                    {submitting ? "SUBMITTING..." : "SUBMIT"}
                  </button>
                  <button onClick={() => setShowForm(false)}
                    className="font-cinzel text-xs text-gray-500 border border-gray-200 px-6 py-3 rounded-sm hover:bg-gray-50 tracking-widest">
                    CANCEL
                  </button>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-16">
              <div className="w-12 h-12 rounded-full border-4 border-caritas-red/20 border-t-caritas-red animate-spin mx-auto" />
            </div>
          ) : announcements.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm">
              <Bell size={48} className="text-gray-200 mx-auto mb-4" />
              <p className="font-garamond text-gray-400 italic text-lg">No announcements at this time.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {announcements.map(ann => (
                <div key={ann.id} className="announcement-card bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="font-cinzel text-caritas-dark font-bold text-lg">{ann.title}</h3>
                    <span className="font-cinzel text-caritas-gold text-xs tracking-wider flex-shrink-0">{formatDate(ann.created_at)}</span>
                  </div>
                  <p className="font-garamond text-gray-600 text-lg leading-relaxed">{ann.content}</p>
                  {ann.author && <p className="font-cinzel text-gray-400 text-xs mt-3 tracking-wider">— {ann.author}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
