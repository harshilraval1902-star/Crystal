import { Link } from "wouter";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { AmcService } from "@/services/amc.service";
import { FaqService } from "@/services/content.service";
import { SettingsService } from "@/services/settings.service";
import { Phone, CheckCircle2, X, ArrowRight, ShieldCheck, Sparkles, Plus } from "lucide-react";

const elegantFadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const AMC_STYLES = [
  {
    borderClass: "border-primary-100 hover:border-primary-300",
    headerBg: "bg-surface",
    headerText: "text-brand-primary",
    btnClass: "bg-white text-brand-primary border border-primary-200 hover:bg-surface",
    period: "/year",
    isPopular: false,
  },
  {
    borderClass: "border-brand-primary shadow-sm scale-[1.02]",
    headerBg: "bg-brand-primary text-white",
    headerText: "text-white",
    btnClass: "bg-white text-brand-primary hover:bg-surface border border-transparent",
    period: "/year",
    isPopular: true,
  },
  {
    borderClass: "border-primary-100 hover:border-primary-300",
    headerBg: "bg-surface",
    headerText: "text-brand-primary",
    btnClass: "bg-white text-brand-primary border border-primary-200 hover:bg-surface",
    period: "/year",
    isPopular: false,
  },
];

type ManagedPlan = {
  name: string;
  price: string;
  period: string;
  borderClass: string;
  headerBg: string;
  headerText: string;
  btnClass: string;
  isPopular: boolean;
  badge: string | null;
  features: { text: string; included: boolean }[];
};

