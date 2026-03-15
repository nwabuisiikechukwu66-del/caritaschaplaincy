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

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {authorities.map((auth) => (
            <div key={auth.id} className="holy-card bg-white rounded-sm p-8 text-center shadow-sm border border-caritas-gold/10 group">
              <div className="w-24 h-24 rounded-full mx-auto mb-6 bg-caritas-cream border-2 border-caritas-gold/20 flex items-center justify-center overflow-hidden">
                {auth.image_url ? (
                  <img src={auth.image_url} alt={auth.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-caritas-gold/5">
                    <span className="font-cinzel text-caritas-gold text-3xl">✝</span>
                  </div>
                )}
              </div>
              <h3 className="font-cinzel text-caritas-dark text-sm font-bold leading-tight mb-2 tracking-tight group-hover:text-caritas-red transition-colors">{auth.name}</h3>
              <p className="font-garamond text-caritas-red text-base italic font-semibold">{auth.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
