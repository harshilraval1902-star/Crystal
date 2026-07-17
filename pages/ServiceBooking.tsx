import { useState } from "react";
import { Link } from "wouter";
import { Phone, CheckCircle, Loader2, Send } from "lucide-react";

const serviceTypes = [
  "New RO Installation",
  "RO Repair / Not Working",
  "Filter Replacement",
  "Membrane Replacement",
  "Annual Maintenance (AMC)",
  "RO Service / Cleaning",
  "Water TDS Testing",
  "General Checkup",
];

interface FormData {
  name: string;
  phone: string;
  address: string;
  serviceType: string;
  message: string;
}

const initialForm: FormData = {
  name: "",
  phone: "",
  address: "",
  serviceType: "",
  message: "",
};

export default function ServiceBooking() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(form.phone.trim())) newErrors.phone = "Enter a valid 10-digit phone number";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.serviceType) newErrors.serviceType = "Please select a service type";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const phone = "919584024777";
    const text = encodeURIComponent(
      `*New Service Booking - Crystal Natural Water*\n\n` +
      `*Name:* ${form.name}\n` +
      `*Phone:* ${form.phone}\n` +
      `*Address:* ${form.address}\n` +
      `*Service Type:* ${form.serviceType}\n` +
      (form.message ? `*Message:* ${form.message}` : "")
    );
    const waUrl = `https://wa.me/${phone}?text=${text}`;

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      window.open(waUrl, "_blank");
    }, 800);
  };

  return (
    <>
      <title>Book RO Service | Crystal Natural Water</title>
      <meta name="description" content="Book a RO Water Purifier service with Crystal Natural Water. Installation, repair, filter replacement, AMC and more. Quick response guaranteed." />

      <main>
        <section className="bg-gradient-to-r from-blue-700 to-cyan-600 text-white py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-blue-200 text-sm mb-3">
              <Link href="/" className="hover:text-white">Home</Link>
              <span>/</span>
              <span className="text-white">Book Service</span>
            </div>
            <h1 className="text-4xl font-extrabold mb-3">Book a Service</h1>
            <p className="text-blue-100 text-lg max-w-xl">
              Fill in the form below and our technician will contact you within a few hours to confirm your appointment.
            </p>
          </div>
        </section>

        <section className="py-16 bg-blue-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {submitted ? (
                  <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-10 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="bg-green-100 p-4 rounded-full">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Sent!</h2>
                    <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                      Your service request has been sent via WhatsApp. Our team will call you shortly to confirm your appointment.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={() => { setSubmitted(false); setForm(initialForm); }}
                        className="bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-colors"
                      >
                        Book Another Service
                      </button>
                      <a
                        href="tel:9584024777"
                        className="border border-blue-200 text-blue-700 font-semibold px-6 py-2.5 rounded-xl hover:bg-blue-50 transition-colors flex items-center gap-2 justify-center"
                      >
                        <Phone className="w-4 h-4" />
                        Call Us Directly
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6 md:p-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Service Booking Form</h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="name">
                            Full Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Enter your full name"
                            value={form.name}
                            onChange={handleChange}
                            className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.name ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"}`}
                          />
                          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="phone">
                            Phone Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="10-digit mobile number"
                            value={form.phone}
                            onChange={handleChange}
                            maxLength={10}
                            className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.phone ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"}`}
                          />
                          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="address">
                          Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="address"
                          name="address"
                          type="text"
                          placeholder="Your full address for service visit"
                          value={form.address}
                          onChange={handleChange}
                          className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.address ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"}`}
                        />
                        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="serviceType">
                          Service Type <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="serviceType"
                          name="serviceType"
                          value={form.serviceType}
                          onChange={handleChange}
                          className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.serviceType ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"}`}
                        >
                          <option value="">-- Select Service Type --</option>
                          {serviceTypes.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        {errors.serviceType && <p className="text-red-500 text-xs mt-1">{errors.serviceType}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="message">
                          Additional Details <span className="text-gray-400 font-normal">(Optional)</span>
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={3}
                          placeholder="Describe the issue or any special requirements..."
                          value={form.message}
                          onChange={handleChange}
                          className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                        ) : (
                          <><Send className="w-4 h-4" /> Submit Booking via WhatsApp</>
                        )}
                      </button>
                      <p className="text-xs text-gray-400 text-center">
                        By submitting, you'll be redirected to WhatsApp to confirm your booking.
                      </p>
                    </form>
                  </div>
                )}
              </div>

              <div className="space-y-5">
                <div className="bg-white rounded-2xl border border-blue-100 p-5 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4">Call Us Directly</h3>
                  <a
                    href="tel:9584024777"
                    className="flex items-center gap-3 bg-blue-600 text-white font-semibold px-4 py-3 rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    <div>
                      <div className="text-sm">Mobile / WhatsApp</div>
                      <div className="font-bold">9584024777</div>
                    </div>
                  </a>
                </div>

                <div className="bg-white rounded-2xl border border-blue-100 p-5 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-3">Services We Offer</h3>
                  <ul className="space-y-2">
                    {serviceTypes.map((s) => (
                      <li key={s} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-blue-500 shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-blue-600 rounded-2xl p-5 text-white">
                  <h3 className="font-bold mb-2">Working Hours</h3>
                  <div className="space-y-1 text-sm text-blue-100">
                    <div className="flex justify-between">
                      <span>Mon – Sat</span>
                      <span className="text-white font-semibold">9:00 AM – 7:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span className="text-white font-semibold">10:00 AM – 4:00 PM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