export default function AMCPlans() {
  const [managedPlans, setManagedPlans] = useState<ManagedPlan[]>([]);
  const [faqs, setFaqs] = useState<{ q: string; a: string }[]>([]);
  const [contactNumber, setContactNumber] = useState("9584024777");

  useEffect(() => {
    AmcService.getAll().then((items) =>
      setManagedPlans(
        items
          .filter((item) => item.isActive)
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .map((item, index) => {
            const style = AMC_STYLES[index % AMC_STYLES.length];
            return {
              name: item.name,
              price: `₹${Number(item.price).toLocaleString("en-IN")}`,
              period: style.period,
              borderClass: style.borderClass,
              headerBg: style.headerBg,
              headerText: style.headerText,
              btnClass: style.btnClass,
              isPopular: style.isPopular,
              badge: item.badge ?? null,
              features: [
                { text: item.description ?? "Annual RO maintenance", included: true },
                { text: `${item.serviceVisits} service visit${item.serviceVisits > 1 ? "s" : ""}`, included: true },
                { text: item.sparePartsCovered ? "Spare parts covered" : "Genuine spare parts (extra)", included: item.sparePartsCovered },
                { text: item.prioritySupport ? "Priority support" : "Standard support", included: item.prioritySupport },
              ],
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
    SettingsService.getAll().then((s) => setContactNumber(s.contactNumber ?? "9584024777"));
  }, []);

  return (
    <>
      <Helmet>
        <title>AMC Plans | Crystal Natural Water - RO Annual Maintenance</title>
        <meta name="description" content="Affordable RO Water Purifier Annual Maintenance Contract (AMC) plans by Crystal Natural Water. Regular servicing, filter changes, and priority support." />
      </Helmet>

      <main className="bg-background min-h-screen">
        {/* HEADER SECTION */}
        <section className="relative pt-40 pb-32 overflow-hidden border-b border-primary-100 bg-surface">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-3xl mx-auto">
              <motion.div variants={elegantFadeUp} className="inline-flex items-center gap-2 text-slate font-semibold uppercase tracking-widest text-xs mb-6">
                <ShieldCheck className="w-4 h-4 text-primary-500" /> Peace of Mind
              </motion.div>
              <motion.h1 variants={elegantFadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-brand-primary leading-tight">
                Simple, transparent <br className="hidden sm:block" /> maintenance plans
              </motion.h1>
              <motion.p variants={elegantFadeUp} className="text-lg text-slate leading-relaxed mb-10 max-w-2xl mx-auto font-medium">
                Protect your family's health and your purifier's lifespan with our comprehensive Annual Maintenance Contracts. No surprise costs.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* PRICING CARDS */}
        <section className="relative -mt-16 pb-24 z-20">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              {managedPlans.map((plan, i) => (
                <motion.div
                  key={plan.name}
                  initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={elegantFadeUp} transition={{ delay: i * 0.1 }}
                  className={`bg-white rounded-2xl border ${plan.borderClass} flex flex-col relative transition-elegant ${plan.isPopular ? "md:-mt-8 z-10" : "shadow-sm"}`}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-4 inset-x-0 flex justify-center z-10">
                      <span className="flex items-center gap-1.5 bg-brand-primary text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-sm uppercase tracking-wider border border-primary-700">
                        <Sparkles className="w-3 h-3" /> Most Popular
                      </span>
                    </div>
                  )}

                  <div className={`p-8 rounded-t-2xl border-b border-primary-100 ${plan.headerBg}`}>
                    <h3 className={`font-semibold text-xl mb-4 ${plan.headerText}`}>{plan.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-4xl font-bold tracking-tight ${plan.headerText}`}>{plan.price}</span>
                      <span className={`text-sm font-medium ${plan.isPopular ? "text-primary-200" : "text-slate"}`}>{plan.period}</span>
                    </div>
                  </div>

                  <div className="p-8 flex flex-col flex-1 bg-white rounded-b-2xl">
                    <ul className="space-y-4 mb-8 flex-1">
                      {plan.features.map((f) => (
                        <li key={f.text} className={`flex items-start gap-3 text-sm font-medium ${f.included ? "text-brand-primary" : "text-primary-300 line-through"}`}>
                          {f.included
                            ? <CheckCircle2 className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                            : <X className="w-4 h-4 text-primary-200 shrink-0 mt-0.5" />
                          }
                          <span>{f.text}</span>
                        </li>
                      ))}
                    </ul>
                    <a
                      href={`tel:${contactNumber}`}
                      className={`w-full flex items-center justify-center gap-2 font-medium py-3.5 rounded-lg transition-elegant text-sm group ${plan.btnClass}`}
                    >
                      Subscribe Plan
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* COMPARISON/BENEFITS */}
        <section className="py-24 lg:py-32 bg-background border-t border-primary-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-xs font-semibold text-slate tracking-widest uppercase mb-3">Why AMC?</h2>
              <h3 className="text-3xl font-bold text-brand-primary tracking-tight">Benefits of Annual Maintenance</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Pure Water Guarantee", desc: "Regular filter changes ensure your water stays 100% safe." },
                { title: "Zero Repair Costs", desc: "Premium plans cover all electronic and mechanical parts." },
                { title: "Priority Support", desc: "Skip the queue. Get same-day service visits for breakdowns." },
                { title: "Extended Lifespan", desc: "Routine maintenance adds years to your purifier's life." },
              ].map((b, i) => (
                <motion.div key={b.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={elegantFadeUp} transition={{ delay: i * 0.1 }} className="bg-surface p-8 rounded-2xl border border-primary-100 hover:border-primary-300 transition-elegant">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-6 text-brand-primary border border-primary-100">
                    <Plus className="w-4 h-4" />
                  </div>
                  <h4 className="font-semibold text-brand-primary mb-2">{b.title}</h4>
                  <p className="text-slate text-sm leading-relaxed">{b.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="py-24 lg:py-32 bg-surface border-t border-primary-100">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-brand-primary tracking-tight mb-4">Frequently Asked Questions</h2>
              <p className="text-slate text-base">Everything you need to know about our plans.</p>
            </div>
            
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <motion.div key={faq.q} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={elegantFadeUp} transition={{ delay: i * 0.1 }} className="bg-white rounded-2xl p-8 border border-primary-100 hover:border-primary-300 transition-elegant">
                  <h3 className="font-semibold text-brand-primary text-lg mb-3">{faq.q}</h3>
                  <p className="text-slate leading-relaxed text-sm">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 lg:py-32 bg-brand-primary text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">Need a custom plan for commercial use?</h2>
            <p className="text-lg text-primary-200 mb-10 max-w-2xl mx-auto">We offer specialized AMC plans for offices, schools, and hospitals.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={`tel:${contactNumber}`} className="inline-flex items-center justify-center gap-2 bg-white text-brand-primary font-medium px-8 py-4 rounded-lg hover:bg-surface transition-elegant text-base">
                <Phone className="w-4 h-4" />
                Contact Sales
              </a>
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 border border-primary-700 bg-transparent text-white font-medium px-8 py-4 rounded-lg hover:bg-white/10 transition-elegant text-base">
                View Contact Info <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
