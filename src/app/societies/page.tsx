import Link from "next/link";
import { supabase } from "@/lib/supabase";

async function getSocieties() {
  const { data } = await supabase.from("societies").select("*").order("order_rank");
  return data || [];
}

export default async function SocietiesPage() {
  const societies = await getSocieties().catch(() => []);
  const associations = societies.filter((s: any) => s.type === "association");
  const pious = societies.filter((s: any) => s.type === "society");

  const defaultList = [
    { id: "1", name: "Altar Knights", type: "association", short_description: "Serving the altar with devotion and discipline in the sacred liturgy.", color_code: "#8B0000" },
    { id: "2", name: "Altar Decorators", type: "association", short_description: "Beautifying the sanctuary for liturgical celebrations.", color_code: "#C8102E" },
    { id: "3", name: "Caritas Central Choir", type: "association", short_description: "Lifting hearts to God through sacred music and liturgical chant.", color_code: "#D4AF37" },
    { id: "4", name: "Church Wardens", type: "association", short_description: "Maintaining order, reverence and hospitality within the sacred space.", color_code: "#600000" },
    { id: "5", name: "Board of Lectors", type: "association", short_description: "Proclaiming the living Word of God during the liturgy.", color_code: "#8B0000" },
    { id: "6", name: "Mary Queen of All Hearts", type: "society", short_description: "Consecrating hearts to Jesus through Mary, per Saint Louis de Montfort.", color_code: "#FFFFFF" },
    { id: "7", name: "Jesus the Saviour Society", type: "society", short_description: "Living the charism of Fr. Edeh — proclaiming Jesus as the Saviour.", color_code: "#C8102E" },
    { id: "8", name: "Saint Anthony of Padua Society", type: "society", short_description: "Devoted to prayer, charity and evangelization under the Hammer of Heretics.", color_code: "#8B0000" },
    { id: "9", name: "Mother of Perpetual Help", type: "society", short_description: "Entrusted to Our Lady of Perpetual Help for all needs.", color_code: "#D4AF37" },
    { id: "10", name: "Sacred Hearts Society", type: "society", short_description: "Devoted to the Sacred Heart of Jesus and Immaculate Heart of Mary.", color_code: "#C8102E" },
    { id: "11", name: "Rosarian Family", type: "society", short_description: "Praying the Rosary as a weapon of spiritual warfare and contemplation.", color_code: "#FFFFFF" },
    { id: "12", name: "Legion of Mary", type: "society", short_description: "The largest apostolic organization in the Church, serving in Mary's name.", color_code: "#8B0000" },
    { id: "13", name: "Infant Jesus Society", type: "society", short_description: "Venerating the Child Jesus with childlike faith and simplicity.", color_code: "#D4AF37" },
    { id: "14", name: "Two Hearts Society", type: "society", short_description: "United devotion to the Sacred Heart and Immaculate Heart.", color_code: "#C8102E" },
    { id: "15", name: "Charismatic Renewal", type: "society", short_description: "Experiencing the gifts of the Holy Spirit through praise and evangelization.", color_code: "#8B0000" },
    { id: "16", name: "Precious Blood of Jesus", type: "society", short_description: "Meditating on the redeeming Blood of Christ, the price of our salvation.", color_code: "#C8102E" },
    { id: "17", name: "Divine Mercy Society", type: "society", short_description: "Spreading the message of God's infinite mercy through Saint Faustina.", color_code: "#D4AF37" },
  ];

  const displayAssoc = associations.length > 0 ? associations : defaultList.filter(s => s.type === "association");
  const displayPious = pious.length > 0 ? pious : defaultList.filter(s => s.type === "society");

  const SocietyCard = ({ s }: { s: any }) => (
    <Link href={`/societies/${s.id || s.name?.toLowerCase().replace(/\s+/g, '-')}`}
      className="holy-card bg-white rounded-xl p-6 shadow-sm group block">
      <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
        style={{ backgroundColor: `${s.color_code === "#FFFFFF" ? "#FAF8F5" : (s.color_code || "#8B0000") + "20"}`, border: `1px solid ${(s.color_code || "#8B0000") + "40"}` }}>
        <span className="font-cinzel text-xl" style={{ color: s.color_code === "#FFFFFF" ? "#8B0000" : (s.color_code || "#8B0000") }}>✝</span>
      </div>
      <h3 className="font-cinzel text-caritas-dark text-sm font-bold text-center leading-tight mb-2 group-hover:text-caritas-red transition-colors">{s.name}</h3>
      <p className="font-garamond text-gray-500 text-sm text-center leading-relaxed line-clamp-2">{s.short_description}</p>
      <p className="font-cinzel text-caritas-red text-xs text-center mt-3 tracking-wider group-hover:underline">Learn More</p>
    </Link>
  );

  return (
    <div className="pt-20">
      <section className="red-section sacred-bg py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-px bg-caritas-gold/60" />
            <span className="font-cinzel text-caritas-gold text-xs tracking-widest">Schools of Holiness</span>
            <div className="w-12 h-px bg-caritas-gold/60" />
          </div>
          <h1 className="font-cinzel text-white text-5xl font-bold mb-4">Associations & Societies</h1>
          <p className="font-garamond text-white/70 text-xl italic max-w-2xl mx-auto">
            17 vibrant communities of faith, prayer, and service — each a unique path to holiness open to every Catholic.
          </p>
        </div>
      </section>

      <section className="py-16 bg-caritas-cream">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-8">
              <span className="font-cinzel text-xs tracking-widest bg-caritas-dark text-white px-4 py-1.5 rounded-sm uppercase">Associations</span>
              <div className="flex-1 h-px bg-caritas-red/20" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
              {displayAssoc.map((s: any) => <SocietyCard key={s.id || s.name} s={s} />)}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-8">
              <span className="font-cinzel text-xs tracking-widest bg-caritas-gold text-caritas-dark px-4 py-1.5 rounded-sm uppercase">Pious Societies</span>
              <div className="flex-1 h-px bg-caritas-gold/30" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
              {displayPious.map((s: any) => <SocietyCard key={s.id || s.name} s={s} />)}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
