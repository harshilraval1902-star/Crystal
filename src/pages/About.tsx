import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { CheckCircle2, Award, Users, Target } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const timeline = [
  { year: "2019", event: "Founded Crystal Water Solutions" },
  { year: "2020", event: "Expanded service coverage across region" },
  { year: "2021", event: "Introduced comprehensive AMC plans" },
  { year: "2024", event: "Over 500+ happy households served" },
];

export default function About() {
  return (
    <>
      <Helmet>
        <title>About Us | Crystal Water Solutions</title>
        <meta name="description" content="Crystal Water is a trusted RO water purifier sales and service company established in 2019. Learn about our mission, values, and commitment to pure water." />
      </Helmet>

      <main className="bg-background min-h-screen">
        {/* HERO */}
        <section className="relative pt-32 pb-24 bg-brand-primary text-white overflow-hidden border-b border-primary-800">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-brand-secondary/10 rounded-full blur-3xl" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-3xl mx-auto">
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 text-brand-secondary font-bold uppercase tracking-widest text-sm mb-6">
                <Award className="w-4 h-4" /> Trusted Since 2019
              </motion.div>
              <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
                Building trust through <span className="text-gradient">pure water.</span>
              </motion.h1>
              <motion.p variants={fadeUp} className="text-lg text-primary-200 leading-relaxed max-w-2xl mx-auto mb-10">
                Since 2019, Crystal Water has delivered RO purification solutions with a focus on reliability, transparency, and customer care. We help families and businesses choose the right systems and keep them running flawlessly.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/service-booking" className="inline-flex items-center justify-center bg-brand-secondary text-brand-primary font-bold px-8 py-4 rounded-xl hover:bg-white transition-all shadow-lg hover:-translate-y-0.5 text-base">
                  Book a Service
                </Link>
                <Link href="/ro-sales" className="inline-flex items-center justify-center border border-white/20 bg-white/10 text-white font-bold px-8 py-4 rounded-xl hover:bg-white/20 transition-all text-base hover:-translate-y-0.5">
                  View Products
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* MISSION & VALUES */}
        <section className="py-24 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="space-y-8">
                <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                  A local RO partner for families and offices.
                </motion.h2>
                <motion.p variants={fadeUp} className="text-lg text-gray-500 leading-relaxed">
                  We provide complete RO solutions from purifier selection to installation, scheduled maintenance, and emergency service. Our trained technicians use genuine parts and follow strict quality checks on every visit.
                </motion.p>
                <motion.ul variants={fadeUp} className="space-y-4">
                  {[
                    "Trusted service in Indore, Bhopal, Ujjain, and Dewas",
                    "Certified technicians and genuine RO parts",
                    "Convenient WhatsApp service booking",
                    "Simple AMC plans with clear pricing",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-4 text-gray-700 font-medium">
                      <div className="w-6 h-6 rounded-full bg-brand-accent/20 text-brand-accent flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </motion.ul>
              </motion.div>

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-brand-primary rounded-[2rem] p-10 text-white relative overflow-hidden shadow-xl shadow-primary-900/10">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-secondary/20 rounded-full blur-3xl"></div>
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <Target className="w-6 h-6 text-brand-secondary" /> Our Mission
                </h3>
                <p className="text-primary-200 leading-relaxed mb-10 text-lg">
                  To make safe drinking water accessible by delivering thoughtfully selected RO systems, expert service, and honest guidance for every customer.
                </p>
                <div className="space-y-4">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                    <p className="text-xs font-bold uppercase tracking-widest text-brand-secondary mb-2 flex items-center gap-2">
                      <Users className="w-4 h-4" /> Customer Care
                    </p>
                    <p className="text-primary-50">Responsive support and same-day technician visits when needed.</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                    <p className="text-xs font-bold uppercase tracking-widest text-brand-secondary mb-2 flex items-center gap-2">
                      <Award className="w-4 h-4" /> Quality Commitment
                    </p>
                    <p className="text-primary-50">Only genuine, branded RO components for durable performance.</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* MILESTONES */}
        <section className="py-24 bg-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
              <p className="text-sm font-bold uppercase tracking-widest text-brand-secondary mb-3">Milestones</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">Our journey so far</h2>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {timeline.map((item, i) => (
                <motion.div key={item.year} variants={fadeUp} transition={{ delay: i * 0.1 }} className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-300">
                  <div className="text-3xl font-extrabold text-brand-primary mb-4 opacity-50">{item.year}</div>
                  <p className="text-lg font-bold text-gray-900 leading-tight">{item.event}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
