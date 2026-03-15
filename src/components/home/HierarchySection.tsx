"use client";
import { ChevronRight } from "lucide-react";

const hierarchyData = [
  { name: "Jesus Christ", role: "Head of the Holy Catholic Church", image: "/images/jesus christ.png" },
  { name: "Saint Peter", role: "First Pope & Prince of the Apostles", image: "/images/saint peter.png" },
  { name: "Pope Leo XIV", role: "Supreme Pontiff", image: "/images/pope leo xiv.png" },
  { name: "Abp. Michael Crotty", role: "Apostolic Nuncio to Nigeria", image: "/images/micheal crotty.png" },
  { name: "Abp. Valerian Okeke", role: "Metropolitan Archbishop of Onitsha", image: "/images/valerian okeke.png" },
  { name: "Bp. Callistus Onaga", role: "Bishop of Enugu Diocese", image: "/images/callistus onaga.png" },
  { name: "Bp. Ernest Obodo", role: "Auxiliary Bishop of Enugu", image: "/images/ernest obodo.png" },
  { name: "Fr. Prof. Emmanuel Edeh", role: "Founder — Jesus the Saviour Congregation", image: "/images/fr_edeh.png" },
  { name: "Fr. Davison Odoviro", role: "Chaplain, Caritas University", image: "/images/davison odoviro.png" },
];

export default function HierarchySection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-px bg-caritas-red/40" />
            <span className="font-cinzel text-caritas-red text-xs tracking-widest uppercase">One Holy Catholic Apostolic Church</span>
            <div className="w-12 h-px bg-caritas-red/40" />
          </div>
          <h2 className="font-cinzel text-caritas-dark text-4xl font-bold">Church Hierarchy</h2>
          <p className="font-garamond text-gray-500 text-lg mt-4 max-w-2xl mx-auto italic">
            From Christ to our campus — a living chain of apostolic authority entrusted to His servants
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-caritas-gold via-caritas-red to-caritas-maroon hidden md:block" />

          <div className="space-y-8">
            {hierarchyData.map((person, i) => (
              <div key={person.name}
                className={`flex items-center gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                {/* Card */}
                <div className="flex-1 md:max-w-sm">
                  <div className="holy-card bg-white p-6 shadow-sm border border-caritas-gold/10 group">
                    <div className="w-16 h-16 rounded-full bg-caritas-cream overflow-hidden mb-5 border border-caritas-gold/20 mx-auto md:mx-0">
                      {person.image ? (
                        <img src={person.image} alt={person.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-caritas-gold font-cinzel text-2xl bg-caritas-gold/5 italic">✝</div>
                      )}
                    </div>
                    <h3 className="font-cinzel text-caritas-dark font-bold text-sm mb-1 tracking-tight">{person.name}</h3>
                    <p className="font-garamond text-gray-500 text-sm italic leading-relaxed font-medium">{person.role}</p>
                  </div>
                </div>

                {/* Center dot */}
                <div className="hidden md:flex w-5 h-5 rounded-full bg-caritas-gold border-2 border-caritas-dark flex-shrink-0 z-10 shadow-lg" />

                {/* Spacer */}
                <div className="hidden md:block flex-1 md:max-w-sm" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
