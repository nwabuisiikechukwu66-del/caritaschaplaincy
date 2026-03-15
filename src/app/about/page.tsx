export default function AboutPage() {
  return (
    <div className="pt-20">
      <section className="red-section sacred-bg py-24 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-px bg-caritas-gold/60" />
            <span className="font-cinzel text-caritas-gold text-xs tracking-widest">Our Story</span>
            <div className="w-12 h-px bg-caritas-gold/60" />
          </div>
          <h1 className="font-cinzel text-white text-5xl font-bold mb-6">About the Chaplaincy</h1>
          <p className="font-garamond text-white/70 text-xl italic max-w-2xl mx-auto">
            Rooted in the spirituality of Jesus the Saviour — a community of faith, prayer, and service.
          </p>
        </div>
      </section>
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 space-y-12">
          <div>
            <h2 className="font-cinzel text-caritas-dark text-3xl font-bold mb-6">Our Founder&apos;s Vision</h2>
            <div className="scripture pl-6 py-4 mb-6">
              <p className="font-playfair text-caritas-dark text-xl italic">"Jesus is the Saviour of every human person."</p>
              <p className="font-cinzel text-caritas-gold text-xs mt-2 tracking-wider">— Fr. Prof. Emmanuel Edeh</p>
            </div>
            <div className="font-garamond text-gray-600 text-lg leading-relaxed space-y-4">
              <p>The Caritas Catholic Chaplaincy is the spiritual heartbeat of Caritas University, founded by <strong>Very Rev. Fr. Prof. Emmanuel Matthew Paul Edeh</strong> — priest, philosopher, theologian, and champion of human dignity.</p>
              <p>Fr. Edeh founded the <strong>Jesus the Saviour Congregation</strong> (Saviourites), whose charism permeates every institution he built: Caritas University, Madonna University (Elele, Okija, Akpugo), and OSISATECH Polytechnic. At the heart is one conviction: <em>Jesus Christ is the Saviour of all humanity.</em></p>
              <p>The Pilgrimage Centre of Eucharistic Adoration in Elele, Rivers State draws thousands annually through the healing power of Eucharistic prayer.</p>
            </div>
          </div>
          <div className="gold-divider" />
          <div>
            <h2 className="font-cinzel text-caritas-dark text-3xl font-bold mb-6">Our Spiritual Identity</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Jesus the Saviour", desc: "Every activity flows from the conviction that Jesus Christ is the personal Saviour of each soul.", icon: "✝" },
                { title: "Eucharistic Centre", desc: "The Holy Mass and Adoration of the Blessed Sacrament are the source and summit of our communal life.", icon: "🕯️" },
                { title: "Marian Devotion", desc: "Through Our Lady and the Rosary, we are led more deeply to her Son, Jesus the Saviour.", icon: "✦" },
              ].map(item => (
                <div key={item.title} className="holy-card bg-caritas-cream rounded-lg p-6">
                  <div className="w-12 h-12 rounded-full bg-caritas-red/10 flex items-center justify-center mb-4">
                    <span className="text-caritas-red text-xl">{item.icon}</span>
                  </div>
                  <h3 className="font-cinzel text-caritas-dark font-bold mb-3">{item.title}</h3>
                  <p className="font-garamond text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="gold-divider" />
          <div className="bg-caritas-dark rounded-lg p-8 text-white sacred-bg">
            <h2 className="font-cinzel text-caritas-gold text-xl mb-6">Location & Contact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-garamond text-white/70">
              <div><strong className="text-white font-cinzel text-sm">Address</strong><br />Caritas University<br />Amorji-Nike, Enugu State, Nigeria</div>
              <div><strong className="text-white font-cinzel text-sm">Chaplain</strong><br />Rev. Fr. Davison Odoviro<br />University Chaplain</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
