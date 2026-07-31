import { Link } from "wouter";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { AmcService } from "@/services/amc.service";
import { FaqService } from "@/services/content.service";
import { SettingsService } from "@/services/settings.service";
import purifierImg from "@/assets/newfolder/purifier-Photoroom.png";
import { 
  Phone, CheckCircle2, X, ArrowRight, ShieldCheck, Sparkles, 
  Droplets, Shield, Wrench, Clock, Award, Star
} from "lucide-react";

// Elegant motion variants
const elegantFadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

type ManagedPlan = {
  id: string;
  name: string;
  price: number;
  priceStr: string;
  period: string;
  isPopular: boolean;
  badge: string | null;
  description: string;
  serviceVisits: number;
  sparePartsCovered: boolean;
  prioritySupport: boolean;
  details: {
    maintenance: string;
    coverage: string;
  };
};

const planStaticDetails = [
  {
    desc: "Essential protection to keep your purifier running smoothly.",
    btnText: "Learn More",
    isPopular: false,
    orderClass: "order-2 md:order-1",
    cardStyle: "bg-white/90 border-slate-200 text-brand-primary hover:shadow-xl md:scale-[0.97]",
    btnStyle: "bg-slate-100 text-brand-primary hover:bg-slate-200",
    badgeStyle: "hidden",
    details: {
      maintenance: "Basic preventive checkup & filter cleaning to maintain standard water flow.",
      coverage: "Includes 2 engineer visits. Spare parts and replacement filters charged extra."
    }
  },
  {
    desc: "The perfect balance of comprehensive care and smart value.",
    btnText: "Choose Complete Care",
    isPopular: true,
    orderClass: "order-1 md:order-2 z-10",
    cardStyle: "bg-gradient-to-b from-blue-50/80 to-white/90 border-primary-300 ring-2 ring-primary-500/20 shadow-xl md:scale-105 hover:shadow-2xl hover:border-primary-400",
    btnStyle: "bg-gradient-to-r from-primary-600 to-blue-600 text-white hover:brightness-110",
    badgeStyle: "flex bg-gradient-to-r from-primary-600 to-blue-600 text-white border border-white/20",
    details: {
      maintenance: "Complete preventive servicing, chemical cleaning, and performance inspection.",
      coverage: "3 service visits, 100% genuine spare parts covered, and standard emergency calls."
    }
  },
  {
    desc: "Ultimate peace of mind with complete, zero-cost repair coverage.",
    btnText: "Talk to an Expert",
    isPopular: false,
    orderClass: "order-3 md:order-3",
    cardStyle: "bg-slate-900 border-slate-800 text-white hover:shadow-2xl md:scale-[0.97] hover:border-amber-500/30",
    btnStyle: "bg-amber-500 text-slate-950 hover:bg-amber-600 font-extrabold",
    badgeStyle: "flex bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950",
    details: {
      maintenance: "Unlimited preventive servicing, booster pump checkup, and membrane flushing.",
      coverage: "4 service visits, full filter kit replacement, priority emergency dispatch, and 24/7 support."
    }
  }
];

