import { Link } from "wouter";
import { Phone, CheckCircle, ArrowRight, ShieldCheck, Truck, Headphones } from "lucide-react";

import aquaMoorBlack from "@/assets/Aqua_Moor_(2)_1775412426683.jpg";
import aqua2090Blue from "@/assets/Aqua2090_(2)_1775412426685.jpg";
import aquaZuric from "@/assets/Aqua-Zuric-Water-Purifier._1775412426686.jpg";
import olixBlack from "@/assets/IMG_20250520_190437_1775412426686.jpg";
import aquaMoorWhite from "@/assets/Aqua_Moor_(3)_1775412426684.jpg";
import aqua2090Teal from "@/assets/Aqua2090_(3)_1775412426685.jpg";
import olixBrown from "@/assets/IMG_20250520_190513_1775412426687.jpg";
import aqua2090Black from "@/assets/Aqua2090_(5)_1775412426686.jpg";

const products = [
  {
    id: 1,
    name: "Aqua Moor Copper Alkaline",
    subtitle: "Premium Black Edition",
    price: "₹9,499",
    originalPrice: "₹12,000",
    tag: "Best Seller",
    tagColor: "bg-amber-100 text-amber-700 border border-amber-200",
    desc: "Advanced Zinc + Copper + Alkaline RO with digital display. 8-stage purification ideal for hard water.",
    features: ["Zinc + Copper + Alkaline", "Digital Display", "8-Stage RO+UV", "2 Year Warranty"],
    image: aquaMoorBlack,
    variants: [aquaMoorBlack, aquaMoorWhite],
    activeVariant: 0,
  },
  {
    id: 2,
    name: "Aqua 2090 Next",
    subtitle: "Classic White/Blue",
    price: "₹7,499",
    originalPrice: "₹9,500",
    tag: "Popular",
    tagColor: "bg-blue-100 text-blue-700 border border-blue-200",
    desc: "Reliable everyday purifier with high-flow output. Smart purification for families of 4-6 members.",
    features: ["6-Stage RO+UV+UF", "15L Storage Tank", "Smart Filter Alert", "1 Year Warranty"],
    image: aqua2090Blue,
    variants: [aqua2090Blue, aqua2090Teal, aqua2090Black],
    activeVariant: 0,
  },
  {
    id: 3,
    name: "Aqua Zuric",
    subtitle: "Zinc + Copper Alkaline",
    price: "₹11,999",
    originalPrice: "₹15,000",
    tag: "Premium",
    tagColor: "bg-purple-100 text-purple-700 border border-purple-200",
    desc: "Dual-view model with Zinc + Copper Alkaline RO technology. LED indicators and copper tap design.",
    features: ["Zinc + Copper Alkaline", "LED Indicators", "Copper Tap Nozzle", "3 Year Warranty"],
    image: aquaZuric,
    variants: [aquaZuric],
    activeVariant: 0,
  },
  {
    id: 4,
    name: "OLiX LED Purifier",
    subtitle: "Smart LED Edition",
    price: "₹8,299",
    originalPrice: "₹10,500",
    tag: "New Arrival",
    tagColor: "bg-green-100 text-green-700 border border-green-200",
    desc: "Sleek design with LED status panel showing purification, power, and tank full indicators in real-time.",
    features: ["LED Status Panel", "7-Stage Purification", "14L SS Tank", "2 Year Warranty"],
    image: olixBlack,
    variants: [olixBlack, olixBrown],
    activeVariant: 0,
  },
];

export default function ROSales() {
  return (
    <>
      <title>RO Purifier Products | Crystal Natural Water</title>
      <meta name="description" content="Buy RO Water Purifiers from Crystal Natural Water. Best prices on Aqua Moor, Aqua 2090, Zuric, OLiX and more with installation and warranty." />

      <main>
        <section className="bg-gradient-to-r from-blue-700 to-cyan-600 text-white py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-blue-200 text-sm mb-3">
              <Link href="/" className="hover:text-white">Home</Link>
              <span>/</span>
              <span className="text-white">RO Sales</span>
            </div>
            <h1 className="text-4xl font-extrabold mb-3">RO Water Purifiers</h1>
            <p className="text-blue-100 text-lg max-w-xl">
              Choose from our certified range of RO purifiers — trusted brands, competitive prices, free installation.
            </p>
          </div>
        </section>

        <section className="py-4 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-6 justify-center py-2">
              {[
                { icon: <Truck className="w-5 h-5 text-blue-600" />, text: "Free Installation" },
                { icon: <ShieldCheck className="w-5 h-5 text-green-600" />, text: "Genuine Parts" },
                { icon: <Headphones className="w-5 h-5 text-blue-600" />, text: "After-Sales Support" },
                { icon: <CheckCircle className="w-5 h-5 text-blue-600" />, text: "All Brands Serviced" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                  {item.icon}
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden group"
                >
                  <div className="relative bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden" style={{ height: "220px" }}>
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${p.tagColor}`}>
                      {p.tag}
                    </span>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <div className="mb-1">
                      <h2 className="font-bold text-gray-900 text-base leading-tight">{p.name}</h2>
                      <p className="text-xs text-gray-400 mt-0.5">{p.subtitle}</p>
                    </div>

                    <p className="text-gray-500 text-sm leading-relaxed mb-3 mt-1">{p.desc}</p>

                    <ul className="space-y-1.5 mb-4 flex-1">
                      {p.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-xs text-gray-700">
                          <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-2xl font-extrabold text-blue-700">{p.price}</span>
                      <span className="text-sm text-gray-400 line-through">{p.originalPrice}</span>
                    </div>

                    <a
                      href="tel:9584024777"
                      className="flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-2.5 rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors text-sm"
                    >
                      <Phone className="w-4 h-4" />
                      Call to Order
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">More Models Available</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { img: aquaMoorWhite, name: "Aqua Moor White" },
                { img: aqua2090Teal, name: "Aqua 2090 Teal" },
                { img: aqua2090Black, name: "Aqua 2090 Black" },
                { img: olixBrown, name: "OLiX LED Brown" },
              ].map((item) => (
                <div key={item.name} className="bg-gray-50 rounded-2xl border border-gray-200 p-4 text-center hover:shadow-md transition-shadow group">
                  <div className="h-36 flex items-center justify-center mb-3">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <p className="text-sm font-semibold text-gray-700">{item.name}</p>
                  <a href="tel:9584024777" className="text-xs text-blue-600 hover:underline mt-1 inline-block">
                    Call for Price
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 bg-gradient-to-r from-blue-700 to-cyan-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">Need help choosing the right RO?</h2>
              <p className="text-blue-100">Talk to our experts — we'll recommend the best fit for your water quality and budget.</p>
            </div>
            <div className="flex gap-3 shrink-0">
              <a href="tel:9584024777" className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors">
                <Phone className="w-4 h-4" />
                Call Now
              </a>
              <Link href="/service-booking" className="inline-flex items-center gap-2 border-2 border-white text-white font-bold px-6 py-3 rounded-xl hover:bg-white/10 transition-colors">
                Book Demo <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
