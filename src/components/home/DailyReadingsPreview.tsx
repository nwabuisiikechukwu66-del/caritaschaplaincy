"use client";
import Link from "next/link";
import { BookOpen, Star, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Props {
  reading?: { first_reading?: string; gospel?: string; saint?: string; saint_description?: string };
}

export default function DailyReadingsPreview({ reading: initialReading }: Props) {
  const [reading, setReading] = useState(initialReading);
  const [loading, setLoading] = useState(!initialReading);
  const [today, setToday] = useState("");

  useEffect(() => {
    setToday(new Date().toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long", year: "numeric" }));
    if (!initialReading) {
      const fetchData = async () => {
        try {
          const [rRes, sRes] = await Promise.all([
            fetch("/api/readings"),
            fetch("/api/saints")
          ]);
          const rData = rRes.ok ? await rRes.json() : null;
          const sData = sRes.ok ? await sRes.json() : null;

          setReading({
            first_reading: rData?.first_reading?.text || "Reading unavailable. Please check full details on the readings page.",
            gospel: rData?.gospel?.text || "Gospel unavailable.",
            saint: sData?.name || "Saints of the Day",
            saint_description: sData?.short_bio || sData?.story || "Saint information could not be loaded directly."
          });
        } catch (e) {
          console.error("Failed to load readings", e);
        } finally {
          setLoading(false);
        }
      }
      fetchData();
    }
  }, [initialReading]);

  return (
    <section className="py-32 bg-caritas-cream sacred-bg border-t border-caritas-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-4 mb-4">
            <div className="w-16 h-px bg-caritas-gold/40" />
            <span className="font-cinzel text-caritas-gold text-xs tracking-[0.3em] uppercase">Spiritual Nourishment</span>
            <div className="w-16 h-px bg-caritas-gold/40" />
          </div>
          <h2 className="font-cinzel text-caritas-cream text-4xl md:text-5xl font-bold">Word & Saints</h2>
          <p className="font-garamond text-gray-500 text-lg mt-6 italic">{today}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Daily Readings card */}
          <div className="bg-caritas-dark p-10 text-white relative overflow-hidden red-section">
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-10">
                <BookOpen size={20} className="text-caritas-gold" strokeWidth={1} />
                <h3 className="font-cinzel text-white text-sm tracking-widest uppercase font-bold">Today's Holy Readings</h3>
              </div>

              {loading ? (
                <div className="py-12 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full border-2 border-caritas-gold/20 border-t-caritas-gold animate-spin mb-4" />
                  <p className="font-garamond text-white/40 italic">Revealing the Word...</p>
                </div>
              ) : reading?.first_reading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-8"
                >
                  <div className="group">
                    <p className="font-cinzel text-caritas-gold text-[10px] tracking-[0.3em] mb-4 opacity-70">FIRST READING</p>
                    <div className="font-garamond text-white/90 text-lg leading-relaxed line-clamp-6 italic group-hover:text-white transition-colors prose-invert" dangerouslySetInnerHTML={{ __html: reading.first_reading || "" }} />
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-caritas-gold/20 to-transparent w-full" />
                  <div className="group">
                    <p className="font-cinzel text-caritas-gold text-[10px] tracking-[0.3em] mb-4 opacity-70">HOLY GOSPEL</p>
                    <div className="font-garamond text-white/90 text-lg leading-relaxed line-clamp-6 italic group-hover:text-white transition-colors prose-invert" dangerouslySetInnerHTML={{ __html: reading.gospel || "" }} />
                  </div>
                </motion.div>
              ) : (
                <div className="py-12 text-center">
                  <p className="font-garamond text-white/40 text-lg italic">Please visit the full readings page for today's reflection.</p>
                </div>
              )}

              <Link href="/readings"
                className="mt-12 inline-flex items-center gap-3 font-cinzel text-xs text-caritas-gold border border-caritas-gold/30 px-8 py-3 rounded-sm hover:bg-caritas-gold hover:text-caritas-dark transition-all tracking-[0.2em] uppercase group">
                Full Reflection
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Saint of the Day */}
          <div className="bg-white border border-caritas-gold/10 p-10 relative holy-card">
            <div className="flex items-center gap-4 mb-10">
              <Star size={20} className="text-caritas-gold" strokeWidth={1} />
              <h3 className="font-cinzel text-caritas-dark text-sm tracking-widest uppercase font-bold">Saint of the Day</h3>
            </div>

            {loading ? (
              <div className="py-12 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full border-2 border-caritas-red/20 border-t-caritas-red animate-spin mb-4" />
                <p className="font-garamond text-gray-400 italic">Interceding with the Saints...</p>
              </div>
            ) : reading?.saint ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="w-20 h-20 rounded-full border border-caritas-gold/20 flex items-center justify-center mx-auto mb-8 relative">
                  <span className="font-cinzel text-caritas-gold text-2xl">✝</span>
                  <div className="absolute inset-0 rounded-full border-4 border-caritas-gold/5 animate-pulse" />
                </div>
                <h4 className="font-cinzel text-caritas-dark text-center font-bold text-xl mb-4 tracking-wide underline underline-offset-8 decoration-caritas-gold/30">{reading.saint}</h4>
                <div className="font-garamond text-gray-600 text-lg leading-relaxed line-clamp-[10] text-center italic px-4" dangerouslySetInnerHTML={{ __html: reading.saint_description || "" }} />
              </motion.div>
            ) : (
              <div className="py-12 text-center">
                <div className="w-24 h-24 rounded-full border border-caritas-gold/10 flex items-center justify-center mx-auto mb-8">
                  <Star size={32} className="text-caritas-gold/20" />
                </div>
                <p className="font-garamond text-gray-400 leading-relaxed italic">
                  Explore the lives of those who walked before us in faith.
                </p>
              </div>
            )}

            <div className="mt-12 text-center">
              <Link href="/saints"
                className="inline-flex items-center gap-3 font-cinzel text-xs text-caritas-red border border-caritas-red/20 px-8 py-3 rounded-sm hover:bg-caritas-red hover:text-white transition-all tracking-[0.2em] uppercase group">
                Saintly Wisdom
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
