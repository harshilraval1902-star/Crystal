import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Phone, CheckCircle2, ArrowRight, ShieldCheck, Truck, Headphones, Droplets } from "lucide-react";
import { ProductService } from "@/services/product.service";
import { SettingsService } from "@/services/settings.service";
import { useDataStore } from "@/hooks/useDataStore";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } }
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
        <section className="relative pt-40 pb-28 bg-[#0A0F1C] overflow-hidden border-b border-primary-800 text-white">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-32 right-0 w-[500px] h-[500px] bg-brand-secondary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-[-100px] w-[300px] h-[300px] bg-white/5 rounded-full blur-2xl" />
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-3xl mx-auto">
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 text-brand-secondary font-black uppercase tracking-widest text-xs mb-6">
                <Droplets className="w-4 h-4" /> The Crystal Natural Water Standard
              </motion.div>
              <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-none">
                Water Purifiers for a <br className="hidden sm:block" /> <span className="text-gradient from-[#00F2FE] to-[#4FACFE]">Healthier Tomorrow</span>
              </motion.h1>
              <motion.p variants={fadeUp} className="text-lg text-gray-300 leading-relaxed mb-10 max-w-2xl mx-auto font-medium">
                Discover our curated selection of advanced RO systems featuring multi-stage filtration, sleek designs, and comprehensive warranty coverage.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* TRUST STRIP (Glassmorphism Sticky) */}
        <section className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-[72px] z-30 shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-8 justify-center py-4.5">
              {[
                { icon: <Truck className="w-5 h-5 text-brand-primary" />, text: "Free Next-Day Installation" },
                { icon: <ShieldCheck className="w-5 h-5 text-brand-primary" />, text: "Genuine Parts Guarantee" },
                { icon: <Headphones className="w-5 h-5 text-brand-primary" />, text: "24/7 Priority Support" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3 text-sm text-gray-700 font-extrabold tracking-tight">
                  {item.icon}
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRODUCT GRID */}
        <section className="py-24 lg:py-32 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {catalog.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-primary-900/10 hover:scale-[1.01] transition-all duration-500 flex flex-col group"
                >
                  <div className="relative bg-gray-50/50 overflow-hidden h-[300px] flex items-center justify-center p-8 border-b border-gray-100">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-700 ease-[0.16,1,0.3,1] drop-shadow-2xl"
                    />
                    <span className="absolute top-5 left-5 text-[9px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-brand-primary text-white shadow-sm">
                      {p.tag}
                    </span>
                  </div>

                  <div className="p-8 flex flex-col flex-1">
                    <div className="mb-4">
                      <p className="text-xs font-black text-brand-secondary tracking-widest uppercase mb-1">{p.subtitle}</p>
                      <h2 className="font-extrabold text-[#0A0F1C] text-2xl tracking-tight leading-tight group-hover:text-brand-primary transition-colors">{p.name}</h2>
                    </div>

                    <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1 font-medium">{p.desc}</p>

                    <div className="space-y-3 mb-8 flex-1 border-t border-gray-100 pt-6">
                      {(p.features ?? []).map((f: string) => (
                        <div key={f} className="flex items-start gap-3 text-sm text-gray-600 font-semibold">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-end justify-between mb-6 pt-6 border-t border-gray-100">
                      <div>
                        <p className="text-xs text-gray-500 font-medium mb-1">Total Price</p>
                        <div className="flex items-baseline gap-3">
                          <span className="text-3xl font-black text-[#0A0F1C] tracking-tight">{p.price}</span>
                          {p.originalPrice && <span className="text-sm text-gray-400 font-medium line-through">{p.originalPrice}</span>}
                        </div>
                      </div>
                    </div>

                    <a
                      href={`tel:${contactNumber}`}
                      className="w-full flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-4.5 rounded-2xl hover:bg-primary-800 active:scale-[0.98] transition-all text-base shadow-xl shadow-brand-primary/20 hover:shadow-brand-primary/40 group"
                    >
                      <Phone className="w-5 h-5" />
                      Order Now
                      <ArrowRight className="w-4 h-4 opacity-75 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* EXTRA VARIANTS */}
        {extraModels.length > 0 && (
          <section className="py-24 lg:py-32 bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-xs font-black text-brand-secondary tracking-widest uppercase mb-3">More Options</h2>
                <h3 className="text-3xl font-extrabold text-[#0A0F1C] tracking-tight">Alternative Variants</h3>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {extraModels.map((item, i) => (
                  <motion.div key={item.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }} className="bg-gray-50 rounded-3xl border border-gray-100 p-6 text-center hover:bg-white hover:shadow-2xl hover:shadow-primary-900/10 hover:border-gray-200 hover:scale-\[1.02\] transition-all duration-300 group">
                    <div className="h-40 flex items-center justify-center mb-6">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-md"
                      />
                    </div>
                    <p className="text-sm font-bold text-gray-900 mb-2 leading-tight">{item.name}</p>
                    <a href={`tel:${contactNumber}`} className="text-sm font-bold text-brand-secondary hover:text-brand-primary transition-colors flex items-center justify-center gap-1">
                      Call for Pricing <ArrowRight className="w-4 h-4" />
                    </a>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* BOTTOM CTA */}
        <section className="py-32 bg-[#0A0F1C] text-white relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[-50%] right-[-10%] w-[50%] h-[100%] rounded-full bg-brand-secondary/10 blur-3xl"></div>
          </div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight">Not sure which model is right for you?</h2>
            <p className="text-xl text-gray-300 mb-10 font-medium">Talk to our experts. We'll analyze your water quality and recommend the perfect purifier for your needs.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={`tel:${contactNumber}`} className="inline-flex items-center justify-center gap-2 bg-brand-primary text-white font-bold px-10 py-4.5 rounded-full hover:bg-primary-800 transition-all text-base shadow-xl shadow-brand-primary/20 hover:shadow-brand-primary/40 hover:scale-\[1.02\] group">
                <Phone className="w-5 h-5 animate-bounce-slow" />
                Call an Expert
              </a>
              <Link href="/service-booking" className="inline-flex items-center justify-center gap-2 bg-transparent border border-white/20 text-white font-bold px-10 py-4.5 rounded-full hover:bg-white/10 hover:border-white/30 transition-all text-base hover:scale-\[1.02\]">
                Book a Demo <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
