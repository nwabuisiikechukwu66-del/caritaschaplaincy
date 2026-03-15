"use client";
import { useState, useEffect } from "react";
import { LogOut, Check, X, Bell, BookOpen, Flame, Users, Archive, Settings, Plus, Edit, Trash, Image as ImageIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

type Tab = "mass" | "petitions" | "announcements" | "personnel" | "societies" | "settings";
type CouncilType = "executives" | "sacristans" | "catechists" | "authorities" | "societies";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [creds, setCreds] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("mass");
  const [data, setData] = useState<Record<string, any[]>>({
    mass: [], petitions: [], announcements: [],
    executives: [], sacristans: [], catechists: [], authorities: [], societies: []
  });
  const [loading, setLoading] = useState(false);

  const [councilView, setCouncilView] = useState<CouncilType>("executives");
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  const login = async () => {
    const res = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(creds) });
    if (res.ok) { setAuthed(true); loadData(); }
    else setError("Invalid credentials. Please check your username and password.");
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const { supabase } = await import("@/lib/supabase");
      const [mass, petitions, announcements] = await Promise.all([
        supabase.from("mass_intentions").select("*").eq("is_approved", false).order("created_at", { ascending: false }).then(r => r.data || []),
        supabase.from("petitions").select("*").eq("is_approved", false).order("created_at", { ascending: false }).then(r => r.data || []),
        supabase.from("announcements").select("*").eq("is_approved", false).order("created_at", { ascending: false }).then(r => r.data || []),
      ]);
      setData(prev => ({ ...prev, mass, petitions, announcements }));

      // Load personnel & societies data
      const [exRes, sacRes, catRes, authRes, socRes] = await Promise.all([
        fetch("/api/admin/council?type=executives").then(r => r.json()),
        fetch("/api/admin/council?type=sacristans").then(r => r.json()),
        fetch("/api/admin/council?type=catechists").then(r => r.json()),
        fetch("/api/admin/council?type=authorities").then(r => r.json()),
        fetch("/api/admin/council?type=societies").then(r => r.json()),
      ]);
      setData(prev => ({
        ...prev,
        executives: Array.isArray(exRes) ? exRes : [],
        sacristans: Array.isArray(sacRes) ? sacRes : [],
        catechists: Array.isArray(catRes) ? catRes : [],
        authorities: Array.isArray(authRes) ? authRes : [],
        societies: Array.isArray(socRes) ? socRes : []
      }));

    } catch (e) {
      console.error(e);
    } finally { setLoading(false); }
  };

  const approve = async (table: string, id: string) => {
    await fetch("/api/admin/approve", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ table, id, action: "approve" }) });
    toast.success("Approved successfully");
    loadData();
  };

  const reject = async (table: string, id: string) => {
    await fetch("/api/admin/approve", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ table, id, action: "reject" }) });
    toast.success("Removed successfully");
    loadData();
  };

  const saveCouncilItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const item = Object.fromEntries(formData.entries());

    const method = editingItem ? "PATCH" : "POST";
    const body = { type: councilView, ...item };
    if (editingItem) (body as any).id = editingItem.id;

    const res = await fetch("/api/admin/council", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (res.ok) {
      toast.success(editingItem ? "Updated successfully" : "Added successfully");
      setShowForm(false);
      setEditingItem(null);
      loadData();
    } else {
      toast.error("Failed to save. Please try again.");
    }
  };

  const deleteCouncilItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this official?")) return;
    const res = await fetch(`/api/admin/council?type=${councilView}&id=${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Deleted successfully");
      loadData();
    }
  };

  const tabs: { id: Tab; label: string; icon: any; count?: number }[] = [
    { id: "mass", label: "Mass Intentions", icon: BookOpen, count: data.mass?.length },
    { id: "petitions", label: "Petitions", icon: Flame, count: data.petitions?.length },
    { id: "announcements", label: "Bulletins", icon: Bell, count: data.announcements?.length },
    { id: "personnel", label: "Personnel CMS", icon: Users },
    { id: "societies", label: "Societies Wiki", icon: Archive },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  if (!authed) {
    return (
      <div className="min-h-screen bg-caritas-dark sacred-bg flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-10 w-full max-w-md shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-caritas-gold/20 border border-caritas-gold/40 flex items-center justify-center mx-auto mb-4">
              <span className="font-cinzel text-caritas-gold text-2xl">✝</span>
            </div>
            <h1 className="font-cinzel text-caritas-dark text-2xl font-bold">Admin Dashboard</h1>
            <p className="font-garamond text-gray-500 italic mt-1">Caritas Catholic Chaplaincy</p>
          </div>
          {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-red-700 font-garamond text-sm">{error}</div>}
          <div className="space-y-4">
            <div>
              <label className="font-cinzel text-xs text-caritas-dark tracking-wider block mb-2 uppercase">Username</label>
              <input value={creds.username} onChange={e => setCreds(c => ({ ...c, username: e.target.value }))}
                className="w-full border border-gray-200 text-caritas-red rounded-sm px-4 py-3 font-garamond focus:outline-none focus:border-caritas-red"
                placeholder="Admin username" />
            </div>
            <div>
              <label className="font-cinzel text-xs text-caritas-dark tracking-wider block mb-2 uppercase">Password</label>
              <input type="password" value={creds.password} onChange={e => setCreds(c => ({ ...c, password: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && login()}
                className="w-full border border-gray-200 text-caritas-red rounded-sm px-4 py-3 font-garamond focus:outline-none focus:border-caritas-red"
                placeholder="Admin password" />
            </div>
            <button onClick={login} className="w-full font-cinzel text-xs text-white bg-caritas-red py-3 rounded-sm hover:bg-caritas-maroon transition-colors tracking-widest uppercase">
              Login to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-caritas-cream pt-0 border-t-4 border-caritas-red">
      <div className="bg-caritas-dark text-white py-4 px-6 flex items-center justify-between fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center gap-3">
          <span className="font-cinzel text-caritas-gold font-bold">✝</span>
          <span className="font-cinzel text-white text-xs tracking-widest uppercase">Caritas Admin CMS</span>
        </div>
        <button onClick={() => { fetch("/api/admin/login", { method: "DELETE" }); setAuthed(false); }}
          className="flex items-center gap-2 font-cinzel text-[10px] text-white/60 hover:text-white transition-colors tracking-widest">
          <LogOut size={12} /> LOGOUT
        </button>
      </div>

      <div className="pt-16 flex min-h-screen">
        <div className="w-64 admin-sidebar text-white min-h-screen pt-10 flex-shrink-0 hidden md:block sacred-bg">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-4 px-8 py-5 text-left transition-all ${tab === t.id ? "bg-caritas-red/40 border-r-4 border-caritas-gold" : "hover:bg-white/5 opacity-60"}`}>
              <t.icon size={18} className={tab === t.id ? "text-caritas-gold" : "text-white"} strokeWidth={1.5} />
              <span className={`font-cinzel text-[10px] tracking-[0.2em] uppercase ${tab === t.id ? "text-caritas-gold font-bold" : "text-white"}`}>{t.label}</span>
              {t.count !== undefined && t.count > 0 && (
                <span className="ml-auto font-cinzel text-[10px] bg-caritas-red text-white rounded-full px-2 py-0.5">{t.count}</span>
              )}
            </button>
          ))}
        </div>

        <div className="flex-1 p-10 max-w-6xl">
          {loading && <div className="text-center py-12"><div className="w-10 h-10 rounded-full border-4 border-caritas-red/10 border-t-caritas-red animate-spin mx-auto" /></div>}

          {tab === "societies" && (
            <div className="space-y-8">
              <div className="flex items-end justify-between border-b border-caritas-gold/20 pb-6">
                <div>
                  <h2 className="font-cinzel text-caritas-dark text-4xl font-bold">Societies Wiki</h2>
                  <p className="font-garamond text-gray-500 italic text-lg mt-2 font-medium uppercase tracking-wider text-xs">Manage detailed historical and social records</p>
                </div>
                <button onClick={() => { setCouncilView("societies"); setEditingItem(null); setShowForm(true); }} className="bg-caritas-dark text-white font-cinzel text-[10px] tracking-widest px-6 py-3 rounded-sm flex items-center gap-2 hover:bg-caritas-red transition-all shadow-lg">
                  <Plus size={14} /> ADD NEW SOCIETY
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.societies?.map((item: any) => (
                  <div key={item.id} className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm flex flex-col group hover:border-caritas-gold/40 transition-all">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 rounded-sm bg-caritas-cream border border-caritas-gold/10 overflow-hidden flex-shrink-0">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-caritas-gold/5 text-caritas-gold text-lg font-cinzel">
                            {item.name[0]}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-cinzel text-caritas-dark font-bold text-sm leading-tight">{item.name}</h4>
                        <p className="font-garamond text-caritas-red text-xs italic font-semibold capitalize">{item.type}</p>
                        <p className="text-[10px] font-garamond text-gray-400 mt-2 line-clamp-2 italic">{item.short_description}</p>
                      </div>
                    </div>
                    <div className="mt-auto pt-4 border-t border-gray-50 flex justify-end gap-2">
                      <button onClick={() => { setCouncilView("societies"); setEditingItem(item); setShowForm(true); }} className="px-4 h-8 rounded-full border border-gray-100 flex items-center gap-2 text-gray-400 hover:bg-caritas-gold/10 hover:text-caritas-gold transition-all font-cinzel text-[10px] tracking-widest uppercase">
                        <Edit size={12} /> Edit Wiki
                      </button>
                      <button onClick={() => { setCouncilView("societies"); deleteCouncilItem(item.id); }} className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"><Trash size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "personnel" && (
            <div className="space-y-8">
              <div className="flex items-end justify-between border-b border-caritas-gold/20 pb-6">
                <div>
                  <h2 className="font-cinzel text-caritas-dark text-4xl font-bold">CMS Manager</h2>
                  <p className="font-garamond text-gray-500 italic text-lg mt-2 font-medium uppercase tracking-wider text-xs">Council, Sacristans & Catechists</p>
                </div>
                <button onClick={() => { setEditingItem(null); setShowForm(true); }} className="bg-caritas-dark text-white font-cinzel text-[10px] tracking-widest px-6 py-3 rounded-sm flex items-center gap-2 hover:bg-caritas-red transition-all shadow-lg">
                  <Plus size={14} /> ADD NEW OFFICIAL
                </button>
              </div>

              <div className="flex gap-4">
                {(["authorities", "executives", "sacristans", "catechists"] as CouncilType[]).map(v => (
                  <button key={v} onClick={() => setCouncilView(v)}
                    className={`font-cinzel text-[10px] tracking-widest px-6 py-3 rounded-sm transition-all border ${councilView === v ? "bg-white border-caritas-gold text-caritas-dark shadow-sm" : "border-gray-200 text-gray-400 hover:border-caritas-gold/40"}`}>
                    {v.toUpperCase()}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data[councilView]?.map((item: any) => (
                  <div key={item.id} className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm flex flex-col group hover:border-caritas-gold/40 transition-all">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full bg-caritas-cream border border-caritas-gold/10 overflow-hidden flex-shrink-0">
                        {item.photo_url ? (
                          <img src={item.photo_url} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-caritas-gold/5 text-caritas-gold">
                            <ImageIcon size={20} strokeWidth={1} />
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-cinzel text-caritas-dark font-bold text-sm leading-tight">{item.name}</h4>
                        <p className="font-garamond text-caritas-red text-xs italic font-semibold">{item.role || item.position}</p>
                        {item.academic_year && <p className="text-[10px] font-cinzel text-gray-400 mt-1">{item.academic_year}</p>}
                      </div>
                    </div>
                    <div className="mt-auto pt-4 border-t border-gray-50 flex justify-end gap-2">
                      <button onClick={() => { setEditingItem(item); setShowForm(true); }} className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-caritas-gold/10 hover:text-caritas-gold transition-all"><Edit size={14} /></button>
                      <button onClick={() => deleteCouncilItem(item.id)} className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"><Trash size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Form Modal */}
          {showForm && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 modal-backdrop">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white w-full max-w-xl p-10 rounded-sm shadow-2xl relative"
              >
                <button onClick={() => setShowForm(false)} className="absolute top-6 right-6 text-gray-400 hover:text-caritas-dark transition-colors"><X size={20} /></button>
                <h3 className="font-cinzel text-2xl font-bold mb-2 uppercase tracking-tight">{editingItem ? "Edit" : "New"} {councilView === "societies" ? "Society" : councilView.slice(0, -1)}</h3>
                <p className="font-garamond text-gray-500 italic mb-8 border-b border-caritas-gold/20 pb-4">Entering sacred details for our church officials.</p>

                <form onSubmit={saveCouncilItem} className="space-y-6 max-h-[70vh] overflow-y-auto px-1 pr-4">
                  <div>
                    <label className="font-cinzel text-[10px] tracking-widest text-caritas-dark block mb-2 uppercase font-bold">Name</label>
                    <input name="name" defaultValue={editingItem?.name} required className="w-full border-b border-gray-200 py-3 font-garamond text-lg focus:outline-none focus:border-caritas-gold transition-colors" placeholder={councilView === "societies" ? "Society Name" : "Official Name"} />
                  </div>

                  {councilView === "societies" ? (
                    <>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="font-cinzel text-[10px] tracking-widest text-caritas-dark block mb-2 uppercase font-bold">Type</label>
                          <select name="type" defaultValue={editingItem?.type || "society"} className="w-full border-b border-gray-200 py-3 font-garamond text-lg focus:outline-none focus:border-caritas-gold bg-transparent">
                            <option value="society">Society</option>
                            <option value="association">Association</option>
                          </select>
                        </div>
                        <div>
                          <label className="font-cinzel text-[10px] tracking-widest text-caritas-dark block mb-2 uppercase font-bold">Meeting Time</label>
                          <input name="meeting_time" defaultValue={editingItem?.meeting_time} className="w-full border-b border-gray-200 py-3 font-garamond text-lg focus:outline-none focus:border-caritas-gold" placeholder="e.g. Sundays 4pm" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="font-cinzel text-[10px] tracking-widest text-caritas-dark block mb-2 uppercase font-bold">Patron Saint</label>
                          <input name="patron_saint" defaultValue={editingItem?.patron_saint} className="w-full border-b border-gray-200 py-3 font-garamond text-lg focus:outline-none focus:border-caritas-gold" placeholder="e.g. St. Anthony" />
                        </div>
                        <div>
                          <label className="font-cinzel text-[10px] tracking-widest text-caritas-dark block mb-2 uppercase font-bold">Image URL</label>
                          <input name="image_url" defaultValue={editingItem?.image_url} className="w-full border-b border-gray-200 py-3 font-garamond text-lg focus:outline-none focus:border-caritas-gold" placeholder="/images/..." />
                        </div>
                      </div>
                      <div>
                        <label className="font-cinzel text-[10px] tracking-widest text-caritas-dark block mb-2 uppercase font-bold">Short Description</label>
                        <textarea name="short_description" defaultValue={editingItem?.short_description} className="w-full border border-gray-100 p-4 font-garamond text-lg focus:outline-none focus:border-caritas-gold h-20 rounded-sm" />
                      </div>
                      <div>
                        <label className="font-cinzel text-[10px] tracking-widest text-caritas-dark block mb-2 uppercase font-bold">History (Detailed)</label>
                        <textarea name="history" defaultValue={editingItem?.history} className="w-full border border-gray-100 p-4 font-garamond text-lg focus:outline-none focus:border-caritas-gold h-32 rounded-sm" />
                      </div>
                      <div>
                        <label className="font-cinzel text-[10px] tracking-widest text-caritas-dark block mb-2 uppercase font-bold">About / Mission</label>
                        <textarea name="about" defaultValue={editingItem?.about} className="w-full border border-gray-100 p-4 font-garamond text-lg focus:outline-none focus:border-caritas-gold h-32 rounded-sm" />
                      </div>
                      <div>
                        <label className="font-cinzel text-[10px] tracking-widest text-caritas-dark block mb-2 uppercase font-bold">Why Join?</label>
                        <textarea name="why_join" defaultValue={editingItem?.why_join} className="w-full border border-gray-100 p-4 font-garamond text-lg focus:outline-none focus:border-caritas-gold h-32 rounded-sm" />
                      </div>
                      <div>
                        <label className="font-cinzel text-[10px] tracking-widest text-caritas-dark block mb-2 uppercase font-bold">Fun Facts</label>
                        <textarea name="fun_facts" defaultValue={editingItem?.fun_facts} className="w-full border border-gray-100 p-4 font-garamond text-lg focus:outline-none focus:border-caritas-gold h-20 rounded-sm" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="font-cinzel text-[10px] tracking-widest text-caritas-dark block mb-2 uppercase font-bold">{councilView === "executives" ? "Position" : "Role"}</label>
                          <input name={councilView === "executives" ? "position" : "role"} defaultValue={editingItem?.position || editingItem?.role} required className="w-full border-b border-gray-200 py-3 font-garamond text-lg focus:outline-none focus:border-caritas-gold transition-colors" placeholder="e.g. President" />
                        </div>
                        {councilView === "executives" && (
                          <div>
                            <label className="font-cinzel text-[10px] tracking-widest text-caritas-dark block mb-2 uppercase font-bold">Academic Year</label>
                            <input name="academic_year" defaultValue={editingItem?.academic_year || "2024/2025"} required className="w-full border-b border-gray-200 py-3 font-garamond text-lg focus:outline-none focus:border-caritas-gold transition-colors" placeholder="2024/2025" />
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="font-cinzel text-[10px] tracking-widest text-caritas-dark block mb-2 uppercase font-bold">{councilView === "executives" ? "Photo URL" : "Photo URL"}</label>
                          <input name={councilView === "executives" ? "photo_url" : "photo_url"} defaultValue={editingItem?.photo_url} className="w-full border-b border-gray-200 py-3 font-garamond text-lg focus:outline-none focus:border-caritas-gold transition-colors" placeholder="https://..." />
                        </div>
                        <div>
                          <label className="font-cinzel text-[10px] tracking-widest text-caritas-dark block mb-2 uppercase font-bold">Phone / Contact</label>
                          <input name="contact" defaultValue={editingItem?.contact} className="w-full border-b border-gray-200 py-3 font-garamond text-lg focus:outline-none focus:border-caritas-gold transition-colors" placeholder="+234..." />
                        </div>
                      </div>

                      <div>
                        <label className="font-cinzel text-[10px] tracking-widest text-caritas-dark block mb-2 uppercase font-bold">Bio / Short Message</label>
                        <textarea name="bio" defaultValue={editingItem?.bio} className="w-full border border-gray-100 p-4 font-garamond text-lg focus:outline-none focus:border-caritas-gold transition-colors h-32 rounded-sm" placeholder="A short inspiring message or bio..." />
                      </div>

                      {councilView === "executives" && (
                        <div className="flex items-center gap-3 py-2">
                          <input type="checkbox" name="is_current" defaultChecked={editingItem?.is_current ?? true} value="true" className="w-4 h-4 accent-caritas-red" />
                          <label className="font-garamond text-gray-600 font-medium">Currently in Office</label>
                        </div>
                      )}
                    </>
                  )}

                  <button className="w-full bg-caritas-dark text-white font-cinzel text-xs tracking-[0.3em] py-5 rounded-sm hover:bg-caritas-red transition-all mt-4 uppercase shadow-xl font-bold">
                    SAVE TO SACRED ARCHIVES
                  </button>
                </form>
              </motion.div>
            </div>
          )}

          {/* Standard Tabs */}
          {tab === "mass" && (
            <div className="space-y-10">
              <h2 className="font-cinzel text-caritas-dark text-4xl font-bold border-b border-caritas-gold/20 pb-6">Mass Intentions</h2>
              {data.mass?.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-sm border border-gray-100 shadow-sm">
                  <p className="font-garamond text-gray-400 italic text-xl">Sanctuary is quiet. No pending intentions.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {data.mass?.map((item: any) => (
                    <div key={item.id} className="bg-white p-8 rounded-sm shadow-sm border-l-4 border-caritas-red hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="font-cinzel text-[10px] px-3 py-1 bg-caritas-rose text-caritas-red font-bold uppercase tracking-widest">{item.type}</span>
                          <span className={`font-cinzel text-[10px] px-3 py-1 font-bold uppercase tracking-widest ${item.payment_status === "paid" ? "bg-green-50 text-green-700" : "bg-orange-50 text-orange-700"}`}>{item.payment_status}</span>
                        </div>
                        <p className="font-playfair text-caritas-dark text-2xl italic mb-3 leading-snug">"{item.intention}"</p>
                        <p className="font-cinzel text-caritas-gold text-[10px] tracking-widest font-bold">
                          {item.is_anonymous ? "SON/DAUGHTER OF GOD" : item.name.toUpperCase()} · ₦{item.amount}
                        </p>
                      </div>
                      <div className="flex gap-4">
                        <button onClick={() => approve("mass_intentions", item.id)} className="w-12 h-12 rounded-full border border-green-100 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition-all shadow-sm"><Check size={20} /></button>
                        <button onClick={() => reject("mass_intentions", item.id)} className="w-12 h-12 rounded-full border border-red-100 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-sm"><X size={20} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "petitions" && (
            <div className="space-y-10">
              <h2 className="font-cinzel text-caritas-dark text-4xl font-bold border-b border-caritas-gold/20 pb-6 uppercase">Prayer Petitions</h2>
              <div className="grid grid-cols-1 gap-6">
                {data.petitions?.map((item: any) => (
                  <div key={item.id} className="bg-white p-8 rounded-sm shadow-sm border-l-4 border-caritas-gold hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex-1">
                      <p className="font-garamond text-caritas-dark text-xl leading-relaxed italic mb-4">"{item.petition}"</p>
                      <p className="font-cinzel text-caritas-dark/40 text-[10px] tracking-widest uppercase font-bold">
                        Submitted by: {item.is_anonymous ? "ANONYMOUS" : item.name.toUpperCase()} · {new Date(item.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <button onClick={() => approve("petitions", item.id)} className="w-12 h-12 rounded-full border border-green-100 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition-all shadow-sm"><Check size={20} /></button>
                      <button onClick={() => reject("petitions", item.id)} className="w-12 h-12 rounded-full border border-red-100 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-sm"><X size={20} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "announcements" && (
            <div className="space-y-10">
              <h2 className="font-cinzel text-caritas-dark text-4xl font-bold border-b border-caritas-gold/20 pb-6 uppercase">Bulletins & Notices</h2>
              <div className="space-y-6">
                {data.announcements?.map((item: any) => (
                  <div key={item.id} className="bg-white p-10 rounded-sm shadow-sm border-t-2 border-caritas-red relative group">
                    <div className="flex items-start justify-between gap-8 mb-6">
                      <h3 className="font-cinzel text-caritas-dark text-2xl font-bold tracking-tight">{item.title}</h3>
                      <div className="flex gap-4">
                        <button onClick={() => approve("announcements", item.id)} className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition-all"><Check size={18} /></button>
                        <button onClick={() => reject("announcements", item.id)} className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all"><X size={18} /></button>
                      </div>
                    </div>
                    <p className="font-garamond text-gray-600 text-xl leading-relaxed mb-8">{item.content}</p>
                    <div className="flex items-center gap-3 pt-6 border-t border-gray-50">
                      <div className="w-8 h-8 rounded-full bg-caritas-dark flex items-center justify-center text-caritas-gold font-cinzel text-xs font-bold">✝</div>
                      <p className="font-cinzel text-[10px] text-gray-400 tracking-[0.2em] font-bold uppercase">{item.submitted_by || "ADMIN OFFICE"} · {new Date(item.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "settings" && (
            <div className="space-y-10">
              <h2 className="font-cinzel text-caritas-dark text-4xl font-bold border-b border-caritas-gold/20 pb-6 uppercase">Sanctuary Controls</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-10 shadow-sm border-l-4 border-caritas-red">
                  <div className="flex items-center gap-4 mb-6">
                    <Settings className="text-caritas-gold" strokeWidth={1} />
                    <h4 className="font-cinzel text-caritas-dark font-bold text-sm tracking-widest uppercase">System Integrity</h4>
                  </div>
                  <ul className="space-y-4 font-garamond text-gray-600 italic">
                    <li>• PWA Manifest: Active</li>
                    <li>• Service Worker: Operational</li>
                    <li>• Database: Connected (Supabase)</li>
                    <li>• Payments: Paystack Integrated</li>
                  </ul>
                </div>
                <div className="bg-caritas-dark p-10 shadow-xl sacred-bg text-white">
                  <h4 className="font-cinzel text-caritas-gold font-bold text-sm tracking-widest uppercase mb-6">Key Infrastructure</h4>
                  <div className="space-y-4 opacity-70">
                    <p className="font-cinzel text-[10px] tracking-widest">GEMINI AI: CONNECTED</p>
                    <p className="font-cinzel text-[10px] tracking-widest">LITURGICAL API: UNIVERSALIS</p>
                    <p className="font-cinzel text-[10px] tracking-widest">SOCIETIES: 15+ ACTIVE</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
