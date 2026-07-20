import { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { ProductService } from "@/services/product.service";
import { useDataStore } from "@/hooks/useDataStore";
import { TestimonialService } from "@/services/testimonial.service";
import { SiteServiceService } from "@/services/content.service";
import { SettingsService } from "@/services/settings.service";
import {
  Phone, CheckCircle2, Star, Droplets, Shield, Wrench,
  Clock, Award, ArrowRight, ChevronLeft, ChevronRight, Check
} from "lucide-react";

// Animation Variants
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const features = [
  { icon: <Droplets className="w-6 h-6 text-brand-primary" />, title: "100% Pure Water", desc: "Multi-stage RO filtration removes bacteria, viruses, and chemicals, ensuring safe drinking water." },
  { icon: <Shield className="w-6 h-6 text-brand-secondary" />, title: "Genuine Parts", desc: "Only certified and original spare parts for long-lasting purifier performance." },
  { icon: <Wrench className="w-6 h-6 text-brand-accent" />, title: "Expert Technicians", desc: "Skilled technicians for installation, repair, and maintenance of all RO brands." },
  { icon: <Clock className="w-6 h-6 text-purple-500" />, title: "Same-Day Service", desc: "Prompt after-sales support. Call us anytime for quick service visits." },
];

const TAG_COLORS: Record<string, string> = {
  "Best Seller": "bg-amber-100 text-amber-800 border border-amber-200",
  Popular: "bg-blue-100 text-blue-800 border border-blue-200",
  Premium: "bg-purple-100 text-purple-800 border border-purple-200",
  "New Arrival": "bg-emerald-100 text-emerald-800 border border-emerald-200",
  New: "bg-emerald-100 text-emerald-800 border border-emerald-200",
  Sleek: "bg-slate-100 text-slate-800 border border-slate-200",
};

type Slide = { img: string; name: string; subtitle: string; price: string; tag: string; tagColor: string };

function ProductSlideshow({ slides }: { slides: Slide[] }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = useCallback(() => {
    if (!slides.length) return;
    setDirection(1);
    setCurrent((p) => (p + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    if (!slides.length) return;
    setDirection(-1);
    setCurrent((p) => (p - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (!slides.length) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next, slides.length]);

  if (!slides.length) return null;

  const slide = slides[current];

  return (
    <div className="relative w-full h-[500px] flex flex-col select-none rounded-[2rem] bg-white border border-gray-100 shadow-2xl shadow-primary-900/5 overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-secondary/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl -ml-20 -mb-20"></div>
      
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={current}
          initial={{ opacity: 0, x: direction * 40, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: direction * -40, scale: 0.95 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 flex flex-col items-center justify-between p-10"
        >
          <div className="flex-1 flex items-center justify-center w-full">
            <img
              src={slide.img}
              alt={slide.name}
              className="max-h-72 max-w-full object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.1)]"
            />
          </div>
          <div className="w-full text-center mt-6">
            <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-3 shadow-sm ${slide.tagColor}`}>
              {slide.tag}
            </span>
            <p className="text-gray-900 font-extrabold text-2xl tracking-tight">{slide.name}</p>
            <p className="text-gray-500 text-sm mt-1">{slide.subtitle}</p>
            <p className="text-brand-primary font-bold text-xl mt-2">{slide.price}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 text-gray-700 rounded-full p-2.5 shadow-lg border border-gray-100 transition-all z-10 hover:scale-110 active:scale-95">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 text-gray-700 rounded-full p-2.5 shadow-lg border border-gray-100 transition-all z-10 hover:scale-110 active:scale-95">
        <ChevronRight className="w-5 h-5" />
      </button>
      
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
            className={`rounded-full transition-all duration-300 ${i === current ? "w-6 h-1.5 bg-brand-primary" : "w-1.5 h-1.5 bg-gray-300 hover:bg-gray-400"}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [managedTestimonials, setManagedTestimonials] = useState<{ name: string; rating: number; review: string }[]>([]);
  const [siteServices, setSiteServices] = useState<{ title: string; desc: string; href: string; cta: string }[]>([]);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
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
          const tag = item.badge ?? "Featured";
          const tagColor = TAG_COLORS[tag] ?? "bg-brand-primary text-white";
          return images.map((img, index) => ({
            img,
            name: item.name,
            subtitle: index === 0 ? (item.model ?? item.brand ?? "RO Purifier") : `${item.model ?? item.brand ?? "Edition"} ${index + 1}`,
            price: `₹${Number(item.price).toLocaleString("en-IN")}`,
            tag,
            tagColor,
          }));
        }),
    );

    TestimonialService.getAll().then((items) =>
      setManagedTestimonials(
        items.filter((item) => item.isActive).map((item) => ({
          name: item.customerName,
          rating: item.rating,
          review: item.review,
        })),
      ),
    );
    SiteServiceService.getAll().then((items) =>
      setSiteServices(
        items
          .filter((item) => item.isActive)
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .map((item) => ({ title: item.title, desc: item.description, href: item.href, cta: item.cta })),
      ),
    );
    SettingsService.getAll().then(setSettings);
  }, [productItems]);

  const contactNumber = settings.contactNumber ?? "9584024777";
  const yearsExperience = settings.yearsExperience ?? "5+";
  const happyCustomers = settings.happyCustomers ?? "500+";

  return (
    <>
      <Helmet>
        <title>Crystal Water | Premium RO Purifier Sales & Service</title>
        <meta name="description" content="Crystal Water - Trusted RO Water Purifier Sales, Installation & Service since 2019. Premium AMC plans, genuine spare parts." />
      </Helmet>

      <main className="bg-background selection:bg-brand-primary selection:text-white">
        {/* HERO SECTION */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden border-b border-gray-100">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-secondary/5 blur-3xl"></div>
            <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] rounded-full bg-brand-primary/5 blur-3xl"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-2xl">
                <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-100 shadow-sm mb-8 text-sm font-semibold text-brand-primary">
                  <Award className="w-4 h-4 text-brand-secondary" />
                  Trusted By {happyCustomers} Families
                </motion.div>
                
                <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.05] mb-6">
                  {settings.homeHeroTitle?.split(".")[0] ?? "Pure Water."},<br />
                  <span className="text-gradient">
                    {settings.homeHeroTitle?.split(".")[1]?.trim() || "Better Health."}
                  </span>
                </motion.h1>
                
                <motion.p variants={fadeUp} className="text-lg sm:text-xl text-gray-500 leading-relaxed mb-10 max-w-lg">
                  {settings.homeHeroSubtitle ?? "Crystal Water provides premium RO purifier sales, installation, repair, and smart AMC plans for homes and businesses."}
                </motion.p>
                
                <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 mb-12">
                  <Link href="/service-booking" className="inline-flex items-center justify-center gap-2 bg-brand-primary text-white font-semibold px-8 py-4 rounded-xl hover:bg-primary-800 transition-all shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/30 hover:-translate-y-0.5 active:translate-y-0 text-base">
                    Book Service <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link href="/ro-sales" className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 border border-gray-200 font-semibold px-8 py-4 rounded-xl hover:bg-gray-50 transition-all hover:border-gray-300 text-base">
                    Explore Products
                  </Link>
                </motion.div>
                
                <motion.div variants={fadeUp} className="flex flex-wrap gap-6 items-center text-sm font-medium text-gray-500">
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-brand-accent" /> Same Day Service</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-brand-accent" /> Genuine Parts</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-brand-accent" /> {yearsExperience} Years Exp.</div>
                </motion.div>
              </motion.div>
              
              <motion.div initial={{ opacity: 0, scale: 0.9, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="hidden lg:block relative">
                <ProductSlideshow slides={slides} />
              </motion.div>
            </div>
          </div>
        </section>

        {/* MOBILE SLIDESHOW FALLBACK */}
        <section className="lg:hidden px-4 py-8 bg-gray-50 border-b border-gray-100">
          <ProductSlideshow slides={slides} />
        </section>

        {/* BENTO BOX FEATURES */}
        <section className="py-24 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="text-center mb-16 max-w-2xl mx-auto">
              <h2 className="text-sm font-bold text-brand-secondary tracking-widest uppercase mb-3">The Crystal Standard</h2>
              <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Engineered for purity, designed for peace of mind.</h3>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((f, i) => (
                <motion.div key={f.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }} className="group bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:bg-white hover:shadow-xl hover:shadow-primary-900/5 hover:border-gray-200 transition-all duration-300">
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    {f.icon}
                  </div>
                  <h4 className="font-bold text-gray-900 text-lg mb-3">{f.title}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED PRODUCTS (SaaS Style) */}
        <section className="py-24 bg-gray-50 border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <h2 className="text-sm font-bold text-brand-secondary tracking-widest uppercase mb-3">Premium Collection</h2>
                <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">Best-Selling Purifiers</h3>
              </motion.div>
              <Link href="/ro-sales" className="inline-flex items-center gap-2 text-brand-primary font-semibold hover:text-brand-secondary transition-colors">
                View All Collection <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {managedProducts.map((p, i) => (
                <motion.div key={p.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }}>
                  <Link href="/ro-sales" className="block bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-primary-900/5 hover:-translate-y-1 transition-all duration-300 group">
                    <div className="h-48 bg-gray-50 p-6 flex items-center justify-center relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <img src={p.img} alt={p.name} className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-md relative z-10" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-bold tracking-wide uppercase text-brand-secondary">{p.tag}</span>
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg mb-1 leading-tight group-hover:text-brand-primary transition-colors">{p.name}</h4>
                      <p className="text-brand-primary font-extrabold text-xl mt-4">{p.price}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16 max-w-2xl mx-auto">
              <h2 className="text-sm font-bold text-brand-secondary tracking-widest uppercase mb-3">Expert Care</h2>
              <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">Complete Service Solutions</h3>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {siteServices.map((s, i) => (
                <motion.div key={s.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:border-gray-200 transition-all flex flex-col h-full group">
                  <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-brand-primary group-hover:text-white transition-colors text-brand-primary">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-gray-900 text-xl mb-3">{s.title}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-1">{s.desc}</p>
                  <Link href={s.href} className="inline-flex items-center gap-2 text-brand-primary font-semibold text-sm group-hover:text-brand-secondary transition-colors mt-auto">
                    {s.cta} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-24 bg-brand-primary text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl -mr-[400px] -mt-[400px]"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-16">
              <h2 className="text-sm font-bold text-brand-secondary tracking-widest uppercase mb-3">Wall of Love</h2>
              <h3 className="text-3xl font-extrabold text-white tracking-tight">Trusted by thousands.</h3>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {managedTestimonials.slice(0, 3).map((t, i) => (
                <motion.div key={t.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }} className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/10 hover:bg-white/15 transition-colors">
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-primary-100 text-base leading-relaxed mb-6 font-medium">"{t.review}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-secondary/20 flex items-center justify-center font-bold text-brand-secondary">
                      {t.name.charAt(0)}
                    </div>
                    <div className="font-bold text-white">{t.name}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-white relative">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">Ready to upgrade your water?</h2>
              <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">Get in touch with our experts today for a free consultation or to schedule a service visit.</p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/service-booking" className="inline-flex items-center justify-center gap-2 bg-brand-primary text-white font-semibold px-8 py-4 rounded-xl hover:bg-primary-800 transition-all shadow-lg shadow-brand-primary/20 hover:-translate-y-0.5 text-lg">
                  Book a Service
                </Link>
                <a href={`tel:${contactNumber}`} className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 border border-gray-200 font-semibold px-8 py-4 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all text-lg">
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
