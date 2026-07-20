import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft, ChevronRight, Award, Star, CheckCircle2,
  Shield, Wrench, Clock, Leaf, Users, ArrowRight
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

type Slide = { img: string; name: string; subtitle: string; price: string; tag: string; tagColor: string };

interface HeroProps {
  slides: Slide[];
  settings: Record<string, string>;
  yearsExperience: string;
}

export default function Hero({ slides, settings, yearsExperience }: HeroProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

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

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      action();
    }
  };

  useEffect(() => {
    if (!slides.length || isPaused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, slides.length, isPaused]);

  if (!slides.length) return null;
  const slide = slides[current];

  return (
    <section className="relative pt-32 pb-40 lg:pt-40 lg:pb-32 overflow-hidden bg-[#0A0F1C] min-h-[850px] flex items-center">
      {/* Subtle Premium Background Glow */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand-secondary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-brand-primary/10 blur-[120px] rounded-full" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-16 lg:gap-10">
          
          {/* LEFT COLUMN: TEXT */}
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={staggerContainer} 
            className="w-full lg:w-[50%] flex flex-col items-center text-center lg:items-start lg:text-left z-20"
          >
            <motion.div 
              variants={fadeUp} 
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 shadow-sm mb-8 text-xs font-semibold tracking-widest uppercase text-white/90"
            >
              <Users className="w-3.5 h-3.5 text-brand-secondary" />
              India's Most Trusted RO Brand
            </motion.div>
            
            <motion.h1 
              variants={fadeUp} 
              className="text-[48px] sm:text-[64px] lg:text-[76px] xl:text-[88px] font-extrabold text-white tracking-[-0.04em] leading-[1.05] mb-6"
            >
              Pure Water,<br />
              Healthy Life,<br />
              Better Life.
            </motion.h1>
            
            <motion.p 
              variants={fadeUp} 
              className="text-lg sm:text-xl text-gray-400 leading-relaxed mb-10 max-w-md font-medium"
            >
              {settings.homeHeroSubtitle ?? "Advanced RO Water Purifiers for your home. Pure. Safe. Healthy."}
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 mb-8 w-full sm:w-auto">
              <Link 
                href="/ro-sales" 
                className="inline-flex items-center justify-center gap-3 bg-white text-[#0A0F1C] font-semibold px-8 py-4 rounded-full shadow-[0_4px_14px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-transform duration-300 text-base group"
              >
                Explore RO Products <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link 
                href="/service-booking" 
                className="inline-flex items-center justify-center gap-3 bg-transparent text-white border border-white/20 font-semibold px-8 py-4 rounded-full hover:bg-white/5 transition-colors duration-300 active:scale-[0.98] text-base group"
              >
                Book Service <ArrowRight className="w-4 h-4 text-gray-400 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
            
          </motion.div>
          
          {/* RIGHT COLUMN: SLIDESHOW */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }} 
            className="w-full lg:w-[50%] relative z-10"
            aria-roledescription="carousel"
            aria-label="Featured Products"
          >
            <div 
              className="relative w-full h-[600px] lg:h-[700px] flex items-center justify-center select-none"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={current}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const }}
                  className="absolute inset-0 flex items-center justify-center lg:justify-end"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(e, { offset }) => {
                    if (offset.x < -40) next();
                    else if (offset.x > 40) prev();
                  }}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${current + 1} of ${slides.length}`}
                >
                  {/* Top Right Product Info */}
                  <motion.div 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="absolute top-10 right-0 z-20 text-right hidden lg:block"
                  >
                    <span className="inline-block text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-white/10 text-white/90 mb-2 border border-white/10">
                      {slide.tag}
                    </span>
                    <h3 className="font-bold text-white text-2xl tracking-tight leading-tight">{slide.name}</h3>
                    <p className="text-gray-400 text-sm font-medium mb-1">{slide.subtitle}</p>
                    <p className="text-white font-semibold text-3xl mb-1 tracking-tight">{slide.price}</p>
                    <div className="flex items-center justify-end gap-1.5 text-brand-secondary font-medium text-xs mt-2">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 1 Year Warranty
                    </div>
                  </motion.div>

                  <div className="relative z-10 w-full h-full flex flex-col items-center justify-end pb-12 lg:pb-20">
                    {/* Main Image floating */}
                    <motion.div
                      animate={{ y: [-3, 3, -3] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="relative flex items-center justify-center w-full"
                    >
                      <img
                        src={slide.img}
                        alt={slide.name}
                        className="max-h-[350px] lg:max-h-[450px] w-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)] relative z-10"
                        draggable={false}
                      />
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Progress Dots Bottom */}
              <div className="absolute bottom-6 left-0 right-0 flex justify-center lg:justify-end lg:pr-32 gap-3 z-40">
                <button 
                  onClick={prev} 
                  onKeyDown={(e) => handleKeyDown(e, prev)}
                  className="hover:text-brand-secondary transition-colors hidden lg:block focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary rounded-full"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-500 hover:text-white transition-colors" />
                </button>
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    onKeyDown={(e) => handleKeyDown(e, () => setCurrent(i))}
                    aria-label={`Go to slide ${i + 1}`}
                    aria-current={i === current ? "true" : "false"}
                    className={`rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary ${
                      i === current ? "w-8 h-1.5 bg-brand-secondary" : "w-2 h-1.5 bg-white/20 hover:bg-white/40"
                    }`}
                  />
                ))}
                <button 
                  onClick={next} 
                  onKeyDown={(e) => handleKeyDown(e, next)}
                  className="hover:text-brand-secondary transition-colors hidden lg:block focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary rounded-full"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-5 h-5 text-gray-500 hover:text-white transition-colors" />
                </button>
              </div>
            </div>
          </motion.div>
          
        </div>
      </div>

      {/* FULL WIDTH TRUST BAR (Overlapping bottom) */}
      <div className="absolute bottom-6 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-30 hidden lg:block">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.4, duration: 0.4 }} 
          className="w-full bg-[#0A0F1C]/80 backdrop-blur-xl border border-white/5 shadow-2xl rounded-2xl py-6 px-10 grid grid-cols-5 gap-6 divide-x divide-white/5"
        >
          {[
            { icon: <Shield className="w-5 h-5" />, title: "100%", sub: "Pure & Safe Water" },
            { icon: <Wrench className="w-5 h-5" />, title: "Expert", sub: "Technicians" },
            { icon: <Clock className="w-5 h-5" />, title: "Same Day", sub: "Service" },
            { icon: <Award className="w-5 h-5" />, title: "Genuine", sub: "Spare Parts" },
            { icon: <Leaf className="w-5 h-5" />, title: "Eco Friendly", sub: "Technology" },
          ].map((item, i) => (
            <div key={i} className={`flex items-center gap-4 group cursor-default ${i !== 0 ? 'pl-6' : ''}`}>
              <div className="text-gray-400 group-hover:text-brand-secondary transition-colors duration-300 shrink-0">
                {item.icon}
              </div>
              <div>
                <h4 className="text-white/90 font-semibold text-[14px] tracking-tight">{item.title}</h4>
                <p className="text-gray-500 text-[11px] font-medium">{item.sub}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
