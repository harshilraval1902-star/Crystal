import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, ArrowRight, ShieldCheck, Clock, Award } from "lucide-react";
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
  const footerText = settings.footerText ?? "Premium RO water purification systems. We engineer solutions that deliver pure, safe, and healthy drinking water for families and businesses.";
  const companyName = settings.companyName ?? "Crystal Natural Water";

  return (
    <footer className="bg-brand-primary text-white border-t border-primary-800">
      
      {/* LARGE PRE-FOOTER CTA */}
      <div className="border-b border-primary-800 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Subscribe to Purity</h2>
            <p className="text-primary-300">Join our newsletter for maintenance tips and exclusive offers.</p>
          </div>
          <div className="flex w-full md:w-auto gap-2">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="bg-primary-900 border border-primary-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-white w-full md:w-72 transition-elegant placeholder:text-primary-500"
            />
            <button className="bg-white text-brand-primary px-6 py-3 rounded-lg font-medium hover:bg-surface transition-elegant whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
          
          {/* BRAND STORY & TRUST */}
          <div className="lg:col-span-4">
            <div className="mb-6">
              <img src={logoImg} alt={companyName} className="h-10 w-auto object-contain brightness-0 invert" />
            </div>
            <p className="text-primary-300 text-sm leading-relaxed mb-8 max-w-sm">
              {footerText}
            </p>
            <div className="flex items-center gap-4 mb-8 text-primary-200 text-sm">
              <div className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> ISO Certified</div>
              <div className="flex items-center gap-1.5"><Award className="w-4 h-4" /> Top Rated</div>
            </div>
            <div className="flex gap-4">
              <a href={settings.facebook || "#"} className="w-10 h-10 rounded-full border border-primary-700 hover:bg-white hover:text-brand-primary hover:border-white flex items-center justify-center text-primary-300 transition-elegant" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href={settings.instagram || "#"} className="w-10 h-10 rounded-full border border-primary-700 hover:bg-white hover:text-brand-primary hover:border-white flex items-center justify-center text-primary-300 transition-elegant" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href={settings.youtube || "#"} className="w-10 h-10 rounded-full border border-primary-700 hover:bg-white hover:text-brand-primary hover:border-white flex items-center justify-center text-primary-300 transition-elegant" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="lg:col-span-2">
            <h3 className="font-semibold text-white mb-6 tracking-wide">Quick Links</h3>
            <ul className="space-y-4">
              {[
                { href: "/", label: "Home" },
                { href: "/ro-sales", label: "Purifiers" },
                { href: "/amc-plans", label: "AMC Plans" },
                { href: "/service-booking", label: "Book Service" },
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-primary-300 hover:text-white text-sm transition-elegant group flex items-center">
                    <span className="w-0 group-hover:w-2 h-[1px] bg-white mr-0 group-hover:mr-2 transition-all"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SERVICES & LOCATIONS */}
          <div className="lg:col-span-3">
            <h3 className="font-semibold text-white mb-6 tracking-wide">Our Services</h3>
            <ul className="space-y-4 mb-8">
              {services.map((s) => (
                <li key={s} className="text-primary-300 text-sm transition-elegant">
                  {s}
                </li>
              ))}
            </ul>
            <h3 className="font-semibold text-white mb-4 tracking-wide">Working Hours</h3>
            <div className="text-primary-300 text-sm flex items-start gap-2">
              <Clock className="w-4 h-4 mt-0.5 shrink-0" />
              <p>Mon - Sat: 9:00 AM - 8:00 PM<br/>Sun: Emergency Only</p>
            </div>
          </div>

          {/* CONTACT INFO */}
          <div className="lg:col-span-3">
            <h3 className="font-semibold text-white mb-6 tracking-wide">Contact Us</h3>
            <ul className="space-y-6">
              <li>
                <a href={`tel:${contactNumber}`} className="flex items-center gap-4 text-primary-300 hover:text-white transition-elegant group">
                  <div className="w-10 h-10 rounded-full border border-primary-700 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-brand-primary group-hover:border-white transition-elegant">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">{contactNumber}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${email}`} className="flex items-center gap-4 text-primary-300 hover:text-white transition-elegant group">
                  <div className="w-10 h-10 rounded-full border border-primary-700 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-brand-primary group-hover:border-white transition-elegant">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">{email}</span>
                </a>
              </li>
              <li className="flex items-start gap-4 text-primary-300">
                <div className="w-10 h-10 rounded-full border border-primary-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-sm leading-relaxed mt-2">{address}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* COPYRIGHT & LEGAL */}
        <div className="border-t border-primary-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p className="text-primary-400">
            &copy; {new Date().getFullYear()} {companyName}. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-primary-400">
            <Link href="/about" className="hover:text-white transition-elegant">Privacy Policy</Link>
            <Link href="/about" className="hover:text-white transition-elegant">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
