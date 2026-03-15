"use client";

interface Authority { id: string; name: string; role: string; image_url?: string; }

export default function UniversityAuthorities({ authorities }: { authorities: Authority[] }) {
  return (
    <section className="py-16 bg-white border-t border-caritas-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-px bg-caritas-gold/40" />
            <span className="font-cinzel text-caritas-gold text-xs tracking-widest uppercase">University Leadership</span>
            <div className="w-12 h-px bg-caritas-gold/40" />
          </div>
          <h2 className="font-cinzel text-caritas-dark text-3xl font-bold">Sisters & University Authorities</h2>
          <p className="font-garamond text-gray-500 italic mt-3">
            The Jesus the Saviour Sisters who shepherd Caritas University's Catholic identity
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {authorities.map((auth) => (
            <div key={auth.id} className="holy-card bg-caritas-cream rounded-lg p-6 text-center w-48">
              <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-gradient-to-br from-caritas-red/20 to-caritas-maroon/30 border-2 border-caritas-gold/30 flex items-center justify-center overflow-hidden">
                {auth.image_url ? (
                  <img src={auth.image_url} alt={auth.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-cinzel text-caritas-gold text-2xl">✦</span>
                )}
              </div>
              <p className="font-cinzel text-caritas-dark text-xs font-bold leading-tight mb-1">{auth.name}</p>
              <p className="font-garamond text-caritas-red text-xs italic leading-snug">{auth.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
