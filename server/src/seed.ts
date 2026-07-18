import "dotenv/config";
import bcrypt from "bcryptjs";
import prisma from "./config/db";

async function seed() {
  console.log("🌱 Seeding database...");

  // ── Admin ─────────────────────────────────────────────────────────────────
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: "admin@crystalwater.in" },
  });

  if (!existingAdmin) {
    const hash = await bcrypt.hash("Crystal@2025", 12);
    await prisma.admin.create({
      data: {
        email: "admin@crystalwater.in",
        password: hash,
        name: "Crystal Admin",
        role: "admin",
      },
    });
    console.log("✅ Admin created: admin@crystalwater.in / Crystal@2025");
  } else {
    console.log("ℹ️  Admin already exists, skipping.");
  }

  // ── Settings ──────────────────────────────────────────────────────────────
  const settingsCount = await prisma.setting.count();
  if (!settingsCount) {
    const defaults = [
      { key: "companyName",       value: "Crystal Natural Water" },
      { key: "contactNumber",     value: "9584024777" },
      { key: "whatsappNumber",    value: "919584024777" },
      { key: "email",             value: "crystalnaturalwater@gmail.com" },
      { key: "address",           value: "India | Established 2019" },
      { key: "homeHeroTitle",     value: "Pure Water, Healthy Life." },
      { key: "homeHeroSubtitle",  value: "Trusted RO Water Purifier Sales, Installation & Service" },
      { key: "aboutSection",      value: "Crystal Natural Water is a trusted RO water purifier sales and service company established in 2019." },
      { key: "missionText",       value: "To make safe drinking water accessible by delivering thoughtfully selected RO systems, expert service, and honest guidance for every customer." },
      { key: "footerText",        value: "Trusted RO Water Purifier Sales & Service since 2019. Delivering pure, safe drinking water for homes and businesses." },
      { key: "workingHoursMon",   value: "9 AM – 7 PM" },
      { key: "workingHoursSun",   value: "10 AM – 4 PM" },
      { key: "yearsExperience",   value: "5+" },
      { key: "happyCustomers",    value: "500+" },
    ];
    await prisma.setting.createMany({ data: defaults });
    console.log("✅ Default settings seeded.");
  }

  // ── AMC Plans ─────────────────────────────────────────────────────────────
  const amcCount = await prisma.amcPlan.count();
  if (!amcCount) {
    await prisma.amcPlan.createMany({
      data: [
        { name: "Basic Care",    price: "999",  durationMonths: 12, description: "Essential yearly RO maintenance.", serviceVisits: 2, sparePartsCovered: false, prioritySupport: false, badge: "Value",      isActive: true, displayOrder: 1 },
        { name: "Complete Care", price: "1799", durationMonths: 12, description: "Complete annual RO service and filter support.", serviceVisits: 3, sparePartsCovered: true, prioritySupport: false, badge: "Popular",    isActive: true, displayOrder: 2 },
        { name: "Premium Care",  price: "2999", durationMonths: 12, description: "Priority maintenance for complete peace of mind.", serviceVisits: 4, sparePartsCovered: true, prioritySupport: true, badge: "Best Value", isActive: true, displayOrder: 3 },
      ],
    });
    console.log("✅ AMC plans seeded.");
  }

  // ── Testimonials ──────────────────────────────────────────────────────────
  const testimonialCount = await prisma.testimonial.count();
  if (!testimonialCount) {
    await prisma.testimonial.createMany({
      data: [
        { customerName: "Rajesh Kumar",  review: "Excellent service! Technician came within 2 hours and fixed my RO. Very professional and affordable.", rating: 5, isActive: true, displayOrder: 1 },
        { customerName: "Priya Sharma",  review: "Bought a new RO from Crystal Natural Water. Installation was smooth, water quality is amazing!", rating: 5, isActive: true, displayOrder: 2 },
        { customerName: "Amit Patel",    review: "Annual AMC plan is very cost-effective. No hidden charges, transparent pricing. Will renew again.", rating: 5, isActive: true, displayOrder: 3 },
      ],
    });
    console.log("✅ Testimonials seeded.");
  }

  // ── Site Services ─────────────────────────────────────────────────────────
  const siteServiceCount = await prisma.siteService.count();
  if (!siteServiceCount) {
    await prisma.siteService.createMany({
      data: [
        { title: "RO Purifier Sales", description: "Wide range of domestic and commercial RO systems from trusted brands at competitive prices.", href: "/ro-sales",       cta: "View Products", icon: "ShoppingBag", accent: "blue",   isActive: true, displayOrder: 1 },
        { title: "AMC Plans",         description: "Affordable Annual Maintenance Contract plans to keep your RO running perfectly year-round.",   href: "/amc-plans",      cta: "See Plans",     icon: "Wrench",      accent: "indigo", isActive: true, displayOrder: 2 },
        { title: "Book a Service",    description: "Installation, repair, filter change, or general checkup — our technicians are just a call away.", href: "/service-booking", cta: "Book Now",     icon: "Calendar",    accent: "cyan",   isActive: true, displayOrder: 3 },
      ],
    });
    console.log("✅ Site services seeded.");
  }

  // ── FAQs ──────────────────────────────────────────────────────────────────
  const faqCount = await prisma.faq.count();
  if (!faqCount) {
    await prisma.faq.createMany({
      data: [
        { question: "What is an AMC plan?",               answer: "An Annual Maintenance Contract (AMC) is a yearly service agreement that covers regular servicing, filter changes, and repairs for your RO purifier, saving you from unexpected maintenance costs.", category: "AMC",     isActive: true, displayOrder: 1 },
        { question: "When does the AMC start?",           answer: "The AMC starts from the date of enrollment. You'll receive a service confirmation via call or WhatsApp.", category: "AMC",     isActive: true, displayOrder: 2 },
        { question: "Are spare parts included?",          answer: "Basic AMC does not include spare parts. Standard includes membrane replacement. Premium covers all parts and components.", category: "AMC",     isActive: true, displayOrder: 3 },
        { question: "How do I book a service under AMC?", answer: "Simply call us at 9584024777 or use our Service Booking form. We'll schedule a visit at your convenience.", category: "AMC",     isActive: true, displayOrder: 4 },
        { question: "Which RO brands do you service?",    answer: "We service all major RO brands including Kent, Aquaguard, Livpure, Pureit, Aqua, OLiX, and more.", category: "General", isActive: true, displayOrder: 5 },
        { question: "Do you offer same-day service?",     answer: "Yes! We offer same-day service for most requests. Call us at 9584024777 to book an emergency visit.", category: "General", isActive: true, displayOrder: 6 },
      ],
    });
    console.log("✅ FAQs seeded.");
  }

  // ── Products ──────────────────────────────────────────────────────────────
  const productCount = await prisma.product.count();
  if (!productCount) {
    await prisma.product.createMany({
      data: [
        {
          name: "Aqua Moor Copper Alkaline", slug: "aqua-moor-copper-alkaline", brand: "Aqua", model: "Moor",
          category: "RO Purifier", price: "9499", discountPrice: "12000",
          description: "Advanced Zinc + Copper + Alkaline RO with digital display. 8-stage purification ideal for hard water.",
          features: JSON.stringify(["Zinc + Copper + Alkaline", "Digital Display", "8-Stage RO+UV", "2 Year Warranty"]),
          warranty: "2 Year Warranty", stockStatus: "in_stock", badge: "Best Seller", isActive: true, featured: true, displayOrder: 1,
        },
        {
          name: "Aqua 2090 Next", slug: "aqua-2090-next", brand: "Aqua", model: "2090 Next",
          category: "RO Purifier", price: "7499", discountPrice: "9500",
          description: "Reliable everyday purifier with high-flow output. Smart purification for families of 4–6 members.",
          features: JSON.stringify(["6-Stage RO+UV+UF", "15L Storage Tank", "Smart Filter Alert", "1 Year Warranty"]),
          warranty: "1 Year Warranty", stockStatus: "in_stock", badge: "Popular", isActive: true, featured: true, displayOrder: 2,
        },
        {
          name: "Aqua Zuric", slug: "aqua-zuric", brand: "Aqua", model: "Zuric",
          category: "RO Purifier", price: "11999", discountPrice: "15000",
          description: "Dual-view model with Zinc + Copper Alkaline RO technology. LED indicators and copper tap design.",
          features: JSON.stringify(["Zinc + Copper Alkaline", "LED Indicators", "Copper Tap Nozzle", "3 Year Warranty"]),
          warranty: "3 Year Warranty", stockStatus: "in_stock", badge: "Premium", isActive: true, featured: true, displayOrder: 3,
        },
        {
          name: "OLiX LED Purifier", slug: "olix-led-purifier", brand: "OLiX", model: "LED",
          category: "RO Purifier", price: "8299", discountPrice: "10500",
          description: "Sleek design with LED status panel showing purification, power, and tank-full indicators in real-time.",
          features: JSON.stringify(["LED Status Panel", "7-Stage Purification", "14L SS Tank", "2 Year Warranty"]),
          warranty: "2 Year Warranty", stockStatus: "in_stock", badge: "New Arrival", isActive: true, featured: true, displayOrder: 4,
        },
      ],
    });
    console.log("✅ Products seeded (without images — upload via admin panel).");
  }

  console.log("🎉 Seeding complete!");
}

seed()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
