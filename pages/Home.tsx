import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import {
  Phone, CheckCircle, Star, Droplets, Shield, Wrench,
  Clock, Award, ArrowRight, ChevronLeft, ChevronRight
} from "lucide-react";

import aquaMoorBlack from "@/assets/Aqua_Moor_(2)_1775412426683.jpg";
import aquaMoorWhite from "@/assets/Aqua_Moor_(3)_1775412426684.jpg";
import aquaMoorDark from "@/assets/Aqua_Moor_(5)_1775412426684.jpg";
import aqua2090Blue from "@/assets/Aqua2090_(2)_1775412426685.jpg";
import aqua2090Teal from "@/assets/Aqua2090_(3)_1775412426685.jpg";
import aqua2090White from "@/assets/Aqua2090_(4)_1775412426685.jpg";
import aqua2090Black from "@/assets/Aqua2090_(5)_1775412426686.jpg";
import aquaZuric from "@/assets/Aqua-Zuric-Water-Purifier._1775412426686.jpg";
import olixBlack from "@/assets/IMG_20250520_190437_1775412426686.jpg";
import olixBrown from "@/assets/IMG_20250520_190513_1775412426687.jpg";

const slides = [
  { img: aquaMoorBlack, name: "Aqua Moor Copper Alkaline", subtitle: "Premium Black Edition", price: "₹9,499", tag: "Best Seller", tagColor: "bg-amber-400 text-amber-900" },
  { img: aquaMoorWhite, name: "Aqua Moor Copper Alkaline", subtitle: "Classic White Edition", price: "₹9,499", tag: "Best Seller", tagColor: "bg-amber-400 text-amber-900" },
  { img: aquaMoorDark, name: "Aqua Moor Pro", subtitle: "Dark Pro Edition", price: "₹10,499", tag: "New", tagColor: "bg-emerald-400 text-emerald-900" },
  { img: aqua2090Blue, name: "Aqua 2090 Next", subtitle: "White & Blue Edition", price: "₹7,499", tag: "Popular", tagColor: "bg-blue-400 text-blue-900" },
  { img: aqua2090Teal, name: "Aqua 2090 Next", subtitle: "Teal Edition", price: "₹7,499", tag: "Popular", tagColor: "bg-blue-400 text-blue-900" },
  { img: aqua2090White, name: "Aqua 2090 Next", subtitle: "All White Edition", price: "₹7,499", tag: "Popular", tagColor: "bg-blue-400 text-blue-900" },
  { img: aqua2090Black, name: "Aqua 2090 Next", subtitle: "Black Edition", price: "₹7,999", tag: "Sleek", tagColor: "bg-slate-400 text-slate-900" },
  { img: aquaZuric, name: "Aqua Zuric", subtitle: "Zinc + Copper Alkaline", price: "₹11,999", tag: "Premium", tagColor: "bg-purple-400 text-purple-900" },
  { img: olixBlack, name: "OLiX LED Purifier", subtitle: "Smart LED Black", price: "₹8,299", tag: "New Arrival", tagColor: "bg-emerald-400 text-emerald-900" },
  { img: olixBrown, name: "OLiX LED Purifier", subtitle: "Smart LED Brown", price: "₹8,299", tag: "New Arrival", tagColor: "bg-emerald-400 text-emerald-900" },
];

const featuredProducts = [
  { name: "Aqua Moor Copper Alkaline", price: "₹9,499", img: aquaMoorBlack, tag: "Best Seller" },
  { name: "Aqua 2090 Next", price: "₹7,499", img: aqua2090Blue, tag: "Popular" },
  { name: "Aqua Zuric", price: "₹11,999", img: aquaZuric, tag: "Premium" },
  { name: "OLiX LED Purifier", price: "₹8,299", img: olixBlack, tag: "New" },
];

const features = [
  { icon: <Droplets className="w-6 h-6 text-blue-600" />, title: "100% Pure Water", desc: "Multi-stage RO filtration removes bacteria, viruses, chemicals ensuring safe drinking water." },
  { icon: <Shield className="w-6 h-6 text-blue-600" />, title: "Genuine Spare Parts", desc: "Only certified and original spare parts for long-lasting purifier performance." },
  { icon: <Wrench className="w-6 h-6 text-blue-600" />, title: "Expert Technicians", desc: "Skilled technicians for installation, repair, and maintenance of all RO brands." },
  { icon: <Clock className="w-6 h-6 text-blue-600" />, title: "Same-Day Service", desc: "Prompt after-sales support. Call us anytime for quick service visits." },
];

