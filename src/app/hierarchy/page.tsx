import { supabase } from "@/lib/supabase";

async function getHierarchy() {
  const { data } = await supabase.from("hierarchy").select("*").eq("is_active", true).order("order_rank");
  return data || [];
}

const fallback = [
  { name: "Jesus Christ", role: "Head of the Holy Catholic Church", description: "The King of Kings and eternal High Priest who founded the Church through His apostles.", image_url: "/images/jesus christ.png", order_rank: 1 },
  { name: "Saint Peter", role: "First Pope & Prince of Apostles", description: "Chosen by Christ as the rock upon which the Church is built. First Bishop of Rome.", image_url: "/images/saint peter.png", order_rank: 2 },
  { name: "Pope Leo XIV", role: "Supreme Pontiff", description: "The 267th Pope of the Catholic Church, leading the universal Church with spiritual authority.", image_url: "/images/pope leo xiv.png", order_rank: 3 },
  { name: "Archbishop Michael Crotty", role: "Apostolic Nuncio to Nigeria", description: "Official diplomatic representative of the Holy See to Nigeria.", image_url: "/images/micheal crotty.png", order_rank: 4 },
  { name: "Archbishop Valerian Okeke", role: "Metropolitan Archbishop of Onitsha", description: "Head of the Metropolitan Province of Onitsha, which encompasses Enugu Diocese.", image_url: "/images/valerian okeke.png", order_rank: 5 },
  { name: "Bishop Callistus Onaga", role: "Bishop of Enugu Diocese", description: "Diocesan Bishop of Enugu under whose pastoral care Caritas Chaplaincy operates.", image_url: "/images/callistus onaga.png", order_rank: 6 },
  { name: "Bishop Ernest Obodo", role: "Auxiliary Bishop of Enugu", description: "Auxiliary Bishop assisting in the governance of the Diocese of Enugu.", image_url: "/images/ernest obodo.png", order_rank: 7 },
  { name: "Fr. Prof. Emmanuel Matthew Paul Edeh", role: "Founder — Jesus the Saviour Congregation", description: "Priest, philosopher, and founder of Caritas University, Madonna University, OSISATECH, and the Saviourite Congregation.", image_url: "/images/fr_edeh.png", order_rank: 8 },
  { name: "Fr. Davison Odoviro", role: "Chaplain, Caritas University", description: "Current chaplain responsible for the spiritual welfare of the entire university community.", image_url: "/images/davison odoviro.png", order_rank: 9 },
];

export default async function HierarchyPage() {
  const hierarchy = await getHierarchy().catch(() => []);
  const list = hierarchy.length > 0 ? hierarchy : fallback;

  return (
    <div className="pt-20">
      <section className="red-section sacred-bg py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-px bg-caritas-gold/60" />
            <span className="font-cinzel text-caritas-gold text-xs tracking-widest">Apostolic Succession</span>
            <div className="w-12 h-px bg-caritas-gold/60" />
          </div>
          <h1 className="font-cinzel text-white text-5xl font-bold mb-4">Church Hierarchy</h1>
          <p className="font-garamond text-white/70 text-xl italic max-w-2xl mx-auto">
            From Christ to our campus — a living chain of apostolic authority preserved through the centuries
          </p>
        </div>
      </section>

      <section className="py-16 bg-caritas-cream">
        <div className="max-w-3xl mx-auto px-4">
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-caritas-gold via-caritas-red to-caritas-maroon" />
            <div className="space-y-8">
              {(list as any[]).map((person, i) => (
                <div key={person.name} className="flex items-start gap-6 pl-2">
                  {/* Number node */}
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-caritas-red to-caritas-maroon flex items-center justify-center border-2 border-caritas-gold/50 shadow-lg z-10 relative">
                      <span className="font-cinzel text-white text-xs font-bold">{i + 1}</span>
                    </div>
                  </div>
                  {/* Card */}
                  <div className="holy-card bg-white rounded-xl p-6 shadow-sm flex-1 mb-2">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-caritas-red/20 to-caritas-maroon/20 flex items-center justify-center flex-shrink-0 border border-caritas-gold/20">
                        {person.image_url ? (
                          <img src={person.image_url} alt={person.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <span className="font-cinzel text-caritas-red text-lg">{i === 0 ? "✝" : i === 1 ? "🔑" : "✦"}</span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-cinzel text-caritas-dark font-bold text-base">{person.name}</h3>
                        <p className="font-garamond text-caritas-red italic text-sm mt-0.5">{person.role}</p>
                        {person.description && <p className="font-garamond text-gray-600 text-sm leading-relaxed mt-3">{person.description}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
