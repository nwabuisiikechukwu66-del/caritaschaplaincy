import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-caritas-dark sacred-bg">
      <div className="gold-divider" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-caritas-gold/20 rounded-full flex items-center justify-center border border-caritas-gold/40">
                <span className="text-caritas-gold text-xl font-cinzel font-bold">✝</span>
              </div>
              <div>
                <p className="font-cinzel text-white font-bold">CARITAS</p>
                <p className="font-garamond text-caritas-gold/80 text-sm">Catholic Chaplaincy</p>
              </div>
            </div>
            <p className="font-garamond text-white/50 text-sm leading-relaxed italic">
              "For God so loved the world that he gave his only Son." — John 3:16
            </p>
            <p className="font-garamond text-white/40 text-xs mt-4">
              Caritas University, Amorji-Nike, Enugu State, Nigeria
            </p>
          </div>

          {/* Chaplaincy */}
          <div>
            <h3 className="font-cinzel text-caritas-gold text-xs tracking-widest mb-6 uppercase">Chaplaincy</h3>
            <ul className="space-y-3">
              {[["About Us", "/about"], ["Church Hierarchy", "/hierarchy"], ["Council Executives", "/council"], ["Sacristans & Catechists", "/officials"], ["Associations & Societies", "/societies"]].map(([label, href]) => (
                <li key={href}><Link href={href} className="font-garamond text-white/50 hover:text-caritas-gold text-sm transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-cinzel text-caritas-gold text-xs tracking-widest mb-6 uppercase">Spiritual Services</h3>
            <ul className="space-y-3">
              {[["Mass Intentions", "/mass-intentions"], ["Thanksgiving", "/thanksgiving"], ["Petitions", "/petitions"], ["Daily Readings", "/readings"], ["Saint of the Day", "/saints"], ["Catholic Doctrines", "/doctrines"], ["Order of Mass", "/order-of-mass"]].map(([label, href]) => (
                <li key={href}><Link href={href} className="font-garamond text-white/50 hover:text-caritas-gold text-sm transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Mass Times */}
          <div>
            <h3 className="font-cinzel text-caritas-gold text-xs tracking-widest mb-6 uppercase">Mass Schedule</h3>
            <ul className="space-y-2 font-garamond text-sm">
              {[
                ["Lauds", "5:30 AM"],
                ["Morning Mass", "6:00 AM"],
                ["Sunday Mass", "8:00 AM (Auditorium)"],
                ["Afternoon Mass", "3:00 PM (Fathers' Chapel)"],
                ["Rosary & Vespers", "6:00 PM"],
                ["Adoration", "Wed 5:30 PM (Auditorium)"],
                ["Benediction", "Sundays 5:30 PM"],
                ["Confession", "Saturdays 7:00 PM"],
              ].map(([label, time]) => (
                <li key={label} className="flex justify-between gap-4">
                  <span className="text-white/50">{label}</span>
                  <span className="text-caritas-gold/70 text-right">{time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="gold-divider my-10" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 w-full">
            <p className="font-garamond text-white/50 text-sm">
              © {new Date().getFullYear()} Caritas Catholic Chaplaincy. All rights reserved.
            </p>
            <div className="flex items-center gap-1 font-garamond text-white/40 text-sm shadow-sm group">
              <span>Built by</span>
              <a href="https://frankoge.com" target="_blank" rel="noopener noreferrer" className="text-caritas-gold/60 hover:text-caritas-gold transition-colors font-bold">Frank Oge</a>
              <span>at <span className="text-white/60">Hackverse Software Solutions</span></span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
