import { Link } from "wouter";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react";
import logoImg from "@/assets/Logo-png_1775412426687.png";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="mb-4">
              <img src={logoImg} alt="Crystal Natural Water" className="h-9 w-auto object-contain brightness-0 invert" />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              Trusted RO Water Purifier Sales & Service since 2019. Delivering pure, safe drinking water for homes and businesses.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-blue-600 flex items-center justify-center text-slate-400 hover:text-white transition-all" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-pink-600 flex items-center justify-center text-slate-400 hover:text-white transition-all" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-sky-500 flex items-center justify-center text-slate-400 hover:text-white transition-all" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-widest">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { href: "/", label: "Home" },
                { href: "/ro-sales", label: "RO Sales" },
                { href: "/amc-plans", label: "AMC Plans" },
                { href: "/service-booking", label: "Book Service" },
                { href: "/contact", label: "Contact Us" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-400 hover:text-cyan-400 text-sm transition-colors flex items-center gap-1 group">
                    <span className="w-0 group-hover:w-2 transition-all duration-200 overflow-hidden text-cyan-400">›</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-widest">Services</h3>
            <ul className="space-y-2.5 text-slate-400 text-sm">
              {["RO Purifier Installation", "Repair & Servicing", "Annual Maintenance Contract", "Genuine Spare Parts", "Commercial RO Systems"].map(s => (
                <li key={s} className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-cyan-500 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-widest">Get In Touch</h3>
            <ul className="space-y-3">
              <li>
                <a href="tel:9584024777" className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 group-hover:bg-blue-600 flex items-center justify-center transition-colors shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="text-sm">9584024777</span>
                </a>
              </li>
              <li>
                <a href="mailto:crystalnaturalwater@gmail.com" className="flex items-start gap-3 text-slate-400 hover:text-white transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 group-hover:bg-blue-600 flex items-center justify-center transition-colors shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="text-sm break-all">crystalnaturalwater@gmail.com</span>
                </a>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-sm">India | Est. 2019</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Crystal Natural Water. All rights reserved.
          </p>
          <p className="text-slate-600 text-xs">Est. 2019 | Trusted Water Purifier Experts</p>
        </div>
      </div>
    </footer>
  );
}
