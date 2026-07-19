import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Phone } from "lucide-react";
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
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-lg border-b border-slate-200" : "glass shadow-md border-b border-slate-100"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center shrink-0">
            <img src={logoImg} alt="Kenzora - Trusted Purity. Timely Care." className="h-9 w-auto object-contain" />
          </Link>

          <nav className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location === link.href
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                    : "text-slate-700 hover:bg-slate-100 hover:text-blue-700"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <a
            href={`tel:${contactNumber}`}
            className="hidden md:flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm shadow-blue-500/25"
          >
            <Phone className="w-3.5 h-3.5" />
            {contactNumber}
          </a>

          <button
            className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  location === link.href
                    ? "bg-blue-600 text-white"
                    : "text-slate-700 hover:bg-slate-100 hover:text-blue-700"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`tel:${contactNumber}`}
              className="flex items-center gap-2 mt-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold"
            >
              <Phone className="w-4 h-4" />
              Call: {contactNumber}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
