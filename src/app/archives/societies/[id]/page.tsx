import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default async function SocietyArchivePage({ params }: { params: { id: string } }) {
    let society: any = null;
    let leaders: any[] = [];

    // Try UUID first
    let result = await supabase.from("societies").select("*").eq("id", params.id).single();

    // If not found, try slugified name
    if (!result.data) {
        const allSoc = await supabase.from("societies").select("*");
        result.data = allSoc.data?.find((s: any) => s.id === params.id || s.name.toLowerCase().replace(/\s+/g, '-') === params.id) || null;
    }

    society = result.data;
    if (society) {
        const { data: pastLeaders } = await supabase.from("society_leaders").select("*").eq("society_id", society.id).eq("is_current", false).order("academic_year", { ascending: false });
        leaders = pastLeaders || [];
    }

    if (!society) {
        return (
            <div className="pt-20 min-h-screen flex items-center justify-center bg-caritas-cream">
                <div className="text-center">
                    <p className="font-cinzel text-caritas-dark text-2xl font-bold mb-4">Society Not Found</p>
                    <Link href="/societies" className="font-cinzel text-xs text-caritas-red tracking-widest hover:underline">← Back to Societies</Link>
                </div>
            </div>
        );
    }

    // Use the fetched leaders
    const years = Array.from(new Set(leaders.map((e: any) => e.academic_year as string)));

    return (
        <div className="pt-20">
            <section className="red-section sacred-bg py-16 text-center">
                <div className="max-w-3xl mx-auto px-4">
                    <Link href={`/societies/${society.id}`} className="font-cinzel text-caritas-gold/70 text-xs tracking-widest hover:text-caritas-gold mb-4 inline-block">← BACK TO {society.name.toUpperCase()}</Link>
                    <h1 className="font-cinzel text-white text-4xl font-bold">Past Leaders Archive</h1>
                    <p className="font-garamond text-caritas-gold/80 text-xl italic mt-2">{society.name}</p>
                </div>
            </section>

            <section className="py-12 bg-caritas-cream">
                <div className="max-w-4xl mx-auto px-4">
                    {years.map((year) => {
                        const yearLeaders = leaders.filter((l: any) => l.academic_year === year);
                        return (
                            <div key={year} className="mb-10">
                                <h2 className="font-cinzel text-caritas-dark text-xl font-bold mb-4 border-b border-caritas-gold/30 pb-2">{year} Academic Year</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {yearLeaders.map((s: any) => (
                                        <div key={s.id} className="bg-white rounded-xl p-4 text-center shadow-sm">
                                            <div className="w-14 h-14 rounded-full bg-caritas-red/20 flex items-center justify-center mx-auto mb-2">
                                                {s.photo_url ? (
                                                    <img src={s.photo_url} alt={s.name} className="w-full h-full object-cover rounded-full" />
                                                ) : (
                                                    <span className="font-cinzel text-caritas-red font-bold">{s.name.charAt(0)}</span>
                                                )}
                                            </div>
                                            <p className="font-cinzel text-caritas-dark text-xs font-bold">{s.name}</p>
                                            <p className="font-garamond text-gray-500 text-xs">{s.role}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}

                    {years.length === 0 && (
                        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                            <p className="font-garamond text-gray-400 italic">No archived leaders yet.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
