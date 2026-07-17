import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react";
import logoImg from "@/assets/Logo-png_1775412426687.png";
import { SettingsService } from "@/services/settings.service";
import { SiteServiceService } from "@/services/content.service";

export default function Footer() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [services, setServices] = useState<string[]>([]);

  useEffect(() => {
    SettingsService.getAll().then(setSettings);
    SiteServiceService.getAll().then((items) =>
      setServices(
        items.filter((item) => item.isActive).sort((a, b) => a.displayOrder - b.displayOrder).map((item) => item.title),
      ),
    );
  }, []);

  const contactNumber = settings.contactNumber ?? "9584024777";
  const email = settings.email ?? "crystalnaturalwater@gmail.com";
  const address = settings.address ?? "India | Est. 2019";
  const footerText = settings.footerText ?? "Trusted RO Water Purifier Sales & Service since 2019. Delivering pure, safe drinking water for homes and businesses.";
  const companyName = settings.companyName ?? "Crystal Natural Water";

  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="mb-4">
              <img src={logoImg} alt="Kenzora" className="h-9 w-auto object-contain brightness-0 invert" />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              {footerText}
            </p>
            <div className="flex gap-3">
              <a href={settings.facebook || "#"} className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-blue-600 flex items-center justify-center text-slate-400 hover:text-white transition-all" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href={settings.instagram || "#"} className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-pink-600 flex items-center justify-center text-slate-400 hover:text-white transition-all" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href={settings.youtube || "#"} className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-sky-500 flex items-center justify-center text-slate-400 hover:text-white transition-all" aria-label="Twitter">
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
              {services.map((s) => (
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
                <a href={`tel:${contactNumber}`} className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 group-hover:bg-blue-600 flex items-center justify-center transition-colors shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="text-sm">{contactNumber}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${email}`} className="flex items-start gap-3 text-slate-400 hover:text-white transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 group-hover:bg-blue-600 flex items-center justify-center transition-colors shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="text-sm break-all">{email}</span>
                </a>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-sm">{address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} {companyName}. All rights reserved.
          </p>
          <p className="text-slate-600 text-xs">Est. 2019 | Trusted Water Purifier Experts</p>
        </div>
      </div>
    </footer>
  );
}
