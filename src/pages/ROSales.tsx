import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Phone, CheckCircle2, ArrowRight, ShieldCheck, Truck, Headphones, Droplets } from "lucide-react";
import { ProductService } from "@/services/product.service";
import { SettingsService } from "@/services/settings.service";
import { useDataStore } from "@/hooks/useDataStore";

// Elegant motion variants
const elegantFadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function ROSales() {
  const { data: productItems = [] } = useDataStore(() => ProductService.getAll());
  const [contactNumber, setContactNumber] = useState("9584024777");
  const [extraModels, setExtraModels] = useState<{ img: string; name: string }[]>([]);

  const catalog = useMemo(() => {
    return productItems
      .filter((item) => item.isActive)
      .map((item) => ({
        ...item,
        subtitle: item.model ?? item.brand ?? "RO Purifier",
        originalPrice: item.discountPrice ? `₹${Number(item.discountPrice).toLocaleString("en-IN")}` : undefined,
        price: `₹${Number(item.price).toLocaleString("en-IN")}`,
        tag: item.badge ?? "Featured",
        desc: item.description ?? "Premium RO water purifier with advanced multi-stage filtration for your health.",
        image: item.mainImageUrl ?? item.image,
      }));
  }, [productItems]);

  useEffect(() => {
    const active = productItems.filter((item) => item.isActive);
    setExtraModels(
      active
        .flatMap((item) => {
          const images = item.images ?? item.variants ?? [];
          return images.slice(1).map((img, index) => ({
            img,
            name: `${item.name} ${item.model ? `— ${item.model}` : ""} (Variant ${index + 2})`.trim(),
          }));
        })
        .slice(0, 4),
    );
  }, [productItems]);

  useEffect(() => {
    SettingsService.getAll().then((s) => setContactNumber(s.contactNumber ?? "9584024777"));
  }, []);

  return (
    <>
      <Helmet>
        <title>Premium RO Purifiers | Crystal Natural Water</title>
        <meta name="description" content="Explore our premium range of RO Water Purifiers. Advanced filtration, smart features, and unmatched service quality. Shop Crystal Natural Water." />
      </Helmet>

      <main className="bg-background min-h-screen">
        {/* HEADER */}
        <section className="relative pt-40 pb-24 bg-surface overflow-hidden border-b border-primary-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-3xl mx-auto">
              <motion.div variants={elegantFadeUp} className="inline-flex items-center gap-2 text-slate font-semibold uppercase tracking-widest text-xs mb-6">
                <Droplets className="w-4 h-4 text-primary-500" /> The Standard
              </motion.div>
              <motion.h1 variants={elegantFadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1] text-brand-primary">
                Purifiers for a <br className="hidden sm:block" /> Healthier Tomorrow
              </motion.h1>
              <motion.p variants={elegantFadeUp} className="text-lg text-slate leading-relaxed mb-10 max-w-2xl mx-auto font-medium">
                Discover our curated selection of advanced RO systems featuring multi-stage filtration, sleek designs, and comprehensive warranty coverage.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* TRUST STRIP */}
        <section className="bg-white border-b border-primary-100 sticky top-[72px] z-30">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-wrap gap-8 justify-center py-4">
              {[
                { icon: <Truck className="w-4 h-4 text-primary-500" />, text: "Free Installation" },
                { icon: <ShieldCheck className="w-4 h-4 text-primary-500" />, text: "Genuine Parts Guarantee" },
                { icon: <Headphones className="w-4 h-4 text-primary-500" />, text: "Priority Support" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2 text-sm text-brand-primary font-semibold tracking-tight">
                  {item.icon}
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRODUCT GRID */}
        <section className="py-24 lg:py-32 bg-background">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {catalog.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={elegantFadeUp} transition={{ delay: i * 0.1 }}
                  className="bg-surface rounded-2xl border border-primary-100 overflow-hidden hover:border-primary-300 transition-elegant flex flex-col group"
                >
                  <div className="relative bg-white overflow-hidden h-[300px] flex items-center justify-center p-8 border-b border-primary-100">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-elegant-slow"
                    />
                    <span className="absolute top-5 left-5 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded border border-primary-200 text-brand-primary bg-white shadow-sm">
                      {p.tag}
                    </span>
                  </div>

                  <div className="p-8 flex flex-col flex-1">
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-slate tracking-widest uppercase mb-1">{p.subtitle}</p>
                      <h2 className="font-bold text-brand-primary text-2xl tracking-tight leading-tight group-hover:text-primary-600 transition-colors">{p.name}</h2>
                    </div>

                    <p className="text-slate text-sm leading-relaxed mb-6 flex-1 font-medium">{p.desc}</p>

                    <div className="space-y-2 mb-8 flex-1 border-t border-primary-100 pt-6">
                      {(p.features ?? []).map((f: string) => (
                        <div key={f} className="flex items-start gap-3 text-sm text-brand-primary font-medium">
                          <CheckCircle2 className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-end justify-between mb-6 pt-6 border-t border-primary-100">
                      <div>
                        <p className="text-xs text-slate font-medium mb-1">Starting Price</p>
                        <div className="flex items-baseline gap-3">
                          <span className="text-2xl font-bold text-brand-primary tracking-tight">{p.price}</span>
                          {p.originalPrice && <span className="text-sm text-slate font-medium line-through">{p.originalPrice}</span>}
                        </div>
                      </div>
                    </div>

                    <a
                      href={`tel:${contactNumber}`}
                      className="w-full flex items-center justify-center gap-2 bg-brand-primary text-white font-medium py-3 rounded-lg hover:bg-primary-900 transition-elegant text-sm group"
                    >
                      <Phone className="w-4 h-4" />
                      Quick Enquiry
                      <ArrowRight className="w-4 h-4 opacity-75 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="py-32 bg-brand-primary text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Not sure which model is right for you?</h2>
            <p className="text-lg text-primary-200 mb-10 font-medium max-w-2xl mx-auto">Talk to our experts. We'll analyze your water quality and recommend the perfect purifier for your needs.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={`tel:${contactNumber}`} className="inline-flex items-center justify-center gap-2 bg-white text-brand-primary font-medium px-8 py-4 rounded-lg hover:bg-surface transition-elegant text-base">
                <Phone className="w-4 h-4" />
                Call an Expert
              </a>
              <Link href="/service-booking" className="inline-flex items-center justify-center gap-2 bg-transparent border border-white/20 text-white font-medium px-8 py-4 rounded-lg hover:bg-white/10 transition-elegant text-base">
                Book a Demo <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
