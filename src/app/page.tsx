import { supabase } from "@/lib/supabase";
import HeroSection from "@/components/home/HeroSection";
import AnnouncementsBulletin from "@/components/home/AnnouncementsBulletin";
import ChaplainMessage from "@/components/home/ChaplainMessage";
import HierarchySection from "@/components/home/HierarchySection";
import UniversityAuthorities from "@/components/home/UniversityAuthorities";
import CouncilSection from "@/components/home/CouncilSection";
import OfficialsSection from "@/components/home/OfficialsSection";
import MassIntentionsPreview from "@/components/home/MassIntentionsPreview";
import PetitionsSection from "@/components/home/PetitionsSection";
import SocietiesPreview from "@/components/home/SocietiesPreview";
import DailyReadingsPreview from "@/components/home/DailyReadingsPreview";
import DonateSection from "@/components/home/DonateSection";

async function getHomeData() {
  const today = new Date().toISOString().split("T")[0];
  const [announcements, intentions, petitions, executives, sacristans, catechists, authorities, societies] = await Promise.all([
    supabase.from("announcements").select("*").eq("is_approved", true).order("created_at", { ascending: false }).limit(4).then(r => r.data || []),
    supabase.from("mass_intentions").select("*").eq("is_approved", true).eq("intention_date", today).order("created_at").limit(5).then(r => r.data || []),
    supabase.from("petitions").select("*").eq("is_approved", true).order("created_at", { ascending: false }).limit(5).then(r => r.data || []),
    supabase.from("council_executives").select("*").eq("is_current", true).order("id").then(r => r.data || []),
    supabase.from("sacristans").select("*").eq("is_current", true).then(r => r.data || []),
    supabase.from("catechists").select("*").eq("is_current", true).then(r => r.data || []),
    supabase.from("university_authorities").select("*").order("order_rank").then(r => r.data || []),
    supabase.from("societies").select("*").order("name").then(r => r.data || []),
  ]);

  const wikiSoc = require("@/data/societies-wiki.json");
  const mergedSocieties = societies.map((s: any) => {
    const wiki = wikiSoc.find((w: any) => w.name.toLowerCase() === s.name.toLowerCase());
    if (wiki) {
      return {
        ...s,
        short_description: wiki.summary.split('.')[0] + '.', // Use first sentence of summary
        type: wiki.type
      };
    }
    return s;
  });

  return { announcements, intentions, petitions, executives, sacristans, catechists, authorities, societies: mergedSocieties };
}

export default async function Home() {
  const data = await getHomeData().catch(() => ({
    announcements: [], intentions: [], petitions: [],
    executives: [], sacristans: [], catechists: [], authorities: [], societies: [],
  }));

  return (
    <div>
      <HeroSection />
      <AnnouncementsBulletin announcements={data.announcements} />
      <ChaplainMessage />
      <HierarchySection />
      <UniversityAuthorities authorities={data.authorities} />
      <CouncilSection executives={data.executives} />
      <OfficialsSection sacristans={data.sacristans} catechists={data.catechists} />
      <MassIntentionsPreview intentions={data.intentions} />
      <PetitionsSection petitions={data.petitions} />
      <SocietiesPreview societies={data.societies} />
      <DailyReadingsPreview />
      <DonateSection />
    </div>
  );
}
