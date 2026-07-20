import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Phone, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { SettingsService } from "@/services/settings.service";
import logoImg from "@/assets/Logo-png_1775412426687.png";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/ro-sales", label: "RO Sales" },
  { href: "/amc-plans", label: "AMC Plans" },
  { href: "/service-booking", label: "Book Service" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [contactNumber, setContactNumber] = useState("9584024777");
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    SettingsService.getAll().then((s) => setContactNumber(s.contactNumber ?? "9584024777"));
  }, []);

  const isHome = location === "/";
  const isDarkHeader = isHome && !scrolled;

  return (
    <>
      <header 
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-400 ease-[0.16,1,0.3,1] ${scrolled ? "bg-white/90 backdrop-blur-3xl shadow-sm border-b border-gray-100 py-3" : "bg-gradient-to-b from-black/50 to-transparent py-5"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center shrink-0">
              <img 
                src={logoImg} 
                alt="Crystal Natural Water" 
                className={`h-10 w-auto object-contain transition-all duration-300 hover:scale-105 ${isDarkHeader ? "brightness-0 invert opacity-90" : ""}`} 
              />
            </Link>

            <nav className={`hidden md:flex items-center gap-1.5 px-2 py-1.5 rounded-full border transition-all duration-500 backdrop-blur-2xl ${
              isDarkHeader 
                ? "bg-white/10 border-white/10 shadow-lg shadow-black/10" 
                : "bg-white/60 border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
            }`}>
              {navLinks.map((link) => {
                const isActive = location === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? (isDarkHeader ? "text-[#0A0F1C]" : "text-[#0A0F1C]")
                        : (isDarkHeader ? "text-white/80 hover:text-white hover:bg-white/10" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100/50")
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className={`absolute inset-0 rounded-full shadow-sm border ${
                          isDarkHeader 
                            ? "bg-white border-white" 
                            : "bg-white border-gray-200"
                        }`}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="hidden md:flex items-center gap-4">
              <a
                href={`tel:${contactNumber}`}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group ${
                  isDarkHeader
                    ? "bg-white text-[#0A0F1C] shadow-lg shadow-black/20"
                    : "bg-[#0A0F1C] text-white shadow-lg shadow-black/10"
                }`}
              >
                <Phone className="w-4 h-4" />
                <span>{contactNumber}</span>
                <ChevronRight className="w-4 h-4 opacity-50 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>

            <button
              className={`md:hidden p-2 rounded-full border transition-all ${
                isDarkHeader 
                  ? "text-white bg-white/10 border-white/20 hover:bg-white/20" 
                  : "text-gray-700 bg-white/80 border-gray-200 hover:bg-white"
              }`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-3xl border-b border-gray-100 shadow-2xl transition-all duration-400 ease-[0.16,1,0.3,1] origin-top ${menuOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0 pointer-events-none"}`}>
          <div className="px-4 py-6 flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = location === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center justify-between px-5 py-4 rounded-xl text-base font-semibold transition-all ${
                    isActive
                      ? "bg-gray-100 text-[#0A0F1C]"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                  {isActive && <ChevronRight className="w-5 h-5 text-[#0A0F1C]" />}
                </Link>
              );
            })}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <a
                href={`tel:${contactNumber}`}
                className="flex items-center justify-center gap-2 bg-[#0A0F1C] text-white px-4 py-4 rounded-xl text-base font-bold shadow-lg shadow-black/5 active:scale-[0.98] transition-transform"
              >
                <Phone className="w-5 h-5" />
                Call: {contactNumber}
              </a>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