const testimonials = [
  { name: "Rajesh Kumar", rating: 5, review: "Excellent service! Technician came within 2 hours and fixed my RO. Very professional and affordable." },
  { name: "Priya Sharma", rating: 5, review: "Bought a new RO from Crystal Natural Water. Installation was smooth, water quality is amazing!" },
  { name: "Amit Patel", rating: 5, review: "Annual AMC plan is very cost-effective. No hidden charges, transparent pricing. Will renew again." },
];

function ProductSlideshow() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((p) => (p + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((p) => (p - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 3500);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <div className="relative w-full h-full flex flex-col select-none">
      <div className="relative flex-1 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800/60 to-slate-900/80 border border-white/10 backdrop-blur-sm">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current}
            initial={{ opacity: 0, x: direction * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -60 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            className="absolute inset-0 flex flex-col items-center justify-center p-6"
          >
            <div className="flex-1 flex items-center justify-center w-full">
              <img
                src={slide.img}
                alt={slide.name}
                className="max-h-56 max-w-full object-contain drop-shadow-2xl"
              />
            </div>
            <div className="w-full text-center pb-2">
              <span className={`inline-block text-xs font-bold px-3 py-0.5 rounded-full mb-2 ${slide.tagColor}`}>
                {slide.tag}
              </span>
              <p className="text-white font-bold text-lg leading-tight">{slide.name}</p>
              <p className="text-blue-300 text-sm">{slide.subtitle}</p>
              <p className="text-cyan-300 font-extrabold text-xl mt-1">{slide.price}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        <button
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-1.5 transition-colors z-10"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-1.5 transition-colors z-10"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5 mt-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
            className={`rounded-full transition-all duration-300 ${i === current ? "w-5 h-1.5 bg-cyan-400" : "w-1.5 h-1.5 bg-white/30 hover:bg-white/50"}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <title>Crystal Natural Water | RO Purifier Sales & Service</title>
      <meta name="description" content="Crystal Natural Water - Trusted RO Water Purifier Sales, Installation & Service since 2019. Domestic & Commercial RO systems, AMC plans, genuine spare parts." />

      <main>
        {/* ── Hero ── */}
        <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 text-white overflow-hidden min-h-[92vh] flex items-center">
          {/* Decorative blobs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-blue-600 opacity-10 rounded-full blur-3xl" />
            <div className="absolute -bottom-32 right-0 w-[600px] h-[600px] bg-cyan-500 opacity-10 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-700 opacity-5 rounded-full blur-3xl" />
          </div>

          <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left: Copy */}
              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-cyan-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 border border-white/15 tracking-wide uppercase">
                  <Award className="w-3.5 h-3.5" />
                  Trusted Since 2019
                </div>
                <h1 className="text-5xl sm:text-6xl font-extrabold leading-[1.1] mb-6 tracking-tight">
                  Pure Water,<br />
                  <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                    Healthy Life
                  </span>
                </h1>
                <p className="text-slate-300 text-lg leading-relaxed mb-8 max-w-lg">
                  Crystal Provides expert RO purifier sales, installation, repair, and Annual Maintenance Contracts for homes and businesses across India.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-10">
                  <Link
                    href="/service-booking"
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-orange-400 text-slate-900 font-bold px-7 py-3.5 rounded-xl hover:from-amber-300 hover:to-orange-300 transition-all text-base shadow-lg shadow-amber-500/25"
                  >
                    Book a Service <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a
                    href="tel:9584024777"
                    className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white font-bold px-7 py-3.5 rounded-xl hover:bg-white/10 hover:border-white/50 transition-all text-base"
                  >
                    <Phone className="w-4 h-4 text-cyan-300" />
                    9584024777
                  </a>
                </div>
                <div className="flex flex-wrap gap-5">
                  {["5+ Years Experience", "500+ Happy Customers", "All RO Brands", "Same Day Service"].map((item) => (
                    <div key={item} className="flex items-center gap-1.5 text-sm text-slate-400">
                      <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Slideshow */}
              <div className="hidden lg:flex flex-col" style={{ height: "420px" }}>
                <ProductSlideshow />
              </div>
            </div>
          </div>

          {/* Bottom wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 28C840 36 960 42 1080 38C1200 34 1320 20 1380 13L1440 6V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z" fill="rgb(248 250 252)" />
            </svg>
          </div>
        </section>

        {/* ── Mobile Slideshow ── */}
        <section className="lg:hidden bg-slate-900 px-4 py-8">
          <div style={{ height: "380px" }}>
            <ProductSlideshow />
          </div>
        </section>

        {/* ── Trust bar ── */}
        <section className="bg-slate-50 border-b border-slate-200 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-8">
              {[
                { label: "500+", sub: "Happy Customers" },
                { label: "5+", sub: "Years Experience" },
                { label: "All", sub: "RO Brands Serviced" },
                { label: "Same Day", sub: "Service Available" },
              ].map((s) => (
                <div key={s.sub} className="text-center">
                  <div className="text-blue-700 font-extrabold text-xl">{s.label}</div>
                  <div className="text-slate-500 text-xs">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-2">Why Us</p>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Why Choose Crystal Natural Water?</h2>
              <p className="text-slate-500 text-lg max-w-2xl mx-auto">Committed to delivering pure, safe drinking water through quality products and prompt support.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((f) => (
                <div key={f.title} className="group bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-slate-200 hover:shadow-lg hover:border-blue-200 transition-all duration-300">
                  <div className="bg-white inline-flex p-3 rounded-xl shadow-sm mb-4 group-hover:shadow-md transition-shadow">{f.icon}</div>
                  <h3 className="font-bold text-slate-900 text-base mb-2">{f.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Featured Products ── */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-1">Products</p>
                <h2 className="text-3xl font-extrabold text-slate-900">Featured Models</h2>
              </div>
              <Link href="/ro-sales" className="hidden sm:inline-flex items-center gap-1 text-blue-600 font-semibold text-sm hover:text-blue-800 transition-colors">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.map((p) => (
                <Link
                  key={p.name}
                  href="/ro-sales"
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden group"
                >
                  <div className="bg-gradient-to-b from-slate-100 to-slate-50 p-4 flex items-center justify-center" style={{ height: "180px" }}>
                    <img src={p.img} alt={p.name} className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md" />
                  </div>
                  <div className="p-4">
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">{p.tag}</span>
                    <h3 className="font-bold text-slate-900 text-sm mt-2 mb-1 leading-tight">{p.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-700 font-extrabold text-base">{p.price}</span>
                      <span className="text-xs text-blue-500 font-medium group-hover:translate-x-1 transition-transform inline-block">→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/ro-sales" className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold px-7 py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20">
                View All Products <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Services ── */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-2">What We Do</p>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Our Services</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "RO Purifier Sales", desc: "Wide range of domestic and commercial RO systems from trusted brands at competitive prices.", href: "/ro-sales", cta: "View Products", accent: "blue" },
                { title: "AMC Plans", desc: "Affordable Annual Maintenance Contract plans to keep your RO running perfectly year-round.", href: "/amc-plans", cta: "See Plans", accent: "indigo" },
                { title: "Book a Service", desc: "Installation, repair, filter change, or general checkup — our technicians are just a call away.", href: "/service-booking", cta: "Book Now", accent: "cyan" },
              ].map((s) => (
                <div key={s.title} className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-shadow flex flex-col">
                  <h3 className="font-bold text-slate-900 text-xl mb-2">{s.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed flex-1 mb-4">{s.desc}</p>
                  <Link href={s.href} className="inline-flex items-center gap-1 text-blue-600 font-semibold text-sm hover:text-blue-800 transition-colors">
                    {s.cta} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-2">Reviews</p>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-3">What Our Customers Say</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div key={t.name} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4 italic">"{t.review}"</p>
                  <div className="font-semibold text-slate-900 text-sm">— {t.name}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20 bg-gradient-to-r from-slate-900 via-blue-900 to-blue-800 text-white relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-16 right-0 w-96 h-96 bg-cyan-500 opacity-10 rounded-full blur-3xl" />
            <div className="absolute -bottom-16 left-0 w-96 h-96 bg-blue-400 opacity-10 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-extrabold mb-3 tracking-tight">Ready for Pure Water?</h2>
            <p className="text-blue-200 text-lg mb-10 max-w-xl mx-auto">Contact us today for a free consultation or to book a service visit at your doorstep.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/service-booking"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-orange-400 text-slate-900 font-bold px-9 py-4 rounded-xl hover:from-amber-300 hover:to-orange-300 transition-all text-base shadow-lg shadow-amber-500/25"
              >
                Book a Service <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="tel:9584024777"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white font-bold px-9 py-4 rounded-xl hover:bg-white/10 hover:border-white/50 transition-all text-base"
              >
                <Phone className="w-4 h-4 text-cyan-300" />
                9584024777
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
