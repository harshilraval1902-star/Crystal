import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Phone, ChevronRight } from "lucide-react";
import logoImg from "@/assets/Logo-png_1775412426687.png";
import { SettingsService } from "@/services/settings.service";

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
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    SettingsService.getAll().then((s) => setContactNumber(s.contactNumber ?? "9584024777"));
  }, []);

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 py-3" : "bg-transparent py-5"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center shrink-0">
            <img src={logoImg} alt="Crystal Water" className="h-10 w-auto object-contain drop-shadow-sm" />
          </Link>

          <nav className="hidden md:flex items-center gap-1 bg-white/50 backdrop-blur-md px-2 py-1.5 rounded-full border border-gray-100 shadow-sm">
            {navLinks.map((link) => {
              const isActive = location === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-primary-900 text-white shadow-md"
                      : "text-slate-600 hover:text-primary-900 hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <a
              href={`tel:${contactNumber}`}
              className="flex items-center gap-2 bg-gradient-to-r from-primary-900 to-primary-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:shadow-lg hover:shadow-primary-900/20 transition-all duration-300 hover:-translate-y-0.5 group"
            >
              <Phone className="w-4 h-4" />
              <span>{contactNumber}</span>
              <ChevronRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <button
            className="md:hidden p-2 rounded-full text-slate-700 bg-white/50 backdrop-blur-md border border-gray-100 shadow-sm hover:bg-slate-50 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-xl transition-all duration-300 origin-top ${menuOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0 pointer-events-none"}`}>
        <div className="px-4 py-6 flex flex-col gap-2">
          {navLinks.map((link) => {
            const isActive = location === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  isActive
                    ? "bg-primary-50 text-primary-900"
                    : "text-slate-600 hover:bg-slate-50 hover:text-primary-900"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
                {isActive && <ChevronRight className="w-4 h-4 text-primary-900" />}
              </Link>
            );
          })}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <a
              href={`tel:${contactNumber}`}
              className="flex items-center justify-center gap-2 bg-primary-900 text-white px-4 py-3.5 rounded-xl text-sm font-semibold shadow-md active:scale-[0.98] transition-transform"
            >
              <Phone className="w-4 h-4" />
              Call: {contactNumber}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
