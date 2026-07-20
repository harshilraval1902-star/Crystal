import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, ArrowRight } from "lucide-react";
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
    <footer className="bg-[#0A0F1C] text-white border-t border-white/5 relative overflow-hidden">
      {/* Background Subtle Water Glow */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-brand-secondary/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
          <div className="lg:col-span-4">
            <div className="mb-6">
              <img src={logoImg} alt="Crystal Natural Water" className="h-12 w-auto object-contain brightness-0 invert drop-shadow-md" />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm font-semibold">
              {footerText}
            </p>
            <div className="flex gap-4">
              <a href={settings.facebook || "#"} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-brand-primary flex items-center justify-center text-white border border-white/10 transition-all hover:scale-110 hover:scale-\[1.02\] shadow-md" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href={settings.instagram || "#"} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-brand-primary flex items-center justify-center text-white border border-white/10 transition-all hover:scale-110 hover:scale-\[1.02\] shadow-md" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href={settings.youtube || "#"} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-brand-primary flex items-center justify-center text-white border border-white/10 transition-all hover:scale-110 hover:scale-\[1.02\] shadow-md" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-extrabold text-white mb-6 text-xs tracking-widest uppercase opacity-60">Quick Links</h3>
            <ul className="space-y-4">
              {[
                { href: "/", label: "Home" },
                { href: "/ro-sales", label: "RO Sales" },
                { href: "/amc-plans", label: "AMC Plans" },
                { href: "/service-booking", label: "Book Service" },
                { href: "/contact", label: "Contact Us" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-300 hover:text-white text-sm font-bold transition-all flex items-center gap-2 group">
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-brand-secondary" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="font-extrabold text-white mb-6 text-xs tracking-widest uppercase opacity-60">Our Services</h3>
            <ul className="space-y-4">
              {services.map((s) => (
                <li key={s} className="text-gray-300 text-sm font-bold flex items-start gap-3 group cursor-default">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-secondary mt-2 group-hover:scale-150 transition-transform shadow-[0_0_8px_rgba(0,196,204,0.6)]" />
                  <span className="group-hover:text-white transition-colors">{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="font-extrabold text-white mb-6 text-xs tracking-widest uppercase opacity-60">Get In Touch</h3>
            <ul className="space-y-5">
              <li>
                <a href={`tel:${contactNumber}`} className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-white/5 group-hover:bg-brand-primary border border-white/10 flex items-center justify-center transition-all shrink-0">
                    <Phone className="w-4 h-4 group-hover:text-white" />
                  </div>
                  <span className="text-sm font-bold">{contactNumber}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${email}`} className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-white/5 group-hover:bg-brand-primary border border-white/10 flex items-center justify-center transition-all shrink-0">
                    <Mail className="w-4 h-4 group-hover:text-white" />
                  </div>
                  <span className="text-sm break-all font-bold">{email}</span>
                </a>
              </li>
              <li className="flex items-start gap-4 text-gray-300 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-sm leading-relaxed font-bold pt-2">{address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 font-semibold text-sm">
          <p className="text-gray-500">
            &copy; {new Date().getFullYear()} {companyName}. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-gray-400">
            <Link href="/about" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/about" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
