"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  { image: "/images/jesus christ.png", quote: "I am the way, the truth, and the life.", ref: "John 14:6" },
  { image: "/images/saint peter.png", quote: "Come to me, all you who are weary and burdened, and I will give you rest.", ref: "Matthew 11:28" },
  { image: "/images/fr_edeh.png", quote: "Where two or three are gathered in my name, there am I with them.", ref: "Matthew 18:20" },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setCurrent(prev => (prev + 1) % slides.length), 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-[100vh] flex flex-col items-center justify-center overflow-hidden bg-caritas-dark">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 2.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img
            src={slides[current].image}
            alt="Sacred Image"
            className="w-full h-full object-cover opacity-50"
          />
          {/* Subtle natural vignette instead of AI gradients */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.6)_100%)]" />
          <div className="absolute inset-0 bg-black/30" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-px bg-caritas-gold/40" />
            <span className="font-cinzel text-caritas-gold text-xs tracking-widest uppercase">Caritas University · Enugu</span>
            <div className="w-12 h-px bg-caritas-gold/40" />
          </div>

          <h1 className="font-cinzel text-white text-6xl md:text-8xl font-bold leading-tight mb-2 tracking-tight">
            Caritas
          </h1>
          <h2 className="font-cinzel text-caritas-gold text-2xl md:text-4xl font-light tracking-[0.3em] mb-12 uppercase">
            Catholic Chaplaincy
          </h2>

          <div className="max-w-2xl mx-auto mb-16 px-10 py-10 border border-caritas-gold/10 bg-black/40 backdrop-blur-md relative">
            {/* Corner Ornaments */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-caritas-gold/40" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-caritas-gold/40" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-caritas-gold/40" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-caritas-gold/40" />

            <motion.p
              key={`q-${current}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="font-playfair text-white text-2xl md:text-3xl italic leading-relaxed mb-4"
            >
              "{slides[current].quote}"
            </motion.p>
            <motion.p
              key={`r-${current}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="font-cinzel text-caritas-gold/60 text-xs tracking-widest"
            >
              {slides[current].ref}
            </motion.p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {[
              { href: "/mass-intentions", label: "Mass Intentions", primary: true },
              { href: "/petitions", label: "PRAYER PETITION", primary: false },
              { href: "/societies", label: "CHURCH SOCIETIES", primary: false },
            ].map((btn) => (
              <Link
                key={btn.href}
                href={btn.href}
                className={`font-cinzel text-[10px] tracking-[0.2em] px-8 py-4 uppercase transition-all duration-500 rounded-sm ${btn.primary
                  ? "bg-caritas-gold text-caritas-dark hover:bg-white"
                  : "border border-white/20 text-white hover:bg-white hover:text-caritas-dark"
                  }`}
              >
                {btn.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-caritas-gold/30 animate-bounce">
        <ChevronDown size={32} strokeWidth={1} />
      </div>
    </section>
  );
}
