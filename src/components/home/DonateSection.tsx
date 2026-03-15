"use client";
import Link from "next/link";

const donationItems = [
  { name: "Altar Candles", icon: "🕯️", verse: "Your word is a lamp to my feet — Ps 119:105" },
  { name: "Missals & Hymnals", icon: "📖", verse: "Let the word of Christ dwell in you richly — Col 3:16" },
  { name: "Priest Vestments", icon: "🎽", verse: "Clothe yourselves with love — Col 3:14" },
  { name: "Student Welfare", icon: "🎓", verse: "Whatever you did for the least of these — Matt 25:40" },
  { name: "Chapel Renovation", icon: "⛪", verse: "How lovely is your dwelling place, O LORD — Ps 84:1" },
  { name: "Charity Outreach", icon: "🤲", verse: "Whoever is kind to the poor lends to the LORD — Prov 19:17" },
];

export default function DonateSection() {
  return (
    <section className="py-24 bg-caritas-dark sacred-bg relative overflow-hidden">
      {/* Large cross bg */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
        <span className="text-caritas-gold/5 font-cinzel" style={{ fontSize: "40rem" }}>✝</span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-px bg-caritas-gold/60" />
            <span className="font-cinzel text-caritas-gold text-xs tracking-widest uppercase">Support the Mission</span>
            <div className="w-12 h-px bg-caritas-gold/60" />
          </div>
          <h2 className="font-cinzel text-white text-4xl font-bold mb-4">Extend the Kingdom of God</h2>
          <p className="font-garamond text-white/50 text-xl italic max-w-2xl mx-auto">
            "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver." — 2 Corinthians 9:7
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {donationItems.map((item) => (
            <Link key={item.name} href="/donations"
              className="bg-white/5 border border-white/10 hover:border-caritas-gold/40 hover:bg-white/10 rounded-lg p-5 text-center transition-all group">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{item.icon}</div>
              <p className="font-cinzel text-white text-xs font-bold mb-2 leading-tight">{item.name}</p>
              <p className="font-garamond text-white/30 text-xs italic leading-tight line-clamp-2">{item.verse}</p>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link href="/donations"
            className="inline-block font-cinzel text-sm text-caritas-dark bg-caritas-gold px-10 py-4 rounded-sm hover:bg-yellow-400 transition-colors tracking-widest font-bold shadow-lg shadow-caritas-gold/20">
            DONATE NOW
          </Link>
          <p className="font-garamond text-white/30 text-sm mt-4 italic">
            Every gift, no matter the size, advances the Gospel
          </p>
        </div>
      </div>
    </section>
  );
}
