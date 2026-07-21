import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { CheckCircle2, Award, Users, Target } from "lucide-react";

const elegantFadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const timeline = [
  { year: "2019", event: "Founded Crystal Natural Water" },
  { year: "2020", event: "Expanded service coverage across region" },
  { year: "2021", event: "Introduced comprehensive AMC plans" },
  { year: "2024", event: "Over 500+ happy households served" },
];

export default function About() {
  return (
    <>
      <Helmet>
        <title>About Us | Crystal Natural Water</title>
        <meta name="description" content="Crystal Natural Water is a trusted RO water purifier sales and service company established in 2019. Learn about our mission, values, and commitment to pure water." />
      </Helmet>

      <main className="bg-background min-h-screen">
        {/* HERO */}
        <section className="relative pt-40 pb-24 bg-surface text-brand-primary overflow-hidden border-b border-primary-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-3xl mx-auto">
              <motion.div variants={elegantFadeUp} className="inline-flex items-center gap-2 text-primary-500 font-semibold uppercase tracking-widest text-xs mb-6">
                <Award className="w-4 h-4" /> Trusted Since 2019
              </motion.div>
              <motion.h1 variants={elegantFadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
                Building trust through pure water.
              </motion.h1>
              <motion.p variants={elegantFadeUp} className="text-lg text-slate leading-relaxed max-w-2xl mx-auto mb-10 font-medium">
                Since 2019, Crystal Natural Water has delivered RO purification solutions with a focus on reliability, transparency, and customer care. We help families and businesses choose the right systems and keep them running flawlessly.
              </motion.p>
              <motion.div variants={elegantFadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/service-booking" className="inline-flex items-center justify-center bg-brand-primary text-white font-medium px-8 py-4 rounded-lg hover:bg-primary-900 transition-elegant text-base">
                  Book a Service
                </Link>
                <Link href="/ro-sales" className="inline-flex items-center justify-center border border-primary-200 bg-white text-brand-primary font-medium px-8 py-4 rounded-lg hover:bg-surface transition-elegant text-base">
                  View Products
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* MISSION & VALUES */}
        <section className="py-24 lg:py-32 bg-background relative">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="space-y-8">
                <motion.h2 variants={elegantFadeUp} className="text-3xl sm:text-4xl font-bold text-brand-primary tracking-tight">
                  A local RO partner for families and offices.
                </motion.h2>
                <motion.p variants={elegantFadeUp} className="text-lg text-slate leading-relaxed">
                  We provide complete RO solutions from purifier selection to installation, scheduled maintenance, and emergency service. Our trained technicians use genuine parts and follow strict quality checks on every visit.
                </motion.p>
                <motion.ul variants={elegantFadeUp} className="space-y-4">
                  {[
                    "Trusted service in Indore, Bhopal, Ujjain, and Dewas",
                    "Certified technicians and genuine RO parts",
                    "Convenient WhatsApp service booking",
                    "Simple AMC plans with clear pricing",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-4 text-brand-primary font-medium">
                      <div className="w-6 h-6 rounded-full bg-surface text-primary-500 border border-primary-100 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </motion.ul>
              </motion.div>

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={elegantFadeUp} className="bg-brand-primary rounded-2xl p-10 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3 relative z-10">
                  <Target className="w-6 h-6 text-primary-300" /> Our Mission
                </h3>
                <p className="text-primary-200 leading-relaxed mb-10 text-lg relative z-10">
                  To make safe drinking water accessible by delivering thoughtfully selected RO systems, expert service, and honest guidance for every customer.
                </p>
                <div className="space-y-4 relative z-10">
                  <div className="bg-primary-900 rounded-xl p-6 border border-primary-700">
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary-300 mb-2 flex items-center gap-2">
                      <Users className="w-4 h-4" /> Customer Care
                    </p>
                    <p className="text-white">Responsive support and same-day technician visits when needed.</p>
                  </div>
                  <div className="bg-primary-900 rounded-xl p-6 border border-primary-700">
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary-300 mb-2 flex items-center gap-2">
                      <Award className="w-4 h-4" /> Quality Commitment
                    </p>
                    <p className="text-white">Only genuine, branded RO components for durable performance.</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* MILESTONES */}
        <section className="py-24 lg:py-32 bg-surface border-t border-primary-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={elegantFadeUp} className="text-center mb-16">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate mb-3">Milestones</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-brand-primary tracking-tight">Our journey so far</h2>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {timeline.map((item, i) => (
                <motion.div key={item.year} variants={elegantFadeUp} transition={{ delay: i * 0.1 }} className="bg-white rounded-2xl border border-primary-100 p-8 hover:border-primary-300 transition-elegant">
                  <div className="text-3xl font-bold text-primary-300 mb-4">{item.year}</div>
                  <p className="text-base font-semibold text-brand-primary leading-tight">{item.event}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
