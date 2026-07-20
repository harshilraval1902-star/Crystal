import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, CheckCircle2, Loader2, Send, Wrench, Shield, Clock } from "lucide-react";
import { BookingService } from "@/services/booking.service";
import { SettingsService } from "@/services/settings.service";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

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
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    SettingsService.getAll().then(setSettings);
  }, []);

  const contactNumber = settings.contactNumber ?? "9584024777";
  const whatsappNumber = settings.whatsappNumber ?? "919584024777";
  const workingHoursMon = settings.workingHoursMon ?? "9:00 AM – 7:00 PM";
  const workingHoursSun = settings.workingHoursSun ?? "10:00 AM – 4:00 PM";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      await BookingService.create({
        customerName: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        serviceType: form.serviceType,
        message: form.message.trim() || undefined,
        status: "new",
      });
    } catch {
      // Continue to WhatsApp even if local save fails
    }

    const text = encodeURIComponent(
      `*New Service Booking - Crystal Water*\n\n` +
      `*Name:* ${form.name}\n` +
      `*Phone:* ${form.phone}\n` +
      `*Address:* ${form.address}\n` +
      `*Service Type:* ${form.serviceType}\n` +
      (form.message ? `*Message:* ${form.message}` : ""),
    );
    const waUrl = `https://wa.me/${whatsappNumber}?text=${text}`;

    setLoading(false);
    setSubmitted(true);
    window.open(waUrl, "_blank");
  };

  return (
    <>
      <Helmet>
        <title>Book RO Service | Crystal Water Solutions</title>
        <meta name="description" content="Book a RO Water Purifier service with Crystal Water. Installation, repair, filter replacement, AMC and more. Quick response guaranteed." />
      </Helmet>

      <main className="bg-background min-h-screen">
        {/* HEADER */}
        <section className="pt-32 pb-16 bg-white border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial="hidden" animate="visible" variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}>
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/5 text-brand-primary font-bold text-xs uppercase tracking-widest mb-6">
                <Wrench className="w-3.5 h-3.5" /> Fast & Reliable
              </motion.div>
              <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
                Book a Service Request
              </motion.h1>
              <motion.p variants={fadeUp} className="text-lg text-gray-500 max-w-2xl mx-auto">
                Schedule a visit with our expert technicians. Most service requests are attended to within the same day.
              </motion.p>
            </motion.div>
          </div>
        </section>

        <section className="py-16 relative">
          <div className="absolute top-0 inset-x-0 h-64 bg-white border-b border-gray-100"></div>
          
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              
              {/* FORM SECTION */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="lg:col-span-7 xl:col-span-8">
                <div className="bg-white rounded-3xl shadow-xl shadow-primary-900/5 border border-gray-100 p-8 sm:p-10">
                  <AnimatePresence mode="wait">
                    {submitted ? (
                      <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center py-10">
                        <div className="w-20 h-20 bg-brand-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                          <CheckCircle2 className="w-10 h-10 text-brand-accent" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">Booking Sent!</h2>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto text-lg">
                          Your service request was routed to WhatsApp. Our team will contact you shortly to confirm timing.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <button
                            onClick={() => { setSubmitted(false); setForm(initialForm); }}
                            className="bg-gray-900 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-gray-800 transition-colors shadow-md"
                          >
                            Book Another
                          </button>
                          <a
                            href={`tel:${contactNumber}`}
                            className="bg-white border border-gray-200 text-gray-900 font-bold px-8 py-3.5 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                          >
                            <Phone className="w-4 h-4 text-brand-secondary" />
                            Call Direct
                          </a>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSubmit} className="space-y-6">
                        <div className="border-b border-gray-100 pb-6 mb-6">
                          <h2 className="text-xl font-bold text-gray-900">Your Details</h2>
                          <p className="text-sm text-gray-500">Provide your contact info for the service visit.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="name">Full Name <span className="text-red-500">*</span></label>
                            <input
                              id="name" name="name" type="text" placeholder="John Doe"
                              value={form.name} onChange={handleChange}
                              className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all ${errors.name ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-brand-primary focus:bg-white"}`}
                            />
                            {errors.name && <p className="text-red-500 text-xs font-medium mt-1.5">{errors.name}</p>}
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="phone">Phone Number <span className="text-red-500">*</span></label>
                            <input
                              id="phone" name="phone" type="tel" placeholder="10-digit number"
                              value={form.phone} onChange={handleChange} maxLength={10}
                              className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all ${errors.phone ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-brand-primary focus:bg-white"}`}
                            />
                            {errors.phone && <p className="text-red-500 text-xs font-medium mt-1.5">{errors.phone}</p>}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="address">Service Address <span className="text-red-500">*</span></label>
                          <input
                            id="address" name="address" type="text" placeholder="Full address with landmark"
                            value={form.address} onChange={handleChange}
                            className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all ${errors.address ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-brand-primary focus:bg-white"}`}
                          />
                          {errors.address && <p className="text-red-500 text-xs font-medium mt-1.5">{errors.address}</p>}
                        </div>

                        <div className="border-t border-gray-100 pt-6 mt-6">
                          <h2 className="text-xl font-bold text-gray-900 mb-1">Service Details</h2>
                          <p className="text-sm text-gray-500 mb-6">What do you need help with?</p>
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="serviceType">Service Type <span className="text-red-500">*</span></label>
                          <div className="relative">
                            <select
                              id="serviceType" name="serviceType"
                              value={form.serviceType} onChange={handleChange}
                              className={`appearance-none w-full bg-gray-50 border rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all ${errors.serviceType ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-brand-primary focus:bg-white"}`}
                            >
                              <option value="" disabled>-- Select Service Required --</option>
                              {serviceTypes.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                          </div>
                          {errors.serviceType && <p className="text-red-500 text-xs font-medium mt-1.5">{errors.serviceType}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="message">Problem Description <span className="text-gray-400 font-normal">(Optional)</span></label>
                          <textarea
                            id="message" name="message" rows={3} placeholder="Any specific details about the issue..."
                            value={form.message} onChange={handleChange}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:bg-white transition-all resize-none"
                          />
                        </div>

                        <div className="pt-4">
                          <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-4 rounded-xl hover:bg-primary-800 transition-all shadow-lg shadow-brand-primary/20 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
                          >
                            {loading ? (
                              <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                            ) : (
                              <><Send className="w-5 h-5" /> Submit Request via WhatsApp</>
                            )}
                          </button>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* SIDEBAR */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="lg:col-span-5 xl:col-span-4 space-y-6">
                
                {/* Contact Card */}
                <div className="bg-brand-primary rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-primary-900/10">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
                  <h3 className="font-bold text-xl mb-2 relative z-10">Need immediate help?</h3>
                  <p className="text-primary-200 text-sm mb-6 relative z-10">Call us directly for urgent repairs or queries.</p>
                  <a
                    href={`tel:${contactNumber}`}
                    className="flex items-center gap-4 bg-white/10 hover:bg-white/20 border border-white/10 p-4 rounded-2xl transition-colors relative z-10"
                  >
                    <div className="w-12 h-12 bg-white text-brand-primary rounded-full flex items-center justify-center shrink-0 shadow-sm">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-primary-200 font-bold uppercase tracking-wider mb-1">Direct Line</div>
                      <div className="font-extrabold text-xl tracking-tight">{contactNumber}</div>
                    </div>
                  </a>
                </div>

                {/* Features Card */}
                <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                  <h3 className="font-bold text-gray-900 text-lg mb-6">Service Guarantees</h3>
                  <ul className="space-y-5">
                    <li className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-brand-secondary/10 text-brand-secondary flex items-center justify-center shrink-0 mt-0.5">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-sm mb-1">Same Day Visit</div>
                        <div className="text-xs text-gray-500 leading-relaxed">Most service requests are attended to within 24 hours.</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-brand-accent/10 text-brand-accent flex items-center justify-center shrink-0 mt-0.5">
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-sm mb-1">Genuine Parts</div>
                        <div className="text-xs text-gray-500 leading-relaxed">We use only original, manufacturer-certified spare parts.</div>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Hours Card */}
                <div className="bg-gray-50 rounded-3xl border border-gray-100 p-8">
                  <h3 className="font-bold text-gray-900 text-lg mb-4">Working Hours</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200/60">
                      <span className="text-gray-500 font-medium">Monday – Saturday</span>
                      <span className="font-bold text-gray-900">{workingHoursMon}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-500 font-medium">Sunday</span>
                      <span className="font-bold text-gray-900">{workingHoursSun}</span>
                    </div>
                  </div>
                </div>

              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
