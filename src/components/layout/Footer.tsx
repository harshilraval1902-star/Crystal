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
    <footer className="bg-primary-900 text-white border-t border-primary-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          <div className="lg:col-span-4">
            <div className="mb-6">
              <img src={logoImg} alt="Crystal Water" className="h-12 w-auto object-contain brightness-0 invert drop-shadow-md" />
            </div>
            <p className="text-primary-200 text-sm leading-relaxed mb-8 max-w-sm">
              {footerText}
            </p>
            <div className="flex gap-4">
              <a href={settings.facebook || "#"} className="w-10 h-10 rounded-full bg-primary-800 hover:bg-brand-secondary flex items-center justify-center text-white transition-all hover:scale-110 hover:-translate-y-1" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href={settings.instagram || "#"} className="w-10 h-10 rounded-full bg-primary-800 hover:bg-brand-secondary flex items-center justify-center text-white transition-all hover:scale-110 hover:-translate-y-1" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href={settings.youtube || "#"} className="w-10 h-10 rounded-full bg-primary-800 hover:bg-brand-secondary flex items-center justify-center text-white transition-all hover:scale-110 hover:-translate-y-1" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-semibold text-white mb-6 text-sm tracking-widest uppercase">Quick Links</h3>
            <ul className="space-y-4">
              {[
                { href: "/", label: "Home" },
                { href: "/ro-sales", label: "RO Sales" },
                { href: "/amc-plans", label: "AMC Plans" },
                { href: "/service-booking", label: "Book Service" },
                { href: "/contact", label: "Contact Us" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-primary-200 hover:text-white text-sm transition-colors flex items-center gap-2 group">
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-brand-secondary" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="font-semibold text-white mb-6 text-sm tracking-widest uppercase">Our Services</h3>
            <ul className="space-y-4">
              {services.map((s) => (
                <li key={s} className="text-primary-200 text-sm flex items-start gap-3 group cursor-default">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-secondary mt-1.5 group-hover:scale-150 transition-transform shadow-[0_0_8px_rgba(0,196,204,0.6)]" />
                  <span className="group-hover:text-white transition-colors">{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="font-semibold text-white mb-6 text-sm tracking-widest uppercase">Get In Touch</h3>
            <ul className="space-y-5">
              <li>
                <a href={`tel:${contactNumber}`} className="flex items-center gap-4 text-primary-200 hover:text-white transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-primary-800 group-hover:bg-brand-primary border border-primary-700 group-hover:border-brand-secondary flex items-center justify-center transition-all shrink-0">
                    <Phone className="w-4 h-4 group-hover:text-brand-secondary" />
                  </div>
                  <span className="text-sm font-medium">{contactNumber}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${email}`} className="flex items-center gap-4 text-primary-200 hover:text-white transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-primary-800 group-hover:bg-brand-primary border border-primary-700 group-hover:border-brand-secondary flex items-center justify-center transition-all shrink-0">
                    <Mail className="w-4 h-4 group-hover:text-brand-secondary" />
                  </div>
                  <span className="text-sm break-all font-medium">{email}</span>
                </a>
              </li>
              <li className="flex items-start gap-4 text-primary-200 group">
                <div className="w-10 h-10 rounded-xl bg-primary-800 border border-primary-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-sm leading-relaxed pt-2">{address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-primary-300 text-sm">
            &copy; {new Date().getFullYear()} {companyName}. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-primary-400">
            <Link href="/about" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/about" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
