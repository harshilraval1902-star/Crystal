import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, CheckCircle, Loader2 } from "lucide-react";
import { SettingsService } from "@/services/settings.service";
import { InquiryService } from "@/services/inquiry.service";

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
  const workingHoursMon = settings.workingHoursMon ?? "9 AM – 7 PM";
  const workingHoursSun = settings.workingHoursSun ?? "10 AM – 4 PM";

  const message = encodeURIComponent("Hello! I'd like to know more about your RO Water Purifier services.");
  const waUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  // Inquiry form state
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
      <title>Contact Us | Crystal Natural Water</title>
      <meta name="description" content={`Contact Crystal Natural Water for RO purifier sales, service, and AMC inquiries. Call ${contactNumber} or email ${email}.`} />

      <main>
        <section className="bg-gradient-to-r from-blue-700 to-cyan-600 text-white py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-blue-200 text-sm mb-3">
              <Link href="/" className="hover:text-white">Home</Link>
              <span>/</span>
              <span className="text-white">Contact</span>
            </div>
            <h1 className="text-4xl font-extrabold mb-3">Contact Us</h1>
            <p className="text-blue-100 text-lg max-w-xl">
              Have questions or need a service? We're always ready to help. Reach out via call, WhatsApp, or email.
            </p>
          </div>
        </section>

        <section className="py-16 bg-blue-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-5">
                <div className="bg-white rounded-2xl border border-blue-100 p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">Get In Touch</h2>

                  <div className="space-y-4">
                    <a
                      href={`tel:${contactNumber}`}
                      className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors group"
                    >
                      <div className="bg-blue-600 text-white p-2.5 rounded-lg group-hover:bg-blue-700 transition-colors">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-0.5">Call / WhatsApp</div>
                        <div className="font-bold text-gray-900">{contactNumber}</div>
                      </div>
                    </a>

                    <a
                      href={`mailto:${email}`}
                      className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors group"
                    >
                      <div className="bg-blue-600 text-white p-2.5 rounded-lg group-hover:bg-blue-700 transition-colors">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-0.5">Email</div>
                        <div className="font-bold text-gray-900 break-all">{email}</div>
                      </div>
                    </a>

                    <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                      <div className="bg-blue-600 text-white p-2.5 rounded-lg">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-0.5">Location</div>
                        <div className="font-bold text-gray-900">{address}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                      <div className="bg-blue-600 text-white p-2.5 rounded-lg">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-0.5">Working Hours</div>
                        <div className="font-bold text-gray-900">Mon–Sat: {workingHoursMon}</div>
                        <div className="text-sm text-gray-500">Sunday: {workingHoursSun}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-bold text-white text-lg shadow-lg hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "#25D366" }}
                >
                  <MessageCircle className="w-6 h-6" />
                  Chat on WhatsApp
                </a>
              </div>

              <div className="space-y-5">
                <div className="bg-white rounded-2xl border border-blue-100 p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">About Crystal Natural Water</h2>
                  <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
                    <p>{aboutSection}</p>
                    <p>
                      Our team of skilled technicians provides prompt and reliable service, ensuring your purifier runs at its best. We use only genuine spare parts and follow strict quality standards.
                    </p>
                    <p>
                      Whether you need a new RO system, filter replacement, emergency repair, or an affordable AMC plan — Crystal Natural Water is your one-stop solution for pure, safe drinking water.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-6">
                    {[
                      { value: yearsExperience, label: "Years Experience" },
                      { value: happyCustomers, label: "Happy Customers" },
                      { value: "100%", label: "Genuine Parts" },
                    ].map((stat) => (
                      <div key={stat.label} className="text-center bg-blue-50 rounded-xl p-3 border border-blue-100">
                        <div className="text-2xl font-extrabold text-blue-700">{stat.value}</div>
                        <div className="text-xs text-gray-500">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-blue-100 p-6 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href="/service-booking"
                      className="flex flex-col items-center gap-2 p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-center"
                    >
                      <Phone className="w-5 h-5" />
                      <span className="text-sm font-semibold">Book Service</span>
                    </Link>
                    <Link
                      href="/amc-plans"
                      className="flex flex-col items-center gap-2 p-4 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors text-center"
                    >
                      <Clock className="w-5 h-5" />
                      <span className="text-sm font-semibold">View AMC Plans</span>
                    </Link>
                    <Link
                      href="/ro-sales"
                      className="flex flex-col items-center gap-2 p-4 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors text-center"
                    >
                      <MapPin className="w-5 h-5" />
                      <span className="text-sm font-semibold">RO Products</span>
                    </Link>
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-2 p-4 rounded-xl text-center text-white hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: "#25D366" }}
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm font-semibold">WhatsApp Us</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Inquiry Form Section ── */}
      <section className="py-16 bg-white border-t border-blue-100">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">Send Us a Message</h2>
          <p className="text-center text-gray-500 mb-8">Fill in the form below and we'll get back to you as soon as possible.</p>

          {submitted ? (
            <div className="flex flex-col items-center gap-4 py-12 text-center">
              <CheckCircle className="w-14 h-14 text-green-500" />
              <h3 className="text-xl font-bold text-gray-900">Inquiry sent!</h3>
              <p className="text-gray-500">Thank you for reaching out. We'll contact you shortly.</p>
              <button onClick={() => setSubmitted(false)}
                className="mt-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition">
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleInquirySubmit} className="bg-white rounded-2xl border border-blue-100 p-8 shadow-sm space-y-4">
              {submitError && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">{submitError}</div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Your full name"
                    className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${formErrors.name ? "border-red-400" : "border-gray-200"}`} />
                  {formErrors.name && <p className="mt-1 text-xs text-red-600">{formErrors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input name="phone" value={form.phone} onChange={handleChange} placeholder="10-digit mobile number" maxLength={10}
                    className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${formErrors.phone ? "border-red-400" : "border-gray-200"}`} />
                  {formErrors.phone && <p className="mt-1 text-xs text-red-600">{formErrors.phone}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input name="subject" value={form.subject} onChange={handleChange} placeholder="How can we help you?"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea name="message" rows={4} value={form.message} onChange={handleChange} placeholder="Tell us more about your requirements..."
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none" />
              </div>
              <button type="submit" disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {submitting ? "Sending…" : "Send Inquiry"}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
