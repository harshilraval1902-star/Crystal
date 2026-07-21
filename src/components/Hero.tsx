import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, Phone } from "lucide-react";
import bgImg from "@/assets/newfolder/BG.png";
import purifier1 from "@/assets/newfolder/purifier-Photoroom.png";
import purifier2 from "@/assets/newfolder/Gemini_Generated_Image_af4odsaf4odsaf4o-Photoroom.png";
import purifier3 from "@/assets/newfolder/Gemini_Generated_Image_azuxplazuxplazux-Photoroom.png";

const purifiers = [
  { id: 1, img: purifier1, name: "Zuric White Edition" },
  { id: 2, img: purifier2, name: "Zuric Copper Gold" },
  { id: 3, img: purifier3, name: "Refocus Your Life Black" },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((p) => (p + 1) % purifiers.length);
  const prevSlide = () => setCurrentSlide((p) => (p - 1 + purifiers.length) % purifiers.length);

  // Auto slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-[100vh] min-h-[800px] flex flex-col overflow-hidden bg-[#0A0F1C]">
      
      {/* 1. Full-screen premium interior background image */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80 mix-blend-screen"
          style={{ backgroundImage: `url(${bgImg})` }}
        />
        {/* Soft gradient overlay for depth and text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Navigation Layer handled globally */}

      {/* Main Content Area */}
      <div className="relative z-20 flex-1 w-full max-w-7xl mx-auto px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between h-full pb-10">
        
        {/* Left: Typography & CTAs */}
        <div className="w-full lg:w-[50%] flex flex-col items-start pt-10 lg:pt-0">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.05] mb-6 drop-shadow-2xl">
            Pure Water.<br />
            Zero Compromise.
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 leading-relaxed font-medium mb-10 max-w-lg drop-shadow-md">
            Protect your family with premium RO purifiers, expert installation, and fast doorstep service backed by trusted professionals.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Link 
              href="/service-booking" 
              className="inline-flex items-center justify-center bg-emerald-500 text-white font-bold px-8 py-4 rounded-xl hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
            >
              Book Service
            </Link>
            <Link 
              href="/ro-sales" 
              className="inline-flex items-center justify-center bg-black/40 backdrop-blur-md border border-white/10 text-white font-medium px-8 py-4 rounded-xl hover:bg-black/60 transition-all text-gray-200"
            >
              Explore Products &rarr;
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="bg-[#1A1A1A]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-wrap gap-x-6 gap-y-3 w-full sm:w-auto">
            {[
              "Expert Installation",
              "AMC Available",
              "Multi-Brand Support",
              "Fast Doorstep Service",
              "Genuine Spare Parts"
            ].map((trust) => (
              <span key={trust} className="inline-flex items-center gap-2 text-white/80 text-xs font-semibold uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {trust}
              </span>
            ))}
          </div>
        </div>

        {/* Right: Product Slider (3D Carousel) */}
        <div className="w-full lg:w-[50%] h-[50vh] lg:h-full relative flex flex-col items-center justify-center mt-12 lg:mt-0">
          <div className="relative w-full h-[70%] flex items-center justify-center">
            <AnimatePresence mode="popLayout">
              {purifiers.map((p, i) => {
                const isActive = i === currentSlide;
                const isPrev = i === (currentSlide - 1 + purifiers.length) % purifiers.length;
                const isNext = i === (currentSlide + 1) % purifiers.length;

                if (!isActive && !isPrev && !isNext && purifiers.length > 3) return null;

                let x = 0;
                let scale = 1;
                let zIndex = 30;
                let opacity = 1;
                let blur = 0;

                if (isPrev) { x = -120; scale = 0.7; zIndex = 10; opacity = 0.4; blur = 4; }
                if (isNext) { x = 120; scale = 0.7; zIndex = 10; opacity = 0.4; blur = 4; }

                return (
                  <motion.div
                    key={p.id}
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ x, scale, zIndex, opacity, filter: `blur(${blur}px)` }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <img 
                      src={p.img} 
                      alt={p.name} 
                      className="max-h-full w-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Slider Controls */}
          <div className="absolute bottom-10 flex flex-col items-center gap-4">
            <p className="text-white/60 text-xs font-bold tracking-widest uppercase">
              Discover More Models
            </p>
            <div className="flex items-center gap-6">
              <button onClick={prevSlide} className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors backdrop-blur-sm">
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex gap-2">
                {purifiers.map((_, idx) => (
                  <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === idx ? "w-8 bg-emerald-400" : "w-2 bg-white/30"}`} />
                ))}
              </div>

              <button onClick={nextSlide} className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors backdrop-blur-sm">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Feature */}
      <a 
        href="https://wa.me/919584024777" 
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
      >
        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
        </svg>
      </a>
    </section>
  );
}
