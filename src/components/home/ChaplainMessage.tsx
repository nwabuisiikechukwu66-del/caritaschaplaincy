"use client";
import { motion } from "framer-motion";

export default function ChaplainMessage() {
  return (
    <section className="py-32 bg-caritas-cream sacred-bg relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Photo Container */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative group">
              {/* Ornate Frame */}
              <div className="absolute -inset-4 border border-caritas-gold/10 rounded-sm translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform duration-700" />
              <div className="relative z-10 bg-white p-4 shadow-2xl rounded-sm">
                <div className="aspect-[3/4] overflow-hidden bg-caritas-dark relative">
                  <img
                    src="/images/davison odoviro.png"
                    alt="Rev. Fr. Davison Odoviro"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-caritas-dark/40 to-transparent" />
                </div>
                {/* Caption below photo as requested for a 'human' feel */}
                <div className="mt-6 text-center">
                  <h3 className="font-cinzel text-caritas-dark font-bold text-sm tracking-widest uppercase">Rev. Fr. Davison Odoviro</h3>
                  <p className="font-garamond text-caritas-red text-sm italic mt-1 font-medium">University Chaplain</p>
                </div>
              </div>
              {/* Decorative cross or symbol */}
              <div className="absolute -top-8 -right-8 w-16 h-16 border border-caritas-gold/20 rounded-full flex items-center justify-center bg-caritas-cream z-20">
                <span className="font-cinzel text-caritas-gold text-2xl">✝</span>
              </div>
            </div>
          </motion.div>

          {/* Message Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-4 mb-8">
              <div className="w-10 h-px bg-caritas-gold/40" />
              <span className="font-cinzel text-caritas-gold text-xs tracking-[0.3em] uppercase">Chaplain's Heart</span>
            </div>

            <h2 className="font-cinzel text-caritas-cream text-4xl md:text-5xl font-bold leading-tight mb-8">
              Welcome to the Heart of<br />
              <span className="text-caritas-red underline decoration-caritas-gold/20 underline-offset-8">Our Spiritual Home</span>
            </h2>

            <div className="scripture pl-8 py-4 mb-10 border-l-2 border-caritas-gold/30">
              <p className="font-playfair text-caritas-dark text-2xl italic leading-relaxed text-gray-600">
                "Come to me, all you who are weary and burdened, and I will give you rest."
              </p>
              <p className="font-cinzel text-caritas-gold text-xs mt-4 tracking-[0.2em] font-bold">— MATTHEW 11:28</p>
            </div>

            <div className="space-y-6 font-garamond text-gray-600 text-xl leading-relaxed">
              <p>
                Beloved in Christ, students, and faculty of Caritas University — you have found more than just a place of study; you have found a sanctuary. Inspired by the vision of our founder, <span className="text-caritas-cream font-semibold">Very Rev. Fr. Prof. Emmanuel Matthew Paul Edeh</span>, our chaplaincy remains a beacon of hope.
              </p>
              <p>
                The foundation of our faith rests on a simple, transformative truth: <span className="italic">Jesus is the Saviour</span>. This truth is the heartbeat of our campus, inviting you to encounter His mercy in every Mass, through every society, and in the quiet of your own prayers.
              </p>
              <p>
                We are a community of disciples, saints-in-the-making, and friends. I invite you to join us on this sacred journey. Let this be your home away from home.
              </p>
            </div>

            <div className="mt-12 pt-8 border-t border-caritas-gold/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border border-caritas-gold/20 flex items-center justify-center">
                  <span className="font-cinzel text-caritas-gold text-xl">✦</span>
                </div>
                <div>
                  <p className="font-cinzel text-caritas-cream text-sm font-bold tracking-widest uppercase">In Caritas & Spirit,</p>
                  <p className="font-garamond text-caritas-red text-base italic font-semibold">Fr. Davison Odoviro</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
