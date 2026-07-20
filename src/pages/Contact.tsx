import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { SettingsService } from "@/services/settings.service";
import { InquiryService } from "@/services/inquiry.service";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function Contact() {
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    SettingsService.getAll().then(setSettings);
  }, []);

  const contactNumber = settings.contactNumber ?? "9584024777";
  const whatsappNumber = settings.whatsappNumber ?? "919584024777";
  const email = settings.email ?? "crystalnaturalwater@gmail.com";
  const address = settings.address ?? "India | Established 2019";
  const aboutSection = settings.aboutSection ?? "Founded in 2019, Crystal Natural Water is a trusted name in RO Water Purifier sales and service.";
  const yearsExperience = settings.yearsExperience ?? "5+";
  const happyCustomers = settings.happyCustomers ?? "500+";
  const workingHoursMon = settings.workingHoursMon ?? "9:00 AM – 7:00 PM";
  const workingHoursSun = settings.workingHoursSun ?? "10:00 AM – 4:00 PM";

  const message = encodeURIComponent("Hello! I'd like to know more about your RO Water Purifier services.");
  const waUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  const [form, setForm] = useState({ name: "", phone: "", email: "", subject: "", message: "" });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = "Name is required.";
    if (!form.phone.trim()) errors.phone = "Phone is required.";
    else if (!/^\d{10}$/.test(form.phone.trim())) errors.phone = "Enter a valid 10-digit phone number.";
    return errors;
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length) { setFormErrors(errors); return; }
    setSubmitting(true);
    setSubmitError("");
    try {
      await InquiryService.create({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
        subject: form.subject.trim() || undefined,
        message: form.message.trim() || undefined,
      });
      setSubmitted(true);
      setForm({ name: "", phone: "", email: "", subject: "", message: "" });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to send inquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | Crystal Natural Water</title>
        <meta name="description" content={`Contact Crystal Natural Water for RO purifier sales, service, and AMC inquiries. Call ${contactNumber} or email ${email}.`} />
      </Helmet>

      <main className="bg-background min-h-screen">
        {/* HERO SECTION */}
        <section className="relative pt-40 pb-28 bg-[#0A0F1C] overflow-hidden text-white border-b border-primary-800">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-secondary/10 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/5 rounded-full blur-3xl -ml-20 -mb-20" />
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-2xl mx-auto">
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 text-brand-secondary font-black uppercase tracking-widest text-xs mb-6">
                <MessageCircle className="w-4 h-4" /> We're Here For You
              </motion.div>
              <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-none">
                Let's get in touch.
              </motion.h1>
              <motion.p variants={fadeUp} className="text-lg text-gray-300 leading-relaxed max-w-xl mx-auto font-medium">
                Have questions about our RO purifiers, need a service visit, or looking for AMC details? Our team is just a call or message away.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* MAIN CONTENT GRID */}
        <section className="py-24 lg:py-32 relative z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
              
              {/* CONTACT INFO */}
              <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-12">
                <motion.div variants={fadeUp}>
                  <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-8">Contact Information</h2>
                  
                  <div className="space-y-6">
                    <a
                      href={`tel:${contactNumber}`}
                      className="flex items-center gap-6 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-brand-primary/20 transition-all duration-300 group"
                    >
                      <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white text-brand-primary transition-colors shrink-0">
                        <Phone className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Direct Line</p>
                        <p className="text-2xl font-extrabold text-gray-900 group-hover:text-brand-primary transition-colors">{contactNumber}</p>
                      </div>
                    </a>

                    <a
                      href={`mailto:${email}`}
                      className="flex items-center gap-6 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-brand-primary/20 transition-all duration-300 group"
                    >
                      <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white text-brand-primary transition-colors shrink-0">
                        <Mail className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Email Support</p>
                        <p className="text-lg font-bold text-gray-900 group-hover:text-brand-primary transition-colors break-all">{email}</p>
                      </div>
                    </a>
                  </div>
                </motion.div>

                <motion.div variants={fadeUp} className="bg-white rounded-3xl border border-gray-100 p-10 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-8">Visit or Find Us</h3>
                  
                  <div className="space-y-8">
                    <div className="flex items-start gap-5">
                      <div className="w-10 h-10 rounded-full bg-brand-secondary/10 text-brand-secondary flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Office Location</p>
                        <p className="text-base font-semibold text-gray-900 leading-relaxed">{address}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-5">
                      <div className="w-10 h-10 rounded-full bg-brand-accent/10 text-brand-accent flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div className="w-full">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Business Hours</p>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100 font-semibold text-sm">
                          <span className="text-gray-500">Monday – Saturday</span>
                          <span className="text-gray-900 font-bold">{workingHoursMon}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 font-semibold text-sm">
                          <span className="text-gray-500">Sunday</span>
                          <span className="text-gray-900 font-bold">{workingHoursSun}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

              </motion.div>

              {/* CONTACT FORM */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-primary-900/5 p-8 sm:p-12 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-primary to-brand-secondary"></div>
                  
                  <div className="mb-8">
                    <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-2">Send an Inquiry</h2>
                    <p className="text-gray-500 font-medium">Fill out the form and our team will get back to you shortly.</p>
                  </div>

                  <AnimatePresence mode="wait">
                    {submitted ? (
                      <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center py-12">
                        <div className="w-20 h-20 bg-brand-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                          <CheckCircle2 className="w-10 h-10 text-brand-accent" />
                        </div>
                        <h3 className="text-2xl font-extrabold text-gray-900 mb-3 tracking-tight">Message Sent!</h3>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto font-medium">Thank you for reaching out. A representative will contact you soon.</p>
                        <button
                          onClick={() => setSubmitted(false)}
                          className="bg-gray-900 text-white font-bold px-8 py-3.5 rounded-full hover:bg-gray-800 transition-colors shadow-md hover:scale-\[1.01\]"
                        >
                          Send Another Message
                        </button>
                      </motion.div>
                    ) : (
                      <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleInquirySubmit} className="space-y-5">
                        {submitError && (
                          <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium border border-red-100">{submitError}</div>
                        )}
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <motion.div animate={formErrors.name ? { x: [-4, 4, -4, 4, 0] } : {}} transition={{ duration: 0.4 }}>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
                            <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe"
                              className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary focus:bg-white transition-all ${formErrors.name ? "border-red-300 focus:ring-red-500/20" : "border-gray-200"}`} />
                            {formErrors.name && <p className="mt-1.5 text-xs font-semibold text-red-500">{formErrors.name}</p>}
                          </motion.div>
                          <motion.div animate={formErrors.phone ? { x: [-4, 4, -4, 4, 0] } : {}} transition={{ duration: 0.4 }}>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number *</label>
                            <input name="phone" value={form.phone} onChange={handleChange} placeholder="10-digit number" maxLength={10}
                              className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary focus:bg-white transition-all ${formErrors.phone ? "border-red-300 focus:ring-red-500/20" : "border-gray-200"}`} />
                            {formErrors.phone && <p className="mt-1.5 text-xs font-semibold text-red-500">{formErrors.phone}</p>}
                          </motion.div>
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Email Address <span className="text-gray-400 font-normal">(Optional)</span></label>
                          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary focus:bg-white transition-all" />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                          <input name="subject" value={form.subject} onChange={handleChange} placeholder="How can we help you?"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary focus:bg-white transition-all" />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                          <textarea name="message" rows={4} value={form.message} onChange={handleChange} placeholder="Tell us more about your requirements..."
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary focus:bg-white transition-all resize-none" />
                        </div>

                        <div className="pt-2">
                          <button type="submit" disabled={submitting}
                            className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-primary py-4 text-base font-bold text-white transition-all shadow-lg shadow-brand-primary/20 hover:scale-\[1.01\] active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed">
                            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                            {submitting ? "Sending…" : "Send Inquiry"}
                          </button>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>

                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 w-full py-4 rounded-xl font-bold text-white text-base shadow-lg hover:scale-\[1.01\] active:translate-y-0 transition-all"
                      style={{ backgroundColor: "#25D366", boxShadow: "0 10px 25px -5px rgba(37, 211, 102, 0.3)" }}
                    >
                      <MessageCircle className="w-6 h-6" />
                      Chat on WhatsApp Instead
                    </a>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* ABOUT BOTTOM SECTION */}
        <section className="py-24 lg:py-32 bg-[#0A0F1C] text-white relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-extrabold mb-6 tracking-tight">About Crystal Natural Water</h2>
              <p className="text-lg text-gray-300 leading-relaxed mb-12 font-medium">
                {aboutSection} Our expert technicians use only genuine spare parts to ensure your purifier delivers 100% safe, healthy water for years to come.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { value: yearsExperience, label: "Years Experience" },
                  { value: happyCustomers, label: "Happy Customers" },
                  { value: "100%", label: "Genuine Parts" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10 shadow-sm">
                    <div className="text-4xl font-extrabold text-white mb-2">{stat.value}</div>
                    <div className="text-xs font-black text-brand-secondary tracking-widest uppercase">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
