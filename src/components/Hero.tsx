import { motion } from "framer-motion";
import { Link } from "wouter";
import { CheckCircle, Droplets, ShieldCheck } from "lucide-react";

const features = [
  "Free installation with every purifier",
  "Certified service technicians",
  "Same-day RO repair and AMC support",
  "Transparent pricing, no hidden fees",
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-100">
      <div className="absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top_right,_rgba(67,56,202,0.22),_transparent_45%)]" />
      <div className="absolute inset-x-0 bottom-0 h-72 bg-[radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.18),_transparent_50%)]" />
      <div className="relative max-w-7xl mx-auto px-6 py-24 sm:px-8 lg:px-12">
        <div className="grid gap-16 lg:grid-cols-[1.2fr_0.8fr] items-center">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm ring-1 ring-emerald-100">
              <Droplets className="h-4 w-4" /> Trusted RO solutions since 2019
            </span>
            <div className="space-y-6">
              <h1 className="text-5xl font-black tracking-tight text-slate-950 sm:text-6xl">
                Pure RO water for every home and business.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                Crystal Natural Water delivers certified RO purifier sales, fast installation, and dependable service across Indore, Bhopal, Ujjain, and Dewas.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/service-booking"
                className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-slate-950/10 transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Book a Service
              </Link>
              <Link
                href="/ro-sales"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100"
              >
                View Purifiers
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {features.map((feature) => (
                <div key={feature} className="flex items-start gap-3 rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                  <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <p className="text-sm text-slate-700">{feature}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-indigo-900 to-teal-600 p-8 text-white shadow-2xl shadow-slate-900/20"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.12),_transparent_25%)]" />
            <div className="relative flex h-full flex-col justify-between gap-8">
              <div className="space-y-4">
                <div className="inline-flex rounded-full bg-white/10 px-4 py-1.5 text-xs uppercase tracking-[0.24em] text-white/70">
                  Featured service
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-teal-200">RO Purifier Sales</p>
                  <h2 className="mt-3 text-4xl font-black tracking-tight">Fast installation and guaranteed performance.</h2>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-200">Availability</p>
                  <p className="mt-3 text-3xl font-semibold">Same Day</p>
                </div>
                <div className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-200">Support</p>
                  <p className="mt-3 text-3xl font-semibold">Priority</p>
                </div>
              </div>
              <div className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-200">Working area</p>
                <p className="mt-2 text-2xl font-semibold">Indore · Bhopal · Ujjain · Dewas</p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-100">
                  <ShieldCheck className="h-4 w-4 text-teal-200" /> Genuine repair & AMC
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
