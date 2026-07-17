import { Link } from "wouter";
import { Phone, CheckCircle, X, ArrowRight, Star } from "lucide-react";

const plans = [
  {
    name: "Basic AMC",
    price: "₹999",
    period: "/year",
    color: "border-gray-200",
    headerBg: "bg-gray-50",
    btnClass: "bg-gray-700 hover:bg-gray-800 text-white",
    badge: null,
    features: [
      { text: "1 Free Service Visit", included: true },
      { text: "Filter Inspection", included: true },
      { text: "Basic Cleaning", included: true },
      { text: "Membrane Replacement (Extra)", included: false },
      { text: "Priority Support", included: false },
      { text: "Free Spare Parts", included: false },
      { text: "Emergency Visits", included: false },
    ],
  },
  {
    name: "Standard AMC",
    price: "₹1,799",
    period: "/year",
    color: "border-blue-500",
    headerBg: "bg-blue-600",
    headerText: "text-white",
    btnClass: "bg-blue-600 hover:bg-blue-700 text-white",
    badge: "Most Popular",
    features: [
      { text: "2 Free Service Visits", included: true },
      { text: "Filter Inspection & Cleaning", included: true },
      { text: "Basic Cleaning", included: true },
      { text: "Free Membrane Replacement", included: true },
      { text: "Priority Support", included: true },
      { text: "Free Spare Parts (Selected)", included: false },
      { text: "Emergency Visits", included: false },
    ],
  },
  {
    name: "Premium AMC",
    price: "₹2,999",
    period: "/year",
    color: "border-cyan-500",
    headerBg: "bg-gradient-to-r from-blue-700 to-cyan-600",
    headerText: "text-white",
    btnClass: "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white",
    badge: "Best Value",
    features: [
      { text: "4 Free Service Visits", included: true },
      { text: "Filter Inspection & Deep Cleaning", included: true },
      { text: "Premium Cleaning Service", included: true },
      { text: "Free Membrane Replacement", included: true },
      { text: "24/7 Priority Support", included: true },
      { text: "All Spare Parts Covered", included: true },
      { text: "Emergency Same-Day Visit", included: true },
    ],
  },
];

const faqs = [
  { q: "What is an AMC plan?", a: "An Annual Maintenance Contract (AMC) is a yearly service agreement that covers regular servicing, filter changes, and repairs for your RO purifier, saving you from unexpected maintenance costs." },
  { q: "When does the AMC start?", a: "The AMC starts from the date of enrollment. You'll receive a service confirmation via call or WhatsApp." },
  { q: "Are spare parts included?", a: "Basic AMC does not include spare parts. Standard includes membrane replacement. Premium covers all parts and components." },
  { q: "How do I book a service under AMC?", a: "Simply call us at 9584024777 or use our Service Booking form. We'll schedule a visit at your convenience." },
];

export default function AMCPlans() {
  return (
    <>
      <title>AMC Plans | Crystal Natural Water - RO Annual Maintenance</title>
      <meta name="description" content="Affordable RO Water Purifier Annual Maintenance Contract (AMC) plans by Crystal Natural Water. Regular servicing, filter changes, and priority support." />

      <main>
        <section className="bg-gradient-to-r from-blue-700 to-cyan-600 text-white py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-blue-200 text-sm mb-3">
              <Link href="/" className="hover:text-white">Home</Link>
              <span>/</span>
              <span className="text-white">AMC Plans</span>
            </div>
            <h1 className="text-4xl font-extrabold mb-3">Annual Maintenance Plans</h1>
            <p className="text-blue-100 text-lg max-w-xl">
              Keep your RO purifier in top condition with our affordable AMC plans. No surprise costs — just pure water all year.
            </p>
          </div>
        </section>

        <section className="py-16 bg-blue-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Choose Your AMC Plan</h2>
              <p className="text-gray-500 text-lg">Transparent pricing. No hidden charges. Cancel anytime.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`bg-white rounded-2xl border-2 ${plan.color} shadow-sm overflow-hidden flex flex-col relative`}
                >
                  {plan.badge && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className="flex items-center gap-1 bg-amber-400 text-amber-900 text-xs font-bold px-2 py-0.5 rounded-full">
                        <Star className="w-3 h-3" />
                        {plan.badge}
                      </span>
                    </div>
                  )}
                  <div className={`${plan.headerBg} p-6`}>
                    <h3 className={`font-bold text-xl mb-1 ${plan.headerText || "text-gray-900"}`}>{plan.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-4xl font-extrabold ${plan.headerText || "text-gray-900"}`}>{plan.price}</span>
                      <span className={`text-sm ${plan.headerText ? "text-white/70" : "text-gray-500"}`}>{plan.period}</span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <ul className="space-y-3 mb-6 flex-1">
                      {plan.features.map((f) => (
                        <li key={f.text} className={`flex items-center gap-2 text-sm ${f.included ? "text-gray-700" : "text-gray-400"}`}>
                          {f.included
                            ? <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                            : <X className="w-4 h-4 text-gray-300 shrink-0" />
                          }
                          {f.text}
                        </li>
                      ))}
                    </ul>
                    <a
                      href="tel:9584024777"
                      className={`flex items-center justify-center gap-2 font-semibold py-3 rounded-xl transition-colors text-sm ${plan.btnClass}`}
                    >
                      <Phone className="w-4 h-4" />
                      Subscribe Now
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h2>
              <p className="text-gray-500">Everything you need to know about our AMC plans</p>
            </div>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.q} className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 bg-gradient-to-r from-blue-700 to-cyan-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">Not sure which plan is right?</h2>
              <p className="text-blue-100">Our team will help you pick the best plan based on your RO model and usage.</p>
            </div>
            <div className="flex gap-3 shrink-0">
              <a href="tel:9584024777" className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors">
                <Phone className="w-4 h-4" />
                Call Now
              </a>
              <Link href="/service-booking" className="inline-flex items-center gap-2 border-2 border-white text-white font-bold px-6 py-3 rounded-xl hover:bg-white/10 transition-colors">
                Book Service <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
