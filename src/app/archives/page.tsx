import Link from "next/link";

export default function ArchivesPage() {
  return (
    <div className="pt-20">
      <section className="red-section sacred-bg py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-3 mb-4"><div className="w-12 h-px bg-caritas-gold/60" /><span className="font-cinzel text-caritas-gold text-xs tracking-widest">Our History</span><div className="w-12 h-px bg-caritas-gold/60" /></div>
          <h1 className="font-cinzel text-white text-5xl font-bold mb-4">Archives</h1>
          <p className="font-garamond text-white/70 text-xl italic">A living record of those who served the chaplaincy</p>
        </div>
      </section>
      <section className="py-16 bg-caritas-cream">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[{ href: "/archives/council", label: "Past Council Executives", desc: "Historical record of all past church council executive members" },
              { href: "/archives/officials", label: "Past Sacristans & Catechists", desc: "Archive of past sacristans and catechists who served the altar" },
              { href: "/societies", label: "Society Leaders Archive", desc: "Past leaders of all 17 associations and societies" }].map(item => (
              <Link key={item.href} href={item.href} className="holy-card bg-white rounded-xl p-8 shadow-sm text-center group">
                <div className="w-12 h-12 rounded-full bg-caritas-red/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-caritas-red text-xl">📋</span>
                </div>
                <h3 className="font-cinzel text-caritas-dark font-bold mb-2 group-hover:text-caritas-red transition-colors">{item.label}</h3>
                <p className="font-garamond text-gray-500 text-sm">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
