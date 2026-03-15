"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Cross, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/hierarchy", label: "Hierarchy" },
  { href: "/societies", label: "Societies" },
  { href: "/mass-intentions", label: "Mass" },
  { href: "/petitions", label: "Petitions" },
  { href: "/announcements", label: "Announcements" },
  { href: "/readings", label: "Readings" },
  { href: "/doctrines", label: "Doctrines" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
      scrolled
        ? "bg-caritas-dark/95 backdrop-blur-md shadow-lg border-b border-caritas-gold/20"
        : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-white/10 flex items-center justify-center border border-caritas-gold/40 group-hover:border-caritas-gold transition-colors">
              <img src="/images/logo.png" alt="Caritas Chaplaincy Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-cinzel text-white text-sm font-bold leading-tight">CARITAS</p>
              <p className="font-garamond text-caritas-cream text-xs leading-tight">Catholic Chaplaincy</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className="font-garamond text-white/80 hover:text-caritas-gold px-3 py-2 text-sm transition-colors duration-200 hover:bg-white/5 rounded-md">
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/donations"
              className="font-cinzel text-xs text-caritas-gold border border-caritas-gold/50 px-4 py-2 rounded-sm hover:bg-caritas-gold hover:text-caritas-dark transition-all duration-300">
              DONATE
            </Link>
            <Link href="/admin"
              className="font-cinzel text-xs text-white/60 hover:text-white transition-colors px-2">
              Admin
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-white p-2">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden bg-caritas-dark border-t border-caritas-gold/20 py-6 min-h-[400px] shadow-2xl">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                onClick={() => setIsOpen(false)}
                className="block font-garamond text-white hover:text-caritas-gold px-6 py-4 border-b border-white/5 hover:bg-white/5 text-lg font-medium transition-colors">
                {link.label}
              </Link>
            ))}
            <div className="px-6 pt-6 pb-10 flex flex-col gap-4">
              <Link href="/donations" onClick={() => setIsOpen(false)}
                className="font-cinzel text-sm text-caritas-gold border border-caritas-gold/50 px-6 py-3 rounded-sm text-center hover:bg-caritas-gold hover:text-caritas-dark transition-all">
                DONATE
              </Link>
              <Link href="/admin" onClick={() => setIsOpen(false)}
                className="font-cinzel text-[10px] text-white/40 text-center uppercase tracking-widest mt-4">
                Staff Portal
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
