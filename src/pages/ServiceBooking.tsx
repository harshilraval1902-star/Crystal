import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, CheckCircle2, Loader2, Send, Wrench, Shield, Clock } from "lucide-react";
import { BookingService } from "@/services/booking.service";
import { SettingsService } from "@/services/settings.service";

const elegantFadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } }
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
      `*New Service Booking - Crystal Natural Water*\n\n` +
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
        <title>Book RO Service | Crystal Natural Water</title>
        <meta name="description" content="Book a RO Water Purifier service with Crystal Natural Water. Installation, repair, filter replacement, AMC and more. Quick response guaranteed." />
      </Helmet>

      <main className="bg-surface min-h-screen">
        {/* HEADER */}
        <section className="pt-32 pb-16 bg-background border-b border-primary-100">
          <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
            <motion.div initial="hidden" animate="visible" variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}>
              <motion.div variants={elegantFadeUp} className="inline-flex items-center gap-2 text-primary-500 font-semibold text-xs uppercase tracking-widest mb-6">
                <Wrench className="w-4 h-4" /> Fast & Reliable
              </motion.div>
              <motion.h1 variants={elegantFadeUp} className="text-4xl sm:text-5xl font-bold text-brand-primary tracking-tight mb-4">
                Book a Service Request
              </motion.h1>
              <motion.p variants={elegantFadeUp} className="text-lg text-slate max-w-2xl mx-auto font-medium">
                Schedule a visit with our expert technicians. Most service requests are attended to within the same day.
              </motion.p>
            </motion.div>
          </div>
        </section>

        <section className="py-16 relative">
          <div className="absolute top-0 inset-x-0 h-64 bg-background border-b border-primary-100 hidden lg:block"></div>
          
          <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              
              {/* FORM SECTION */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="lg:col-span-7 xl:col-span-8">
                <div className="bg-white rounded-2xl border border-primary-200 shadow-sm p-8 sm:p-10">
                  <AnimatePresence mode="wait">
                    {submitted ? (
                      <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-10">
                        <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-100">
                          <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-bold text-brand-primary mb-3 tracking-tight">Booking Sent!</h2>
                        <p className="text-slate mb-8 max-w-sm mx-auto text-base">
                          Your service request was routed to WhatsApp. Our team will contact you shortly to confirm timing.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <button
                            onClick={() => { setSubmitted(false); setForm(initialForm); }}
                            className="bg-brand-primary text-white font-medium px-8 py-3.5 rounded-lg hover:bg-primary-800 transition-elegant"
                          >
                            Book Another
                          </button>
                          <a
                            href={`tel:${contactNumber}`}
                            className="bg-white border border-primary-200 text-brand-primary font-medium px-8 py-3.5 rounded-lg hover:bg-surface transition-elegant flex items-center justify-center gap-2"
                          >
                            <Phone className="w-4 h-4" />
                            Call Direct
                          </a>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSubmit} className="space-y-6">
                        <div className="border-b border-primary-100 pb-6 mb-6">
                          <h2 className="text-lg font-semibold text-brand-primary">Your Details</h2>
                          <p className="text-sm text-slate">Provide your contact info for the service visit.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-semibold text-brand-primary mb-2" htmlFor="name">Full Name <span className="text-red-500">*</span></label>
                            <input
                              id="name" name="name" type="text" placeholder="John Doe"
                              value={form.name} onChange={handleChange}
                              className={`w-full bg-surface border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary focus:bg-white transition-elegant ${errors.name ? "border-red-300" : "border-primary-200"}`}
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1.5">{errors.name}</p>}
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-brand-primary mb-2" htmlFor="phone">Phone Number <span className="text-red-500">*</span></label>
                            <input
                              id="phone" name="phone" type="tel" placeholder="10-digit number"
                              value={form.phone} onChange={handleChange} maxLength={10}
                              className={`w-full bg-surface border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary focus:bg-white transition-elegant ${errors.phone ? "border-red-300" : "border-primary-200"}`}
                            />
                            {errors.phone && <p className="text-red-500 text-xs mt-1.5">{errors.phone}</p>}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-brand-primary mb-2" htmlFor="address">Service Address <span className="text-red-500">*</span></label>
                          <input
                            id="address" name="address" type="text" placeholder="Full address with landmark"
                            value={form.address} onChange={handleChange}
                            className={`w-full bg-surface border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary focus:bg-white transition-elegant ${errors.address ? "border-red-300" : "border-primary-200"}`}
                          />
                          {errors.address && <p className="text-red-500 text-xs mt-1.5">{errors.address}</p>}
                        </div>

                        <div className="border-t border-primary-100 pt-6 mt-6">
                          <h2 className="text-lg font-semibold text-brand-primary mb-1">Service Details</h2>
                          <p className="text-sm text-slate mb-6">What do you need help with?</p>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-brand-primary mb-2" htmlFor="serviceType">Service Type <span className="text-red-500">*</span></label>
                          <div className="relative">
                            <select
                              id="serviceType" name="serviceType"
                              value={form.serviceType} onChange={handleChange}
                              className={`appearance-none w-full bg-surface border rounded-lg px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary focus:bg-white transition-elegant ${errors.serviceType ? "border-red-300" : "border-primary-200"}`}
                            >
                              <option value="" disabled>-- Select Service Required --</option>
                              {serviceTypes.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                          </div>
                          {errors.serviceType && <p className="text-red-500 text-xs mt-1.5">{errors.serviceType}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-brand-primary mb-2" htmlFor="message">Problem Description <span className="text-slate font-normal">(Optional)</span></label>
                          <textarea
                            id="message" name="message" rows={3} placeholder="Any specific details about the issue..."
                            value={form.message} onChange={handleChange}
                            className="w-full bg-surface border border-primary-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary focus:bg-white transition-elegant resize-none"
                          />
                        </div>

                        <div className="pt-4">
                          <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-brand-primary text-white font-medium py-4 rounded-lg hover:bg-primary-900 transition-elegant disabled:opacity-70 disabled:cursor-not-allowed group"
                          >
                            {loading ? (
                              <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                            ) : (
                              <><Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" /> Submit via WhatsApp</>
                            )}
                          </button>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* SIDEBAR */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }} className="lg:col-span-5 xl:col-span-4 space-y-6">
                
                {/* Contact Card */}
                <div className="bg-brand-primary rounded-2xl p-8 text-white relative overflow-hidden">
                  <h3 className="font-bold text-xl mb-2 relative z-10 tracking-tight">Need immediate help?</h3>
                  <p className="text-primary-300 text-sm mb-6 relative z-10">Call us directly for urgent repairs or queries.</p>
                  <a
                    href={`tel:${contactNumber}`}
                    className="flex items-center gap-4 bg-white/10 hover:bg-white/20 border border-white/10 p-4 rounded-xl transition-elegant relative z-10"
                  >
                    <div className="w-10 h-10 bg-white text-brand-primary rounded-full flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs text-primary-300 uppercase tracking-wider mb-0.5">Direct Line</div>
                      <div className="font-bold text-lg tracking-tight">{contactNumber}</div>
                    </div>
                  </a>
                </div>

                {/* Features Card */}
                <div className="bg-white rounded-2xl border border-primary-200 p-8">
                  <h3 className="font-bold text-brand-primary text-lg mb-6">Service Guarantees</h3>
                  <ul className="space-y-5">
                    <li className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-surface text-brand-primary border border-primary-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-brand-primary text-sm mb-1">Same Day Visit</div>
                        <div className="text-sm text-slate">Most service requests are attended to within 24 hours.</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-surface text-brand-primary border border-primary-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Shield className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-brand-primary text-sm mb-1">Genuine Parts</div>
                        <div className="text-sm text-slate">We use only original, manufacturer-certified spare parts.</div>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Hours Card */}
                <div className="bg-surface rounded-2xl border border-primary-200 p-8">
                  <h3 className="font-bold text-brand-primary text-lg mb-4">Working Hours</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center py-2 border-b border-primary-100">
                      <span className="text-slate">Monday – Saturday</span>
                      <span className="text-brand-primary font-medium">{workingHoursMon}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-slate">Sunday</span>
                      <span className="text-brand-primary font-medium">{workingHoursSun}</span>
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
