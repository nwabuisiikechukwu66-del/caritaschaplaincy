"use client";
import Link from "next/link";
import { ChevronRight, BookOpen } from "lucide-react";
import { formatDate, formatNaira } from "@/lib/utils";

interface Intention {
  id: string;
  name: string;
  is_anonymous: boolean;
  intention: string;
  intention_date: string;
  type: string;
}

export default function MassIntentionsPreview({ intentions }: { intentions: Intention[] }) {
  return (
    <section className="py-20 bg-caritas-cream sacred-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Mass Intentions */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <BookOpen size={22} className="text-caritas-red" />
              <div>
                <h2 className="font-cinzel text-caritas-cream text-2xl font-bold">Mass Intentions</h2>
                <p className="font-garamond text-gray-500 text-sm italic">Called during Holy Mass · ₦100</p>
              </div>
            </div>

            <div className="space-y-4">
              {intentions.filter(i => i.type === "intention").slice(0, 4).map((item) => (
                <div key={item.id} className="bg-white rounded-lg p-5 border-l-4 border-caritas-red/60 shadow-sm">
                  <p className="font-cinzel text-caritas-dark text-sm font-semibold mb-1">
                    {item.is_anonymous ? "Anonymous" : item.name}
                  </p>
                  <p className="font-garamond text-gray-600 leading-relaxed">{item.intention}</p>
                  <p className="font-cinzel text-caritas-gold text-xs mt-3 tracking-wider">
                    {formatDate(item.intention_date)}
                  </p>
                </div>
              ))}
              {intentions.filter(i => i.type === "intention").length === 0 && (
                <div className="text-center py-10 border border-dashed border-gray-200 rounded-lg">
                  <p className="font-garamond text-gray-400 italic">No intentions today. Be the first to book!</p>
                </div>
              )}
            </div>

            <div className="flex gap-4 mt-6">
              <Link href="/mass-intentions"
                className="inline-flex items-center gap-2 font-cinzel text-xs text-caritas-red tracking-widest hover:text-caritas-crimson group">
                VIEW ALL <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/mass-intentions?book=true"
                className="font-cinzel text-xs bg-caritas-red text-white px-5 py-2.5 rounded-sm hover:bg-caritas-crimson transition-colors tracking-wider">
                BOOK MASS
              </Link>
            </div>
          </div>

          {/* Thanksgiving */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <span className="text-caritas-gold text-2xl">🙏</span>
              <div>
                <h2 className="font-cinzel text-caritas-cream text-2xl font-bold">Thanksgiving</h2>
                <p className="font-garamond text-gray-500 text-sm italic">Give glory to God · ₦2,500</p>
              </div>
            </div>

            <div className="space-y-4">
              {intentions.filter(i => i.type === "thanksgiving").slice(0, 4).map((item) => (
                <div key={item.id} className="bg-white rounded-lg p-5 border-l-4 border-caritas-gold/60 shadow-sm">
                  <p className="font-cinzel text-caritas-dark text-sm font-semibold mb-1">
                    {item.is_anonymous ? "Anonymous" : item.name}
                  </p>
                  <p className="font-garamond text-gray-600 leading-relaxed">{item.intention}</p>
                  <p className="font-cinzel text-caritas-gold text-xs mt-3 tracking-wider">
                    {formatDate(item.intention_date)}
                  </p>
                </div>
              ))}
              {intentions.filter(i => i.type === "thanksgiving").length === 0 && (
                <div className="text-center py-10 border border-dashed border-gray-200 rounded-lg">
                  <p className="font-garamond text-gray-400 italic">No thanksgivings yet. Share your blessing!</p>
                </div>
              )}
            </div>

            <div className="flex gap-4 mt-6">
              <Link href="/thanksgiving"
                className="inline-flex items-center gap-2 font-cinzel text-xs text-caritas-gold tracking-widest hover:opacity-80 group">
                VIEW ALL <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/thanksgiving?book=true"
                className="font-cinzel text-xs bg-caritas-gold text-caritas-dark px-5 py-2.5 rounded-sm hover:bg-yellow-400 transition-colors tracking-wider font-bold">
                GIVE THANKS
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
