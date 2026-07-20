import { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { ProductService } from "@/services/product.service";
import { useDataStore } from "@/hooks/useDataStore";
import { TestimonialService } from "@/services/testimonial.service";
import { SiteServiceService } from "@/services/content.service";
import { SettingsService } from "@/services/settings.service";
import Hero from "@/components/Hero";
import {
  Phone, Star, Droplets, Shield, Wrench,
  Clock, Award, ArrowRight, Check, Leaf, ChevronDown, CheckCircle2, MessageSquare
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const features = [
  { icon: <Droplets className="w-6 h-6 text-brand-primary" />, title: "100% Pure Water", desc: "Multi-stage RO filtration removes bacteria, viruses, and chemicals, ensuring safe drinking water." },
  { icon: <Shield className="w-6 h-6 text-brand-secondary" />, title: "Genuine Parts", desc: "Only certified and original spare parts for long-lasting purifier performance." },
  { icon: <Wrench className="w-6 h-6 text-brand-accent" />, title: "Expert Technicians", desc: "Skilled technicians for installation, repair, and maintenance of all RO brands." },
  { icon: <Clock className="w-6 h-6 text-purple-500" />, title: "Same-Day Service", desc: "Prompt after-sales support. Call us anytime for quick service visits." },
];

const faqs = [
  { q: "How often should I service my RO purifier?", a: "We recommend regular servicing every 3 to 4 months to maintain filter efficiency and ensure water purity. Prefilters typically need changing every 3-6 months depending on local TDS." },
  { q: "What is covered under the RO AMC plan?", a: "Our Annual Maintenance Contracts (AMC) cover unlimited service visits, scheduled filter changes, free replacement of consumable membranes, electrical parts repair, and priority emergency support." },
  { q: "Do you use original spare parts?", a: "Yes, we exclusively use 100% genuine, certified spare parts and membranes approved by manufacturers to ensure maximum lifespan and healthy filtration." },
  { q: "How quickly can a technician visit my house?", a: "We offer guaranteed same-day visits for all bookings done before 4:00 PM. Urgent emergency visits can be completed within 2 hours in Indore and Bhopal." },
];

type Slide = { img: string; name: string; subtitle: string; price: string; tag: string; tagColor: string };

export default function Home() {
  const [managedTestimonials, setManagedTestimonials] = useState<{ name: string; rating: number; review: string }[]>([]);
  const [siteServices, setSiteServices] = useState<{ title: string; desc: string; href: string; cta: string }[]>([]);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(null);
  
  const { data: productItems = [] } = useDataStore(() => ProductService.getAll());

  const managedProducts = useMemo(() => {
    return productItems.filter((item) => item.isActive && item.featured).slice(0, 4).map((item) => ({
      name: item.name,
      price: `₹${item.price}`,
      img: item.mainImageUrl ?? item.image ?? "",
      tag: item.badge ?? "Featured",
    }));
  }, [productItems]);

  useEffect(() => {
    setSlides(
      productItems
        .filter((item) => item.isActive)
        .flatMap((item) => {
          const images = item.images ?? item.variants ?? (item.mainImageUrl ?? item.image ? [item.mainImageUrl ?? item.image!] : []);
          return images.map((img, index) => ({
            img,
            name: item.name,
            subtitle: index === 0 ? (item.model ?? item.brand ?? "Next Gen") : `Edition ${index + 1}`,
            price: `₹${Number(item.price).toLocaleString("en-IN")}`,
            tag: "POPULAR",
            tagColor: "",
          }));
        }),
    );

    TestimonialService.getAll().then((items) =>
      setManagedTestimonials(items.filter((item) => item.isActive).map((item) => ({ name: item.customerName, rating: item.rating, review: item.review })))
    );
    SiteServiceService.getAll().then((items) =>
      setSiteServices(items.filter((item) => item.isActive).sort((a, b) => a.displayOrder - b.displayOrder).map((item) => ({ title: item.title, desc: item.description, href: item.href, cta: item.cta })))
    );
    SettingsService.getAll().then(setSettings);
  }, [productItems]);

  const contactNumber = settings.contactNumber ?? "9584024777";
  const yearsExperience = settings.yearsExperience ?? "6+";

  return (
    <>
      <Helmet>
        <title>Crystal Natural Water | Premium RO Purifier Sales & Service</title>
        <meta name="description" content="Advanced RO Water Purifiers for your home. Pure. Safe. Healthy." />
      </Helmet>

      <main className="bg-background selection:bg-brand-primary selection:text-white overflow-hidden">
        
        {/* HERO SECTION */}
        <Hero slides={slides} settings={settings} yearsExperience={yearsExperience} />

        {/* FEATURED PRODUCTS */}
        <section className="py-24 lg:py-32 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
                <h2 className="text-xs font-black text-brand-secondary tracking-widest uppercase mb-3">Premium Collection</h2>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-[#0A0F1C] tracking-tight">Best-Selling Purifiers</h3>
              </motion.div>
              <Link href="/ro-sales" className="inline-flex items-center gap-2 text-brand-primary font-bold hover:text-brand-secondary transition-colors group">
                Explore Full Catalog <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {managedProducts.map((p, i) => (
                <motion.div key={p.name} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} transition={{ delay: i * 0.1 }}>
                  <Link href="/ro-sales" className="block bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-primary-900/10 hover:-translate-y-2 transition-all duration-300 group">
                    <div className="h-56 bg-gray-50/50 p-6 flex items-center justify-center relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <img src={p.img} alt={p.name} className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-700 ease-[0.16,1,0.3,1] drop-shadow-md relative z-10" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-black tracking-widest uppercase text-brand-secondary">{p.tag}</span>
                      </div>
                      <h4 className="font-extrabold text-[#0A0F1C] text-lg mb-1 leading-tight group-hover:text-brand-primary transition-colors">{p.name}</h4>
                      <p className="text-brand-primary font-black text-xl mt-4">{p.price}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* WHY CHOOSE US (BENTO BOX FEATURES) */}
        <section className="py-24 lg:py-32 bg-gray-50 relative border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="text-center mb-16 max-w-2xl mx-auto">
              <h2 className="text-xs font-black text-brand-secondary tracking-widest uppercase mb-3">The Crystal Natural Water Standard</h2>
              <h3 className="text-3xl md:text-4xl font-extrabold text-[#0A0F1C] tracking-tight">Engineered for purity,<br/>designed for peace of mind.</h3>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((f, i) => (
                <motion.div key={f.title} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} transition={{ delay: i * 0.1 }} className="group bg-white rounded-3xl p-8 border border-gray-100 hover:shadow-2xl hover:shadow-primary-900/10 hover:border-gray-200 hover:scale-\[1.02\] transition-all duration-300">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 ease-[0.16,1,0.3,1]">
                    {f.icon}
                  </div>
                  <h4 className="font-extrabold text-[#0A0F1C] text-lg mb-3">{f.title}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed font-medium">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SERVICE PROCESS TIMELINE */}
        <section className="py-24 lg:py-32 bg-white relative overflow-hidden border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="text-center mb-20 max-w-2xl mx-auto">
              <h2 className="text-xs font-black text-brand-primary tracking-widest uppercase mb-3">How We Serve You</h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-[#0A0F1C] tracking-tight">Standardized Service Flow</h3>
            </motion.div>

            <div className="relative">
              {/* Connector Line */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -translate-y-1/2 hidden lg:block z-0" />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 relative z-10">
                {[
                  { step: "01", name: "Book Service", desc: "Easily request a visit online or by phone." },
                  { step: "02", name: "Assign Engineer", desc: "A qualified technician is assigned instantly." },
                  { step: "03", name: "Diagnostic Visit", desc: "Technician inspects your RO machine on-site." },
                  { step: "04", name: "Prompt Repair", desc: "Repairs completed using 100% genuine spares." },
                  { step: "05", name: "Warranty & Feedback", desc: "Enjoy a 1-year service warranty and submit ratings." },
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    initial="hidden" 
                    whileInView="visible" 
                    viewport={{ once: true }} 
                    variants={fadeUp} 
                    transition={{ delay: i * 0.15 }}
                    className="bg-gray-50 border border-gray-100 rounded-3xl p-8 hover:shadow-xl hover:bg-white transition-all flex flex-col group"
                  >
                    <span className="text-4xl font-black text-brand-primary/20 group-hover:text-brand-primary transition-colors leading-none mb-6">{item.step}</span>
                    <h4 className="text-gray-900 font-extrabold text-lg mb-3">{item.name}</h4>
                    <p className="text-gray-500 text-sm font-medium leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section className="py-24 lg:py-32 bg-gray-50 relative overflow-hidden border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="text-center mb-16 max-w-2xl mx-auto">
              <h2 className="text-xs font-black text-brand-secondary tracking-widest uppercase mb-3">Expert Care</h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-[#0A0F1C] tracking-tight">Complete Service Solutions</h3>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {siteServices.map((s, i) => (
                <motion.div key={s.title} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} transition={{ delay: i * 0.1 }} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-primary-900/5 hover:border-gray-200 hover:-translate-y-2 transition-all duration-500 flex flex-col h-full group">
                  <div className="w-14 h-14 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center mb-6 group-hover:bg-brand-primary group-hover:text-white transition-colors duration-300 text-brand-primary">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="font-extrabold text-[#0A0F1C] text-xl mb-3">{s.title}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-1 font-medium">{s.desc}</p>
                  <Link href={s.href} className="inline-flex items-center gap-2 text-brand-primary font-bold text-sm group-hover:text-brand-secondary transition-colors mt-auto">
                    {s.cta} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* GOOGLE REVIEW TESTIMONIALS */}
        <section className="py-24 lg:py-32 bg-white overflow-hidden relative border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="mb-16 text-center lg:text-left flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div>
                <h3 className="text-3xl sm:text-4xl font-semibold text-[#0A0F1C] tracking-tight">{settings.testimonialsTitle || "Testimonials"}</h3>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-5 py-3 rounded-2xl shadow-sm">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span className="font-extrabold text-[#0A0F1C]">4.9 / 5.0 Rating</span>
              </div>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {managedTestimonials.slice(0, 3).map((t, i) => (
                <motion.div 
                  key={t.name} 
                  initial="hidden" 
                  whileInView="visible" 
                  viewport={{ once: true, margin: "-50px" }} 
                  variants={fadeUp} 
                  transition={{ delay: i * 0.1 }} 
                  className="bg-gray-50 border border-gray-100 rounded-3xl p-8 hover:shadow-2xl hover:shadow-primary-900/5 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex gap-1 mb-6">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className={`w-4 h-4 ${j < t.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />
                      ))}
                    </div>
                    <p className="text-gray-600 text-base leading-relaxed mb-8 font-medium">"{t.review}"</p>
                  </div>
                  <div className="flex items-center gap-4 border-t border-gray-200/60 pt-6">
                    <div className="w-12 h-12 rounded-full bg-brand-secondary/20 flex items-center justify-center font-bold text-brand-secondary text-lg border border-brand-secondary/30 shrink-0">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-[#0A0F1C] tracking-tight flex items-center gap-1.5">
                        {t.name}
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-50" />
                      </div>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Verified Customer</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ ACCORDION */}
        <section className="py-24 lg:py-32 bg-gray-50 relative border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="text-center mb-16">
              <h2 className="text-xs font-black text-brand-primary tracking-widest uppercase mb-3">FAQ</h2>
              <h3 className="text-3xl font-extrabold text-[#0A0F1C] tracking-tight">Frequently Asked Questions</h3>
            </motion.div>

            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = faqOpenIndex === index;
                return (
                  <div key={index} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <button 
                      onClick={() => setFaqOpenIndex(isOpen ? null : index)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                    >
                      <span className="font-extrabold text-[#0A0F1C] text-base sm:text-lg">{faq.q}</span>
                      <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      </motion.div>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
                        >
                          <div className="px-6 pb-6 text-gray-500 font-medium text-sm leading-relaxed border-t border-gray-50 pt-4">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-32 bg-white relative">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
              <h2 className="text-4xl md:text-5xl font-extrabold text-[#0A0F1C] tracking-tighter mb-6">Ready to upgrade your water?</h2>
              <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto font-medium">Get in touch with our experts today for a free consultation or to schedule a service visit.</p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/service-booking" className="inline-flex items-center justify-center gap-2 bg-brand-primary text-white font-bold px-10 py-4.5 rounded-full hover:bg-primary-800 transition-all shadow-xl shadow-brand-primary/20 hover:shadow-brand-primary/40 hover:scale-\[1.02\] text-lg group">
                  Book a Service <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <a href={`tel:${contactNumber}`} className="inline-flex items-center justify-center gap-2 bg-white text-[#0A0F1C] border border-gray-200 font-bold px-10 py-4.5 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all hover:scale-\[1.02\] text-lg hover:shadow-lg">
                  <Phone className="w-5 h-5 text-brand-secondary" />
                  {contactNumber}
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