export default function AMCPlans() {
  const [managedPlans, setManagedPlans] = useState<ManagedPlan[]>([]);
  const [faqs, setFaqs] = useState<{ q: string; a: string }[]>([]);
  const [contactNumber, setContactNumber] = useState("6359585515");
  const [whatsappNumber, setWhatsappNumber] = useState("916359585515");
  const [selectedFeature, setSelectedFeature] = useState("spareParts");

  useEffect(() => {
    AmcService.getAll().then((items) =>
      setManagedPlans(
        items
          .filter((item) => item.isActive)
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .map((item, index) => {
            const staticInfo = planStaticDetails[index % planStaticDetails.length];
            return {
              id: item.id.toString(),
              name: item.name,
              price: Number(item.price),
              priceStr: `₹${Number(item.price).toLocaleString("en-IN")}`,
              period: "/year",
              isPopular: staticInfo.isPopular,
              badge: index === 1 ? "Best Value" : null,
              description: staticInfo.desc,
              serviceVisits: item.serviceVisits,
              sparePartsCovered: item.sparePartsCovered,
              prioritySupport: item.prioritySupport,
              details: staticInfo.details
            };
          }),
      ),
    );
    FaqService.getAll().then((items) =>
      setFaqs(
        items
          .filter((item) => item.isActive && item.category === "AMC")
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .map((item) => ({ q: item.question, a: item.answer })),
      ),
    );
    SettingsService.getAll().then((s) => {
      setContactNumber(s.contactNumber ?? "6359585515");
      setWhatsappNumber(s.whatsappNumber ?? "916359585515");
    });
  }, []);

  const featuresComparisonList = [
    { 
      id: "spareParts", 
      label: "Spare Parts", 
      desc: "How replacement filters, booster pumps, and electrical parts are covered.",
      planBenefits: {
        Basic: "Not covered. Filters and parts are charged at standard retail rates.",
        Complete: "All regular replacement filters and consumable parts are fully covered.",
        Premium: "100% comprehensive coverage. Includes free RO membrane and pump replacement."
      }
    },
    { 
      id: "serviceVisits", 
      label: "Service Visits", 
      desc: "Scheduled preventive maintenance calls to check water quality.",
      planBenefits: {
        Basic: "2 scheduled engineer visits per year for general inspection.",
        Complete: "3 scheduled engineer visits per year with thorough internal cleaning.",
        Premium: "4 scheduled engineer visits per year plus unlimited breakdown visits."
      }
    },
    { 
      id: "emergencySupport", 
      label: "Emergency Support", 
      desc: "Turnaround times for unexpected leaks or functional issues.",
      planBenefits: {
        Basic: "Standard support. Breakdown calls resolved within 48 hours.",
        Complete: "Fast-tracked support. Response and resolution guaranteed within 24 hours.",
        Premium: "Instant emergency support. VIP engineer dispatched on priority within 4 hours."
      }
    },
    { 
      id: "priorityService", 
      label: "Priority Service", 
      desc: "Position in the service queue during peak seasons.",
      planBenefits: {
        Basic: "Standard queue placement depending on engineer availability.",
        Complete: "Priority queue scheduling ahead of regular service clients.",
        Premium: "First priority scheduling. Booking always served first by senior engineers."
      }
    },
  ];

  const currentCompFeature = featuresComparisonList.find(f => f.id === selectedFeature) || featuresComparisonList[0];

  return (
    <>
      <Helmet>
        <title>Protection Plans | Crystal Natural Water - RO Annual Maintenance</title>
        <meta name="description" content="Affordable RO Water Purifier Annual Maintenance Contract (AMC) plans by Crystal Water. Premium servicing, certified technicians, and genuine parts." />
      </Helmet>

      {/* Main Container with subtle mesh gradient background */}
      <main className="bg-gradient-to-b from-blue-50 via-white to-blue-50/20 min-h-screen selection:bg-brand-primary selection:text-white relative overflow-hidden font-sans">
        
        {/* Soft, blurred radial water highlights for premium depth */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-3xl pointer-events-none z-0" />
        <div className="absolute top-[800px] left-1/4 w-[600px] h-[600px] bg-primary-100/15 rounded-full blur-3xl pointer-events-none z-0" />

        {/* 1. HERO SECTION */}
        <section className="relative pt-40 pb-24 z-10 text-center">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
              <motion.div variants={elegantFadeUp} className="inline-flex items-center gap-2 bg-white/90 backdrop-blur border border-primary-100/80 px-4 py-2 rounded-full shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-brand-primary">Annual RO Protection</span>
              </motion.div>
              
              <motion.h1 variants={elegantFadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-primary leading-tight">
                Protect Your RO. <br className="hidden sm:block" /> Protect Your Family.
              </motion.h1>
              
              <motion.p variants={elegantFadeUp} className="text-base sm:text-lg text-slate/85 max-w-2xl mx-auto leading-relaxed">
                Enjoy continuous access to 100% pure water. Our certified engineers keep your water purifier performing like new all year round.
              </motion.p>

              {/* Minimalist Trust indicators */}
              <motion.div variants={elegantFadeUp} className="pt-6">
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-xs sm:text-sm font-bold text-slate/85">
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Genuine Spare Parts</span>
                  <span className="text-slate/30 hidden sm:inline">•</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Certified Engineers</span>
                  <span className="text-slate/30 hidden sm:inline">•</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Transparent Service</span>
                  <span className="text-slate/30 hidden sm:inline">•</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> WhatsApp Support</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* 2. WHY CHOOSE ANNUAL PROTECTION SECTION (Statistics-Based Proof) */}
        <section className="py-20 z-10 relative">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-primary tracking-tight">
                Why Thousands of Families Choose Annual Protection
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { metric: "Certified", label: "Engineers", desc: "Experienced technicians trained to service all major RO brands." },
                { metric: "100%", label: "Genuine Parts", desc: "Only original replacement components for reliable performance." },
                { metric: "Preventive", label: "Maintenance", desc: "Regular servicing helps maintain consistent water quality." },
                { metric: "Transparent", label: "Service", desc: "Clear upfront pricing with absolutely no hidden charges." }
              ].map((stat, idx) => (
                <div key={idx} className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-100 p-8 shadow-sm text-center sm:text-left flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <span className="block text-3xl font-extrabold text-brand-primary tracking-tight mb-1">{stat.metric}</span>
                    <span className="block text-sm font-bold text-primary-600 uppercase tracking-wider mb-4">{stat.label}</span>
                  </div>
                  <p className="text-slate text-sm font-medium leading-relaxed">{stat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PREMIUM PHOTOGRAPHY SPLIT INTERLUDE */}
        <section className="py-12 z-10 relative">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="rounded-3xl overflow-hidden shadow-2xl relative h-[380px] sm:h-[450px]">
              <img 
                src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80" 
                alt="Modern premium kitchen environment" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/80 via-brand-primary/45 to-transparent flex items-center p-8 sm:p-16">
                <div className="max-w-md text-white space-y-4">
                  <span className="text-amber-400 font-extrabold uppercase tracking-widest text-xs">Premium Quality</span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Pure, Safe Drinking Water Every Day</h3>
                  <p className="text-primary-100/90 text-sm font-medium leading-relaxed">
                    Regular servicing prevents microbial build-up and maintains optimal mineral content, safeguarding the health of your loved ones.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. HOW OUR AMC WORKS SECTION (Zig-Zag Layout) */}
        <section className="py-24 bg-blue-50/40 border-y border-primary-100/50 z-10 relative">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-xs font-bold text-slate tracking-widest uppercase mb-3">Service Timeline</h2>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-brand-primary tracking-tight">How Our AMC Works</h3>
            </div>

            <div className="relative border-l border-primary-100/80 md:border-l-0 space-y-16">
              
              {/* Step 1: Left aligned on Desktop */}
              <div className="relative flex flex-col md:flex-row md:justify-start items-start md:items-center pl-8 md:pl-0">
                <div className="absolute left-0 md:left-1/2 -translate-x-[17px] md:-translate-x-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-primary-600 text-white font-extrabold text-xs shadow-md border-4 border-white">
                  1
                </div>
                <div className="w-full md:w-[45%] bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100 md:mr-auto">
                  <h4 className="font-extrabold text-lg text-brand-primary mb-2">Book Your Plan</h4>
                  <p className="text-slate text-sm font-medium leading-relaxed">
                    Select your protection plan and coordinate a convenient time slot via website checkout or direct WhatsApp scheduling.
                  </p>
                </div>
              </div>

              {/* Step 2: Right aligned on Desktop */}
              <div className="relative flex flex-col md:flex-row md:justify-end items-start md:items-center pl-8 md:pl-0">
                <div className="absolute left-0 md:left-1/2 -translate-x-[17px] md:-translate-x-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-primary-600 text-white font-extrabold text-xs shadow-md border-4 border-white">
                  2
                </div>
                <div className="w-full md:w-[45%] bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100 md:ml-auto">
                  <h4 className="font-extrabold text-lg text-brand-primary mb-2">Certified Engineer Visit</h4>
                  <p className="text-slate text-sm font-medium leading-relaxed">
                    A professional technician visits your home with full equipment, sanitizing parts and examining the system layout.
                  </p>
                </div>
              </div>

              {/* Step 3: Left aligned on Desktop */}
              <div className="relative flex flex-col md:flex-row md:justify-start items-start md:items-center pl-8 md:pl-0">
                <div className="absolute left-0 md:left-1/2 -translate-x-[17px] md:-translate-x-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-primary-600 text-white font-extrabold text-xs shadow-md border-4 border-white">
                  3
                </div>
                <div className="w-full md:w-[45%] bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100 md:mr-auto">
                  <h4 className="font-extrabold text-lg text-brand-primary mb-2">Water Quality & TDS Check</h4>
                  <p className="text-slate text-sm font-medium leading-relaxed">
                    We measure post-purification TDS (Total Dissolved Solids) and pH levels to guarantee clean taste and healthy mineral density.
                  </p>
                </div>
              </div>

              {/* Step 4: Right aligned on Desktop */}
              <div className="relative flex flex-col md:flex-row md:justify-end items-start md:items-center pl-8 md:pl-0">
                <div className="absolute left-0 md:left-1/2 -translate-x-[17px] md:-translate-x-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-primary-600 text-white font-extrabold text-xs shadow-md border-4 border-white">
                  4
                </div>
                <div className="w-full md:w-[45%] bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100 md:ml-auto">
                  <h4 className="font-extrabold text-lg text-brand-primary mb-2">Scheduled Maintenance</h4>
                  <p className="text-slate text-sm font-medium leading-relaxed">
                    Receive auto-scheduled filter replacements and preventive checks before contaminants affect your drinking water.
                  </p>
                </div>
              </div>

              {/* Step 5: Left aligned on Desktop */}
              <div className="relative flex flex-col md:flex-row md:justify-start items-start md:items-center pl-8 md:pl-0">
                <div className="absolute left-0 md:left-1/2 -translate-x-[17px] md:-translate-x-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500 text-white font-extrabold text-xs shadow-md border-4 border-white">
                  ✓
                </div>
                <div className="w-full md:w-[45%] bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100 md:mr-auto">
                  <h4 className="font-extrabold text-lg text-brand-primary mb-2">Peace of Mind</h4>
                  <p className="text-slate text-sm font-medium leading-relaxed">
                    Your RO purifier runs continuously with full coverage. Our service line is open 24/7 for support.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 4. CHOOSE YOUR PROTECTION SECTION (Service Packages) */}
        <section className="py-24 z-10 relative">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-xs font-bold text-slate tracking-widest uppercase mb-3">Service Packages</h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-brand-primary tracking-tight">Select Your Protection Plan</h3>
            </div>

            <div className="flex flex-col md:flex-row gap-8 md:gap-4 items-stretch justify-center max-w-5xl mx-auto">
              {managedPlans.map((plan, i) => {
                const staticInfo = planStaticDetails[i % planStaticDetails.length] || planStaticDetails[0];
                return (
                  <motion.div
                    key={plan.name}
                    initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={elegantFadeUp} transition={{ delay: i * 0.1 }}
                    className={`flex flex-col border rounded-[2rem] p-8 sm:p-10 transition-all duration-350 ease-out hover:-translate-y-1.5 flex-1 relative ${staticInfo.cardStyle} ${staticInfo.orderClass}`}
                  >
                    {/* Floating Premium Badge */}
                    {plan.badge && (
                      <div className={`absolute -top-4 inset-x-0 mx-auto w-max px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest shadow-md ${staticInfo.badgeStyle}`}>
                        <Sparkles className="w-3.5 h-3.5 mr-1 inline" /> {plan.badge}
                      </div>
                    )}

                    {/* Card Header & Description */}
                    <div className="mb-6 flex-1">
                      <h4 className="text-2xl font-extrabold tracking-tight mb-2">{plan.name}</h4>
                      <p className={`text-sm mb-6 ${plan.isPopular ? "text-slate/85" : plan.price === 2999 ? "text-slate-300" : "text-slate"}`}>
                        {plan.description}
                      </p>
                      
                      <div className="flex items-baseline gap-1 mb-2">
                        <span className="text-4xl font-extrabold tracking-tight">{plan.priceStr}</span>
                        <span className={`text-sm ${plan.price === 2999 ? "text-slate-400" : "text-slate"}`}>/ year</span>
                      </div>
                      <span className={`text-xs font-bold ${plan.isPopular ? "text-primary-600" : plan.price === 2999 ? "text-amber-400" : "text-slate/70"}`}>
                        (Equivalent to ₹{Math.round(plan.price / 12)}/month)
                      </span>
                    </div>

                    <div className="border-t border-current/10 my-6" />

                    {/* Card Features List (Clean, Grouped Text - No Icons/Checkmarks) */}
                    <div className="space-y-6 flex-1 mb-8">
                      <div>
                        <span className="block text-[10px] font-extrabold uppercase tracking-widest mb-1.5 opacity-60">Maintenance</span>
                        <p className={`text-sm leading-relaxed font-semibold ${plan.price === 2999 ? "text-slate-200" : "text-brand-primary"}`}>
                          {plan.details.maintenance}
                        </p>
                      </div>
                      
                      <div>
                        <span className="block text-[10px] font-extrabold uppercase tracking-widest mb-1.5 opacity-60">Coverage</span>
                        <p className={`text-sm leading-relaxed font-semibold ${plan.price === 2999 ? "text-slate-200" : "text-brand-primary"}`}>
                          {plan.details.coverage}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-current/10 my-6" />

                    {/* Action-oriented CTA Button */}
                    <a
                      href={`tel:${contactNumber}`}
                      className={`w-full flex items-center justify-center gap-1.5 font-extrabold py-4 rounded-2xl transition-all duration-300 text-sm shadow-sm ${staticInfo.btnStyle}`}
                    >
                      {staticInfo.btnText} <ArrowRight className="w-4 h-4 shrink-0" />
                    </a>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECOND PHOTOGRAPHY INTERLUDE */}
        <section className="py-8 z-10 relative">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="rounded-3xl overflow-hidden h-[250px] shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80" 
                  alt="Certified engineer servicing water purifier" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="rounded-3xl overflow-hidden h-[250px] shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=600&q=80" 
                  alt="Clear glass of clean drinking water" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 5. INTERACTIVE FEATURE COMPARISON SECTION */}
        <section className="py-24 bg-blue-50/40 border-y border-primary-100/50 z-10 relative">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-xs font-bold text-slate tracking-widest uppercase mb-3">Feature Focus</h2>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-brand-primary tracking-tight">Compare Feature Details</h3>
            </div>

            {/* Selector Buttons */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {featuresComparisonList.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFeature(f.id)}
                  className={`px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider border transition-all duration-300 shadow-xs ${
                    selectedFeature === f.id
                      ? "bg-brand-primary text-white border-brand-primary"
                      : "bg-white text-brand-primary border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Interactive display area */}
            <div className="bg-white rounded-3xl border border-slate-100 p-8 sm:p-10 shadow-md">
              <div className="mb-8">
                <h4 className="text-lg font-extrabold text-brand-primary mb-2">{currentCompFeature.label}</h4>
                <p className="text-slate text-sm font-medium">{currentCompFeature.desc}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(currentCompFeature.planBenefits).map(([planName, benefitText], idx) => {
                  const isComp = planName === "Complete";
                  const isPrem = planName === "Premium";
                  return (
                    <div 
                      key={planName} 
                      className={`p-6 rounded-2xl border transition-all duration-300 ${
                        isPrem 
                          ? "bg-slate-900 text-white border-slate-800" 
                          : isComp 
                            ? "bg-blue-50/50 border-primary-200 text-brand-primary" 
                            : "bg-white border-slate-100 text-brand-primary"
                      }`}
                    >
                      <span className="block text-[10px] font-extrabold uppercase tracking-widest mb-3 opacity-60">{planName} Care</span>
                      <p className="text-sm font-semibold leading-relaxed">{benefitText}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>


        {/* 7. FAQ SECTION */}
        <section className="py-24 bg-blue-50/40 border-t border-primary-100/50 z-10 relative">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-brand-primary tracking-tight mb-4">Frequently Asked Questions</h2>
              <p className="text-slate text-base font-medium">Everything you need to know about our plans.</p>
            </div>
            
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <motion.div key={faq.q} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={elegantFadeUp} transition={{ delay: i * 0.1 }} className="bg-white rounded-2xl p-6 sm:p-8 border border-primary-100/80 hover:border-primary-300 transition-all shadow-xs">
                  <h3 className="font-extrabold text-brand-primary text-base sm:text-lg mb-3">{faq.q}</h3>
                  <p className="text-slate leading-relaxed text-sm font-semibold">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. EMOTIONAL CTA SECTION */}
        <section className="py-24 z-10 relative">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <div className="bg-gradient-to-r from-brand-primary to-blue-900 rounded-[2.5rem] p-10 sm:p-16 text-white text-center relative overflow-hidden shadow-2xl">
              
              {/* Decorative radial overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.2),transparent)]" />
              
              <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  Enjoy clean, safe drinking water all year.
                </h2>
                <p className="text-primary-100 text-base sm:text-lg leading-relaxed font-medium">
                  Our certified engineers will keep your purifier performing like new. Book a preventive checkup today.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <a 
                    href={`https://wa.me/${whatsappNumber}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-extrabold px-8 py-4 rounded-xl hover:shadow-lg transition-all duration-300 text-base"
                  >
                    <Phone className="w-5 h-5 fill-white text-emerald-500 shrink-0" />
                    Book Free Inspection
                  </a>
                  <Link 
                    href="/contact" 
                    className="inline-flex items-center justify-center gap-2 border border-primary-700 bg-transparent text-white font-extrabold px-8 py-4 rounded-xl hover:bg-white/10 transition-all duration-300 text-base"
                  >
                    Talk to an Expert <ArrowRight className="w-4 h-4 shrink-0" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
