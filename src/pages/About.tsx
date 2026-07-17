import { Link } from "wouter";

const timeline = [
  { year: "2019", event: "Founded Crystal Natural Water" },
  { year: "2020", event: "Expanded service coverage across MP" },
  { year: "2021", event: "Introduced AMC plans" },
  { year: "2024", event: "500+ happy households served" },
];

export default function About() {
  return (
    <>
      <title>About Us | Crystal Natural Water — Trusted Since 2019</title>
      <meta name="description" content="Crystal Natural Water is a trusted RO water purifier sales and service company established in 2019. Learn about our mission, values, and commitment to pure water." />

      <main className="bg-slate-50 text-slate-900">
        <section className="bg-slate-950 text-white py-24">
          <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="max-w-3xl">
              <p className="text-sm uppercase tracking-[0.24em] text-teal-300">About Us</p>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight">Building trust through pure water and honest service.</h1>
              <p className="mt-6 text-lg leading-8 text-slate-300">Since 2019, Crystal Natural Water has delivered RO purification solutions with a focus on reliability, transparency, and customer care. We help families and businesses choose the right systems and keep them running flawlessly.</p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link href="/service-booking" className="inline-flex items-center justify-center rounded-2xl bg-teal-500 px-6 py-3 text-sm font-semibold text-white hover:bg-teal-400 transition">
                  Book a Service
                </Link>
                <Link href="/ro-sales" className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 transition">
                  View Products
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="grid gap-16 lg:grid-cols-2 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-950">A local RO partner for families and offices.</h2>
                <p className="mt-6 text-slate-600 leading-8">We provide complete RO solutions from purifier selection to installation, scheduled maintenance, and emergency service. Our trained technicians use genuine parts and follow strict quality checks on every visit.</p>
                <ul className="mt-10 space-y-4">
                  {[
                    "Trusted service in Indore, Bhopal, Ujjain, and Dewas",
                    "Certified technicians and genuine RO parts",
                    "Convenient WhatsApp service booking",
                    "Simple AMC plans with clear pricing",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-slate-600">
                      <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-indigo-900 to-teal-600 p-10 text-white shadow-2xl shadow-slate-950/30">
                <h3 className="text-2xl font-bold">Our mission</h3>
                <p className="mt-4 leading-8 text-slate-200">To make safe drinking water accessible by delivering thoughtfully selected RO systems, expert service, and honest guidance for every customer.</p>
                <div className="mt-8 space-y-4 text-slate-100">
                  <div className="rounded-3xl bg-white/10 p-5">
                    <p className="text-sm uppercase tracking-[0.24em] text-teal-200">Customer care</p>
                    <p className="mt-2 text-base">Responsive support and same-day technician visits when needed.</p>
                  </div>
                  <div className="rounded-3xl bg-white/10 p-5">
                    <p className="text-sm uppercase tracking-[0.24em] text-teal-200">Quality commitment</p>
                    <p className="mt-2 text-base">Only genuine, branded RO components for durable performance.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-24">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-center mb-12">
              <p className="text-sm uppercase tracking-[0.24em] text-indigo-600">Milestones</p>
              <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950">Our journey so far</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {timeline.map((item) => (
                <div key={item.year} className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 text-slate-900 shadow-sm">
                  <div className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">{item.year}</div>
                  <p className="mt-4 text-lg font-semibold">{item.event}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
