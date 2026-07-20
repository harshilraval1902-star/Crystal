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
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
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
        <title>Premium RO Purifiers | Crystal Water Solutions</title>
        <meta name="description" content="Explore our premium range of RO Water Purifiers. Advanced filtration, smart features, and unmatched service quality. Shop Crystal Water." />
      </Helmet>

      <main className="bg-background min-h-screen">
        {/* HEADER */}
        <section className="relative pt-32 pb-24 bg-brand-primary overflow-hidden border-b border-primary-800 text-white">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-32 right-0 w-[500px] h-[500px] bg-brand-secondary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-[-100px] w-[300px] h-[300px] bg-white/5 rounded-full blur-2xl" />
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-3xl mx-auto">
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 text-brand-secondary font-bold uppercase tracking-widest text-sm mb-6">
                <Droplets className="w-4 h-4" /> The Crystal Standard
              </motion.div>
              <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
                Water Purifiers for a <br className="hidden sm:block" /> <span className="text-gradient">Healthier Tomorrow</span>
              </motion.h1>
              <motion.p variants={fadeUp} className="text-lg text-primary-200 leading-relaxed mb-10 max-w-2xl mx-auto">
                Discover our curated selection of advanced RO systems featuring multi-stage filtration, sleek designs, and comprehensive warranty coverage.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* TRUST STRIP */}
        <section className="bg-white border-b border-gray-100 sticky top-[72px] z-30 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-8 justify-center py-4">
              {[
                { icon: <Truck className="w-5 h-5 text-brand-secondary" />, text: "Free Next-Day Installation" },
                { icon: <ShieldCheck className="w-5 h-5 text-brand-secondary" />, text: "Genuine Parts Guarantee" },
                { icon: <Headphones className="w-5 h-5 text-brand-secondary" />, text: "24/7 Priority Support" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                  {item.icon}
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRODUCT GRID */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {catalog.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-primary-900/5 hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden group"
                >
                  <div className="relative bg-gradient-to-b from-gray-50 to-white overflow-hidden h-[280px] flex items-center justify-center p-8 border-b border-gray-50">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-xl"
                    />
                    <span className="absolute top-5 left-5 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-brand-primary text-white shadow-sm">
                      {p.tag}
                    </span>
                  </div>

                  <div className="p-8 flex flex-col flex-1">
                    <div className="mb-4">
                      <p className="text-xs font-bold text-brand-secondary tracking-widest uppercase mb-1">{p.subtitle}</p>
                      <h2 className="font-extrabold text-gray-900 text-2xl tracking-tight leading-tight">{p.name}</h2>
                    </div>

                    <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1">{p.desc}</p>

                    <div className="space-y-2.5 mb-8 flex-1">
                      {(p.features ?? []).map((f: string) => (
                        <div key={f} className="flex items-start gap-3 text-sm text-gray-600 font-medium">
                          <CheckCircle2 className="w-5 h-5 text-brand-accent shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-end justify-between mb-6 pt-6 border-t border-gray-100">
                      <div>
                        <p className="text-xs text-gray-500 font-medium mb-1">Total Price</p>
                        <div className="flex items-baseline gap-3">
                          <span className="text-3xl font-extrabold text-gray-900 tracking-tight">{p.price}</span>
                          {p.originalPrice && <span className="text-sm text-gray-400 font-medium line-through">{p.originalPrice}</span>}
                        </div>
                      </div>
                    </div>

                    <a
                      href={`tel:${contactNumber}`}
                      className="w-full flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-4 rounded-xl hover:bg-primary-800 active:scale-[0.98] transition-all text-base shadow-md shadow-brand-primary/20"
                    >
                      <Phone className="w-5 h-5" />
                      Order Now
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* EXTRA VARIANTS */}
        {extraModels.length > 0 && (
          <section className="py-24 bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-sm font-bold text-brand-secondary tracking-widest uppercase mb-2">More Options</h2>
                <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">Alternative Variants</h3>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {extraModels.map((item, i) => (
                  <motion.div key={item.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }} className="bg-gray-50 rounded-3xl border border-gray-100 p-6 text-center hover:bg-white hover:shadow-xl hover:border-gray-200 transition-all duration-300 group">
                    <div className="h-40 flex items-center justify-center mb-6">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-md"
                      />
                    </div>
                    <p className="text-sm font-bold text-gray-900 mb-2 leading-tight">{item.name}</p>
                    <a href={`tel:${contactNumber}`} className="text-sm font-semibold text-brand-secondary hover:text-brand-primary transition-colors flex items-center justify-center gap-1">
                      Call for Pricing <ArrowRight className="w-4 h-4" />
                    </a>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* BOTTOM CTA */}
        <section className="py-24 bg-brand-primary text-white relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[-50%] right-[-10%] w-[50%] h-[100%] rounded-full bg-brand-secondary/10 blur-3xl"></div>
          </div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight">Not sure which model is right for you?</h2>
            <p className="text-xl text-primary-200 mb-10">Talk to our experts. We'll analyze your water quality and recommend the perfect purifier for your needs.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={`tel:${contactNumber}`} className="inline-flex items-center justify-center gap-2 bg-brand-secondary text-brand-primary font-bold px-8 py-4 rounded-xl hover:bg-white transition-all text-lg shadow-lg shadow-brand-secondary/20 hover:-translate-y-0.5">
                <Phone className="w-5 h-5" />
                Call an Expert
              </a>
              <Link href="/service-booking" className="inline-flex items-center justify-center gap-2 border border-primary-700 bg-primary-800 text-white font-bold px-8 py-4 rounded-xl hover:bg-primary-700 transition-all text-lg hover:-translate-y-0.5">
                Book a Demo <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
