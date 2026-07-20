import { Link } from "wouter";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { AmcService } from "@/services/amc.service";
import { FaqService } from "@/services/content.service";
import { SettingsService } from "@/services/settings.service";
import { Phone, CheckCircle2, X, ArrowRight, ShieldCheck, Sparkles, Plus } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const AMC_STYLES = [
  {
    borderClass: "border-gray-200 hover:border-gray-300",
    headerBg: "bg-white",
    headerText: "text-gray-900",
    btnClass: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50",
    period: "/year",
    isPopular: false,
  },
  {
    borderClass: "border-brand-primary shadow-2xl shadow-primary-900/10 scale-[1.02]",
    headerBg: "bg-brand-primary text-white",
    headerText: "text-white",
    btnClass: "bg-brand-secondary text-brand-primary hover:bg-white border border-transparent hover:border-brand-secondary",
    period: "/year",
    isPopular: true,
  },
  {
    borderClass: "border-gray-200 hover:border-gray-300",
    headerBg: "bg-white",
    headerText: "text-gray-900",
    btnClass: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50",
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
        <title>AMC Plans | Crystal Water - RO Annual Maintenance</title>
        <meta name="description" content="Affordable RO Water Purifier Annual Maintenance Contract (AMC) plans by Crystal Water. Regular servicing, filter changes, and priority support." />
      </Helmet>

      <main className="bg-background min-h-screen">
        {/* HEADER SECTION */}
        <section className="relative pt-32 pb-32 overflow-hidden border-b border-gray-100 bg-white">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[-20%] left-[20%] w-[50%] h-[50%] rounded-full bg-brand-secondary/5 blur-3xl"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-3xl mx-auto">
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 text-brand-secondary font-bold uppercase tracking-widest text-sm mb-6">
                <ShieldCheck className="w-4 h-4" /> Peace of Mind
              </motion.div>
              <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-gray-900">
                Simple, transparent <br className="hidden sm:block" /> <span className="text-gradient">maintenance plans</span>
              </motion.h1>
              <motion.p variants={fadeUp} className="text-lg text-gray-500 leading-relaxed mb-10 max-w-2xl mx-auto">
                Protect your family's health and your purifier's lifespan with our comprehensive Annual Maintenance Contracts. No surprise costs.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* PRICING CARDS */}
        <section className="relative -mt-16 pb-24 z-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              {managedPlans.map((plan, i) => (
                <motion.div
                  key={plan.name}
                  initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} transition={{ delay: i * 0.1 }}
                  className={`bg-white rounded-3xl border ${plan.borderClass} flex flex-col relative transition-all duration-300 ${plan.isPopular ? "md:-mt-8 shadow-2xl z-10" : "shadow-sm hover:shadow-xl"}`}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-4 inset-x-0 flex justify-center z-10">
                      <span className="flex items-center gap-1.5 bg-gradient-to-r from-brand-secondary to-blue-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
                        <Sparkles className="w-3 h-3" /> Most Popular
                      </span>
                    </div>
                  )}

                  <div className={`p-8 rounded-t-3xl ${plan.headerBg}`}>
                    <h3 className={`font-bold text-xl mb-4 ${plan.headerText}`}>{plan.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-4xl font-extrabold tracking-tight ${plan.headerText}`}>{plan.price}</span>
                      <span className={`text-sm font-medium ${plan.isPopular ? "text-primary-200" : "text-gray-500"}`}>{plan.period}</span>
                    </div>
                  </div>

                  <div className="p-8 flex flex-col flex-1 bg-white rounded-b-3xl">
                    <ul className="space-y-4 mb-8 flex-1">
                      {plan.features.map((f) => (
                        <li key={f.text} className={`flex items-start gap-3 text-sm font-medium ${f.included ? "text-gray-700" : "text-gray-400 line-through"}`}>
                          {f.included
                            ? <CheckCircle2 className="w-5 h-5 text-brand-accent shrink-0" />
                            : <X className="w-5 h-5 text-gray-300 shrink-0" />
                          }
                          <span className="pt-0.5">{f.text}</span>
                        </li>
                      ))}
                    </ul>
                    <a
                      href={`tel:${contactNumber}`}
                      className={`w-full flex items-center justify-center gap-2 font-bold py-3.5 rounded-xl transition-all text-sm shadow-sm hover:shadow-md active:scale-[0.98] ${plan.btnClass}`}
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
        <section className="py-24 bg-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-sm font-bold text-brand-secondary tracking-widest uppercase mb-3">Why AMC?</h2>
              <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">Benefits of Annual Maintenance</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Pure Water Guarantee", desc: "Regular filter changes ensure your water stays 100% safe." },
                { title: "Zero Repair Costs", desc: "Premium plans cover all electronic and mechanical parts." },
                { title: "Priority Support", desc: "Skip the queue. Get same-day service visits for breakdowns." },
                { title: "Extended Lifespan", desc: "Routine maintenance adds years to your purifier's life." },
              ].map((b, i) => (
                <motion.div key={b.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }} className="bg-white p-8 rounded-3xl border border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center mb-4 text-brand-primary">
                    <Plus className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">{b.title}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{b.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="py-24 bg-white border-t border-gray-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-500 text-lg">Everything you need to know about our plans.</p>
            </div>
            
            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <motion.div key={faq.q} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }} className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:bg-white hover:border-gray-200 transition-colors">
                  <h3 className="font-bold text-gray-900 text-lg mb-3">{faq.q}</h3>
                  <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-brand-primary text-white relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[-50%] left-[-10%] w-[50%] h-[100%] rounded-full bg-brand-secondary/10 blur-3xl"></div>
          </div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6 tracking-tight">Need a custom plan for commercial use?</h2>
            <p className="text-xl text-primary-200 mb-10">We offer specialized AMC plans for offices, schools, and hospitals.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={`tel:${contactNumber}`} className="inline-flex items-center justify-center gap-2 bg-brand-secondary text-brand-primary font-bold px-8 py-4 rounded-xl hover:bg-white transition-all text-lg shadow-lg shadow-brand-secondary/20">
                <Phone className="w-5 h-5" />
                Contact Sales
              </a>
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 border border-primary-700 bg-primary-800 text-white font-bold px-8 py-4 rounded-xl hover:bg-primary-700 transition-all text-lg">
                View Contact Info <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
