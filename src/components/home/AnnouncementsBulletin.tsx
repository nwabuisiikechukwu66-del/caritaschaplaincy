"use client";
import Link from "next/link";
import { Bell, Clock, ChevronRight } from "lucide-react";

const bulletin = [
  { label: "Lauds", time: "5:30 AM", note: "School Podium" },
  { label: "Morning Mass", time: "6:00 AM", note: "School Podium" },
  { label: "Sunday Mass", time: "8:00 AM", note: "School Auditorium" },
  { label: "Afternoon Mass", time: "3:00 PM", note: "Fathers' Chapel" },
  { label: "Rosary & Vespers", time: "6:00 PM", note: "School Podium" },
  { label: "Adoration (Wed)", time: "5:30 PM", note: "School Auditorium" },
  { label: "Benediction (Sun)", time: "5:30 PM", note: "School Auditorium" },
  { label: "Confession (Sat)", time: "7:00 PM", note: "Meet Chaplain anytime" },
  { label: "May & Oct Devotion", time: "5:30 PM", note: "Special Benediction" },
];

interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

interface Props {
  announcements: AnnouncementItem[];
}

export default function AnnouncementsBulletin({ announcements }: Props) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-px bg-caritas-red/40" />
            <span className="font-cinzel text-caritas-red text-xs tracking-widest uppercase">Stay Updated</span>
            <div className="w-12 h-px bg-caritas-red/40" />
          </div>
          <h2 className="font-cinzel text-caritas-dark text-4xl font-bold">News & Schedule</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Announcements - 3 cols */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-3 mb-6">
              <Bell size={20} className="text-caritas-red" />
              <h3 className="font-cinzel text-caritas-dark text-xl font-semibold">Latest Announcements</h3>
            </div>

            <div className="space-y-4">
              {announcements.length > 0 ? announcements.slice(0, 4).map((ann) => (
                <div key={ann.id} className="announcement-card p-5">
                  <h4 className="font-playfair text-caritas-dark font-semibold text-lg mb-2">{ann.title}</h4>
                  <p className="font-garamond text-gray-600 text-sm leading-relaxed line-clamp-2">{ann.content}</p>
                  <p className="font-cinzel text-caritas-gold text-xs mt-3 tracking-wider">
                    {new Date(ann.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
              )) : (
                <div className="text-center py-12 border border-dashed border-gray-200 rounded-lg">
                  <p className="font-garamond text-gray-400 italic">No announcements at this time.</p>
                  <p className="font-garamond text-gray-300 text-sm mt-1">Check back soon for updates.</p>
                </div>
              )}
            </div>

            <Link href="/announcements"
              className="inline-flex items-center gap-2 mt-6 font-cinzel text-xs text-caritas-red tracking-widest hover:text-caritas-crimson transition-colors group">
              VIEW ALL ANNOUNCEMENTS
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Bulletin - 2 cols */}
          <div className="lg:col-span-2">
            <div className="bg-caritas-dark rounded-lg p-8 sacred-bg h-full">
              <div className="flex items-center gap-3 mb-6">
                <Clock size={20} className="text-caritas-gold" />
                <h3 className="font-cinzel text-white text-xl font-semibold">Chaplaincy Bulletin</h3>
              </div>

              <p className="font-garamond text-white/50 text-sm italic mb-6">
                Regular activities — all welcome ✝
              </p>

              <div className="space-y-4">
                {bulletin.map((item) => (
                  <div key={item.label} className="flex justify-between items-start pb-4 border-b border-white/10 last:border-0 last:pb-0">
                    <div>
                      <p className="font-garamond text-white text-sm font-medium">{item.label}</p>
                      <p className="font-garamond text-white/40 text-xs mt-0.5">{item.note}</p>
                    </div>
                    <span className="font-cinzel text-caritas-gold text-xs tracking-wider whitespace-nowrap">{item.time}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-caritas-gold/20">
                <p className="font-garamond text-white/40 text-xs italic text-center">
                  Contact Chaplain Fr. Davison Odoviro for private confessions anytime
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
