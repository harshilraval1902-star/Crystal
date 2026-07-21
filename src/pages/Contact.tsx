import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { SettingsService } from "@/services/settings.service";
import { InquiryService } from "@/services/inquiry.service";

const elegantFadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } }
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
        <section className="relative pt-40 pb-24 bg-surface overflow-hidden border-b border-primary-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-2xl mx-auto">
              <motion.div variants={elegantFadeUp} className="inline-flex items-center gap-2 text-slate font-semibold uppercase tracking-widest text-xs mb-6">
                <MessageCircle className="w-4 h-4 text-primary-500" /> We're Here For You
              </motion.div>
              <motion.h1 variants={elegantFadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight text-brand-primary">
                Let's get in touch.
              </motion.h1>
              <motion.p variants={elegantFadeUp} className="text-lg text-slate leading-relaxed max-w-xl mx-auto font-medium">
                Have questions about our RO purifiers, need a service visit, or looking for AMC details? Our team is just a call or message away.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* MAIN CONTENT GRID */}
        <section className="py-24 lg:py-32 relative z-20 bg-background">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
              
              {/* CONTACT INFO */}
              <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-12">
                <motion.div variants={elegantFadeUp}>
                  <h2 className="text-3xl font-bold text-brand-primary tracking-tight mb-8">Contact Information</h2>
                  
                  <div className="space-y-4">
                    <a
                      href={`tel:${contactNumber}`}
                      className="flex items-center gap-6 p-6 bg-surface rounded-2xl border border-primary-100 hover:border-primary-300 transition-elegant group"
                    >
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-brand-primary shrink-0 border border-primary-100">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate uppercase tracking-wider mb-1">Direct Line</p>
                        <p className="text-xl font-bold text-brand-primary group-hover:text-primary-600 transition-colors">{contactNumber}</p>
                      </div>
                    </a>

                    <a
                      href={`mailto:${email}`}
                      className="flex items-center gap-6 p-6 bg-surface rounded-2xl border border-primary-100 hover:border-primary-300 transition-elegant group"
                    >
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-brand-primary shrink-0 border border-primary-100">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate uppercase tracking-wider mb-1">Email Support</p>
                        <p className="text-base font-medium text-brand-primary group-hover:text-primary-600 transition-colors break-all">{email}</p>
                      </div>
                    </a>
                  </div>
                </motion.div>

                <motion.div variants={elegantFadeUp} className="bg-surface rounded-2xl border border-primary-100 p-10">
                  <h3 className="text-xl font-bold text-brand-primary mb-8">Visit or Find Us</h3>
                  
                  <div className="space-y-8">
                    <div className="flex items-start gap-5">
                      <div className="w-10 h-10 rounded-full bg-white text-brand-primary border border-primary-100 flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate uppercase tracking-wider mb-2">Office Location</p>
                        <p className="text-base font-medium text-brand-primary leading-relaxed">{address}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-5">
                      <div className="w-10 h-10 rounded-full bg-white text-brand-primary border border-primary-100 flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div className="w-full">
                        <p className="text-xs font-semibold text-slate uppercase tracking-wider mb-2">Business Hours</p>
                        <div className="flex justify-between items-center py-2 border-b border-primary-100 text-sm">
                          <span className="text-slate">Monday – Saturday</span>
                          <span className="text-brand-primary font-medium">{workingHoursMon}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 text-sm">
                          <span className="text-slate">Sunday</span>
                          <span className="text-brand-primary font-medium">{workingHoursSun}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

              </motion.div>

              {/* CONTACT FORM */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}>
                <div className="bg-white rounded-2xl border border-primary-200 shadow-sm p-8 sm:p-12 relative overflow-hidden">
                  
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-brand-primary tracking-tight mb-2">Send an Inquiry</h2>
                    <p className="text-slate font-medium text-sm">Fill out the form and our team will get back to you shortly.</p>
                  </div>

                  <AnimatePresence mode="wait">
                    {submitted ? (
                      <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-12">
                        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-100">
                          <CheckCircle2 className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-brand-primary mb-3 tracking-tight">Message Sent!</h3>
                        <p className="text-slate mb-8 max-w-sm mx-auto text-sm">Thank you for reaching out. A representative will contact you soon.</p>
                        <button
                          onClick={() => setSubmitted(false)}
                          className="bg-brand-primary text-white font-medium px-8 py-3.5 rounded-lg hover:bg-primary-900 transition-elegant"
                        >
                          Send Another Message
                        </button>
                      </motion.div>
                    ) : (
                      <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleInquirySubmit} className="space-y-5">
                        {submitError && (
                          <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm font-medium border border-red-100">{submitError}</div>
                        )}
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div>
                            <label className="block text-sm font-semibold text-brand-primary mb-2">Full Name *</label>
                            <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe"
                              className={`w-full bg-surface border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary focus:bg-white transition-elegant ${formErrors.name ? "border-red-300" : "border-primary-200"}`} />
                            {formErrors.name && <p className="mt-1.5 text-xs text-red-500">{formErrors.name}</p>}
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-brand-primary mb-2">Phone Number *</label>
                            <input name="phone" value={form.phone} onChange={handleChange} placeholder="10-digit number" maxLength={10}
                              className={`w-full bg-surface border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary focus:bg-white transition-elegant ${formErrors.phone ? "border-red-300" : "border-primary-200"}`} />
                            {formErrors.phone && <p className="mt-1.5 text-xs text-red-500">{formErrors.phone}</p>}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-brand-primary mb-2">Email Address <span className="text-slate font-normal">(Optional)</span></label>
                          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com"
                            className="w-full bg-surface border border-primary-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary focus:bg-white transition-elegant" />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-brand-primary mb-2">Subject</label>
                          <input name="subject" value={form.subject} onChange={handleChange} placeholder="How can we help you?"
                            className="w-full bg-surface border border-primary-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary focus:bg-white transition-elegant" />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-brand-primary mb-2">Message</label>
                          <textarea name="message" rows={4} value={form.message} onChange={handleChange} placeholder="Tell us more about your requirements..."
                            className="w-full bg-surface border border-primary-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary focus:bg-white transition-elegant resize-none" />
                        </div>

                        <div className="pt-2">
                          <button type="submit" disabled={submitting}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-primary py-3.5 text-sm font-medium text-white transition-elegant disabled:opacity-70 disabled:cursor-not-allowed group">
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                            {submitting ? "Sending…" : "Send Inquiry"}
                          </button>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>

                  <div className="mt-8 pt-6 border-t border-primary-100">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 w-full py-3.5 rounded-lg font-medium text-white text-sm transition-elegant hover:opacity-90"
                      style={{ backgroundColor: "#25D366" }}
                    >
                      <MessageCircle className="w-5 h-5" />
                      Chat on WhatsApp Instead
                    </a>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* ABOUT BOTTOM SECTION */}
        <section className="py-24 lg:py-32 bg-brand-primary text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={elegantFadeUp} className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 tracking-tight">About Crystal Natural Water</h2>
              <p className="text-lg text-primary-200 leading-relaxed mb-12 font-medium">
                {aboutSection} Our expert technicians use only genuine spare parts to ensure your purifier delivers 100% safe, healthy water for years to come.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { value: yearsExperience, label: "Years Experience" },
                  { value: happyCustomers, label: "Happy Customers" },
                  { value: "100%", label: "Genuine Parts" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-primary-900 rounded-2xl p-6 border border-primary-700">
                    <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                    <div className="text-xs font-semibold text-primary-300 uppercase tracking-wider">{stat.label}</div>
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
