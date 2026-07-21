import { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { ProductService } from "@/services/product.service";
import { useDataStore } from "@/hooks/useDataStore";
import { TestimonialService } from "@/services/testimonial.service";
import { SiteServiceService } from "@/services/content.service";
import { SettingsService } from "@/services/settings.service";
import Hero from "@/components/Hero";
import purifierImg from "@/assets/newfolder/purifier-Photoroom.png";
import {
  Phone, Star, Droplets, Shield, Wrench,
  Clock, ArrowRight, Check, ChevronDown, CheckCircle2,
  ShieldCheck, Award, MessageCircle, Play,
  Settings, Zap, Layers, Activity, Beaker
} from "lucide-react";

// Elegant motion variants
const elegantFadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

// --- DATA STRUCTURES --- //
type Slide = { img: string; name: string; subtitle: string; price: string; tag: string; tagColor: string };

const features = [
  { icon: <Droplets className="w-5 h-5 text-brand-primary" />, title: "100% Pure Water", desc: "Multi-stage RO filtration removes all contaminants, ensuring safe drinking water." },
  { icon: <Shield className="w-5 h-5 text-brand-primary" />, title: "Genuine Parts", desc: "Only certified and original spare parts for maximum lifespan." },
  { icon: <Wrench className="w-5 h-5 text-brand-primary" />, title: "Expert Technicians", desc: "Highly skilled technicians for precision installation and repair." },
  { icon: <Clock className="w-5 h-5 text-brand-primary" />, title: "Same-Day Service", desc: "Prompt after-sales support with guaranteed same-day visits." },
];

const faqs = [
  { q: "How often should I service my RO purifier?", a: "We recommend regular servicing every 3 to 4 months to maintain filter efficiency and ensure water purity. Prefilters typically need changing every 3-6 months depending on local TDS." },
  { q: "What is covered under the RO AMC plan?", a: "Our Annual Maintenance Contracts (AMC) cover unlimited service visits, scheduled filter changes, free replacement of consumable membranes, electrical parts repair, and priority emergency support." },
  { q: "Do you use original spare parts?", a: "Yes, we exclusively use 100% genuine, certified spare parts and membranes approved by manufacturers to ensure maximum lifespan and healthy filtration." },
  { q: "How quickly can a technician visit my house?", a: "We offer guaranteed same-day visits for all bookings done before 4:00 PM. Urgent emergency visits can be completed within 2 hours in most areas." },
];

export default function Home() {
  const [managedTestimonials, setManagedTestimonials] = useState<{ name: string; rating: number; review: string }[]>([]);
  const [siteServices, setSiteServices] = useState<{ title: string; desc: string; href: string; cta: string }[]>([]);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(null);
  
  // Before/After Slider State
  const [sliderPosition, setSliderPosition] = useState(50);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  const handleSliderMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  };

  const { data: productItems = [] } = useDataStore(() => ProductService.getAll());

  const managedProducts = useMemo(() => {
    return productItems.filter((item) => item.isActive && item.featured).slice(0, 4).map((item) => ({
      name: item.name,
      price: `₹${item.price}`,
      img: item.mainImageUrl ?? item.image ?? "",
      tag: item.badge ?? "Featured",
      tech: item.description ? item.description.substring(0, 40) + "..." : "RO + UV + UF",
      capacity: "15 L/hr"
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
        <Hero />

        {/* TRUST STRIP */}
        <section className="py-8 border-y border-primary-100 bg-surface">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-sm font-semibold text-brand-primary">
              <div className="flex items-center gap-2"><Award className="w-5 h-5 text-primary-500" /> {yearsExperience} Years Experience</div>
              <div className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-primary-500" /> Certified Technicians</div>
              <div className="flex items-center gap-2"><Clock className="w-5 h-5 text-primary-500" /> Same-Day Emergency Service</div>
            </div>
          </div>
        </section>

        {/* FEATURED PRODUCTS */}
        <section className="py-24 lg:py-32 bg-background">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={elegantFadeUp}>
                <h2 className="text-xs font-semibold text-slate tracking-widest uppercase mb-3">Premium Collection</h2>
                <h3 className="text-3xl sm:text-4xl font-bold text-brand-primary tracking-tight">Best-Selling Purifiers</h3>
              </motion.div>
              <Link href="/ro-sales" className="inline-flex items-center gap-2 text-brand-primary font-medium hover:text-primary-600 transition-elegant group">
                Explore Full Catalog <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {managedProducts.map((p, i) => (
                <motion.div key={p.name} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={elegantFadeUp} transition={{ delay: i * 0.1 }}>
                  <Link href="/ro-sales" className="block bg-surface rounded-2xl border border-primary-100 overflow-hidden hover:border-primary-300 transition-elegant group h-full flex flex-col">
                    <div className="h-64 bg-white p-6 flex items-center justify-center relative">
                      <img src={p.img} alt={p.name} className="h-full w-full object-contain group-hover:scale-105 transition-elegant-slow" />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <span className="text-[10px] font-bold tracking-wider uppercase text-slate mb-2">{p.tag}</span>
                      <h4 className="font-semibold text-brand-primary text-lg mb-1 leading-tight">{p.name}</h4>
                      <div className="text-xs text-slate space-y-1 mb-4 flex-1">
                        <p>{p.tech}</p>
                        <p>Capacity: {p.capacity}</p>
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        <p className="text-brand-primary font-bold text-lg">{p.price}</p>
                        <span className="text-xs font-medium text-brand-primary opacity-0 group-hover:opacity-100 transition-elegant flex items-center gap-1">
                          View Details <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* RO TECHNOLOGY SHOWCASE */}
        <section className="py-24 lg:py-32 bg-surface overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              
              {/* Left Side: Tech Specs */}
              <motion.div 
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true, margin: "-100px" }} 
                variants={staggerContainer}
                className="w-full lg:w-1/2"
              >
                <motion.h2 variants={elegantFadeUp} className="text-xs font-semibold text-slate tracking-widest uppercase mb-3">
                  Advanced RO Technology
                </motion.h2>
                <motion.h3 variants={elegantFadeUp} className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-primary tracking-tight mb-12">
                  Purity You Can Trust.
                </motion.h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                  {[
                    { title: "7 Stage Purification", desc: "Removes 99.9% of harmful contaminants.", icon: <Layers className="w-5 h-5" /> },
                    { title: "UV Protection", desc: "Deactivates bacteria and viruses completely.", icon: <Zap className="w-5 h-5" /> },
                    { title: "TDS Controller", desc: "Maintains essential natural minerals.", icon: <Settings className="w-5 h-5" /> },
                    { title: "Copper & Alkaline", desc: "Balances pH and boosts immunity naturally.", icon: <Beaker className="w-5 h-5" /> },
                    { title: "Food Grade Tank", desc: "100% safe, non-toxic water storage.", icon: <ShieldCheck className="w-5 h-5" /> },
                    { title: "Smart Auto Flush", desc: "Self-cleaning membrane for longer life.", icon: <Activity className="w-5 h-5" /> }
                  ].map((feature, i) => (
                    <motion.div key={feature.title} variants={elegantFadeUp} className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 border border-primary-100 text-primary-500 shadow-sm">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-brand-primary mb-1">{feature.title}</h4>
                        <p className="text-sm text-slate leading-relaxed">{feature.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Right Side: Floating Purifier Image */}
              <motion.div 
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true }}
                variants={elegantFadeUp}
                className="w-full lg:w-1/2 relative h-[400px] lg:h-[600px] flex items-center justify-center mt-12 lg:mt-0"
              >
                {/* Background Glow */}
                <div className="absolute inset-0 bg-primary-100/50 rounded-full blur-3xl opacity-50 scale-75" />
                
                {/* Purifier Image */}
                <motion.img 
                  src={purifierImg} 
                  alt="Premium RO Purifier" 
                  className="relative z-10 w-auto h-full max-h-[500px] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)]"
                  animate={{ y: [-15, 15, -15] }}
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                />
                
                {/* Floating Callout 1 */}
                <motion.div 
                  className="absolute top-[20%] right-[0%] lg:-right-[10%] z-20 bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl border border-primary-100 flex items-center gap-3"
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
                >
                  <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center">
                    <Droplets className="w-4 h-4 text-emerald-500" />
                  </div>
                  <span className="text-sm font-bold text-brand-primary tracking-wide">100% Pure</span>
                </motion.div>

                {/* Floating Callout 2 */}
                <motion.div 
                  className="absolute bottom-[20%] left-[0%] lg:-left-[10%] z-20 bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl border border-primary-100 flex items-center gap-3"
                  animate={{ y: [5, -5, 5] }}
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 2 }}
                >
                  <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  </div>
                  <span className="text-sm font-bold text-brand-primary tracking-wide">Safe Storage</span>
                </motion.div>
                
              </motion.div>

            </div>
          </div>
        </section>

        {/* WHY CHOOSE US */}
        <section className="py-24 lg:py-32 bg-background border-y border-primary-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={elegantFadeUp} className="text-center mb-16 max-w-2xl mx-auto">
              <h2 className="text-xs font-semibold text-slate tracking-widest uppercase mb-3">The Standard</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-brand-primary tracking-tight">Engineered for purity.</h3>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((f, i) => (
                <motion.div key={f.title} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={elegantFadeUp} transition={{ delay: i * 0.1 }} className="group text-center sm:text-left">
                  <div className="w-12 h-12 rounded-full bg-surface border border-primary-100 flex items-center justify-center mb-6 mx-auto sm:mx-0">
                    {f.icon}
                  </div>
                  <h4 className="font-semibold text-brand-primary text-lg mb-2">{f.title}</h4>
                  <p className="text-slate text-sm leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* GOOGLE REVIEW TESTIMONIALS */}
        <section className="py-24 lg:py-32 bg-surface overflow-hidden border-b border-primary-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={elegantFadeUp} className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h3 className="text-3xl sm:text-4xl font-bold text-brand-primary tracking-tight">Verified Trust.</h3>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-brand-primary">4.9 / 5.0 on Google</span>
              </div>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {managedTestimonials.slice(0, 3).map((t, i) => (
                <motion.div 
                  key={t.name} 
                  initial="hidden" 
                  whileInView="visible" 
                  viewport={{ once: true, margin: "-50px" }} 
                  variants={elegantFadeUp} 
                  transition={{ delay: i * 0.1 }} 
                  className="bg-background border border-primary-100 rounded-2xl p-8 hover:border-primary-300 transition-elegant flex flex-col justify-between"
                >
                  <div>
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className={`w-4 h-4 ${j < t.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />
                      ))}
                    </div>
                    <p className="text-brand-primary text-sm leading-relaxed mb-8">"{t.review}"</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center font-medium text-brand-primary text-sm shrink-0 border border-primary-100">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-brand-primary tracking-tight text-sm flex items-center gap-1.5">
                        {t.name}
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                      </div>
                      <span className="text-[10px] text-slate uppercase tracking-wider">Verified Purchase</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ ACCORDION */}
        <section className="py-24 lg:py-32 bg-background border-b border-primary-100">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={elegantFadeUp} className="mb-16">
              <h3 className="text-3xl font-bold text-brand-primary tracking-tight mb-2">Common Questions.</h3>
              <p className="text-slate">Everything you need to know about our services.</p>
            </motion.div>

            <div className="space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = faqOpenIndex === index;
                return (
                  <div key={index} className="border-b border-primary-100 last:border-0">
                    <button 
                      onClick={() => setFaqOpenIndex(isOpen ? null : index)}
                      className="w-full py-5 flex items-center justify-between text-left focus:outline-none group"
                    >
                      <span className="font-medium text-brand-primary text-lg group-hover:text-primary-600 transition-colors">{faq.q}</span>
                      <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDown className="w-5 h-5 text-slate" />
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
                          <div className="pb-6 text-slate text-sm leading-relaxed">
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
        <section className="py-32 bg-brand-primary relative overflow-hidden">
          {/* Subtle minimal bg pattern */}
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={elegantFadeUp}>
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">Ready for pure water?</h2>
              <p className="text-lg text-white/70 mb-10 max-w-xl mx-auto">Get in touch with our experts today for a free consultation or to schedule a service visit.</p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/service-booking" className="inline-flex items-center justify-center gap-2 bg-white text-brand-primary font-medium px-8 py-4 rounded-lg hover:bg-surface transition-elegant text-base w-full sm:w-auto">
                  Book a Service
                </Link>
                <a href={`tel:${contactNumber}`} className="inline-flex items-center justify-center gap-2 bg-transparent text-white border border-white/20 font-medium px-8 py-4 rounded-lg hover:bg-white/5 transition-elegant text-base w-full sm:w-auto">
                  <Phone className="w-4 h-4" />
                  {contactNumber}
                </a>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* STICKY WHATSAPP CTA */}
        <a 
          href={`https://wa.me/91${contactNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-elegant focus:outline-none focus:ring-4 focus:ring-green-300"
          aria-label="Contact on WhatsApp"
        >
          <MessageCircle className="w-7 h-7" />
        </a>

      </main>
    </>
  );
}
