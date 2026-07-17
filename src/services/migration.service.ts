import aquaMoorBlack from "@/assets/Aqua_Moor_(2)_1775412426683.jpg";
import aquaMoorWhite from "@/assets/Aqua_Moor_(3)_1775412426684.jpg";
import aquaMoorDark from "@/assets/Aqua_Moor_(5)_1775412426684.jpg";
import aqua2090Blue from "@/assets/Aqua2090_(2)_1775412426685.jpg";
import aqua2090Teal from "@/assets/Aqua2090_(3)_1775412426685.jpg";
import aqua2090White from "@/assets/Aqua2090_(4)_1775412426685.jpg";
import aqua2090Black from "@/assets/Aqua2090_(5)_1775412426686.jpg";
import aquaZuric from "@/assets/Aqua-Zuric-Water-Purifier._1775412426686.jpg";
import olixBlack from "@/assets/IMG_20250520_190437_1775412426686.jpg";
import olixBrown from "@/assets/IMG_20250520_190513_1775412426687.jpg";
import { ProductService } from "./product.service";
import { AmcService } from "./amc.service";
import { TestimonialService } from "./testimonial.service";
import { GalleryService } from "./gallery.service";
import { SettingsService } from "./settings.service";
import { FaqService, SiteServiceService } from "./content.service";

/* ─── V1 Migration (original – products, AMC, testimonials, gallery, settings) ─── */
export async function migrateInitialWebsiteData() {
  if ((await ProductService.getAll()).length) return;

  await Promise.all([
    ProductService.create({ name: "Aqua Moor Copper Alkaline", slug: "aqua-moor-copper-alkaline", brand: "Aqua", model: "Moor", category: "RO Purifier", price: "9499", discountPrice: "12000", description: "Advanced Zinc + Copper + Alkaline RO with digital display. 8-stage purification ideal for hard water.", features: ["Zinc + Copper + Alkaline", "Digital Display", "8-Stage RO+UV", "2 Year Warranty"], warranty: "2 Year Warranty", stockStatus: "in_stock", image: aquaMoorBlack, mainImageUrl: aquaMoorBlack, images: [aquaMoorBlack, aquaMoorWhite, aquaMoorDark], variants: [aquaMoorBlack, aquaMoorWhite, aquaMoorDark], badge: "Best Seller", isActive: true, featured: true, displayOrder: 1 }),
    ProductService.create({ name: "Aqua 2090 Next", slug: "aqua-2090-next", brand: "Aqua", model: "2090 Next", category: "RO Purifier", price: "7499", discountPrice: "9500", description: "Reliable everyday purifier with high-flow output. Smart purification for families of 4–6 members.", features: ["6-Stage RO+UV+UF", "15L Storage Tank", "Smart Filter Alert", "1 Year Warranty"], warranty: "1 Year Warranty", stockStatus: "in_stock", image: aqua2090Blue, mainImageUrl: aqua2090Blue, images: [aqua2090Blue, aqua2090Teal, aqua2090White, aqua2090Black], variants: [aqua2090Blue, aqua2090Teal, aqua2090White, aqua2090Black], badge: "Popular", isActive: true, featured: true, displayOrder: 2 }),
    ProductService.create({ name: "Aqua Zuric", slug: "aqua-zuric", brand: "Aqua", model: "Zuric", category: "RO Purifier", price: "11999", discountPrice: "15000", description: "Dual-view model with Zinc + Copper Alkaline RO technology. LED indicators and copper tap design.", features: ["Zinc + Copper Alkaline", "LED Indicators", "Copper Tap Nozzle", "3 Year Warranty"], warranty: "3 Year Warranty", stockStatus: "in_stock", image: aquaZuric, mainImageUrl: aquaZuric, images: [aquaZuric], variants: [aquaZuric], badge: "Premium", isActive: true, featured: true, displayOrder: 3 }),
    ProductService.create({ name: "OLiX LED Purifier", slug: "olix-led-purifier", brand: "OLiX", model: "LED", category: "RO Purifier", price: "8299", discountPrice: "10500", description: "Sleek design with LED status panel showing purification, power, and tank-full indicators in real-time.", features: ["LED Status Panel", "7-Stage Purification", "14L SS Tank", "2 Year Warranty"], warranty: "2 Year Warranty", stockStatus: "in_stock", image: olixBlack, mainImageUrl: olixBlack, images: [olixBlack, olixBrown], variants: [olixBlack, olixBrown], badge: "New Arrival", isActive: true, featured: true, displayOrder: 4 }),
  ]);

  if (!(await AmcService.getAll()).length)
    await Promise.all([
      AmcService.create({ name: "Basic Care", price: "999", durationMonths: 12, description: "Essential yearly RO maintenance.", serviceVisits: 2, sparePartsCovered: false, prioritySupport: false, badge: "Value", isActive: true, displayOrder: 1 }),
      AmcService.create({ name: "Complete Care", price: "1799", durationMonths: 12, description: "Complete annual RO service and filter support.", serviceVisits: 3, sparePartsCovered: true, prioritySupport: false, badge: "Popular", isActive: true, displayOrder: 2 }),
      AmcService.create({ name: "Premium Care", price: "2999", durationMonths: 12, description: "Priority maintenance for complete peace of mind.", serviceVisits: 4, sparePartsCovered: true, prioritySupport: true, badge: "Best Value", isActive: true, displayOrder: 3 }),
    ]);

  if (!(await TestimonialService.getAll()).length)
    await Promise.all([
      TestimonialService.create({ customerName: "Rajesh Kumar", review: "Excellent service! Technician came within 2 hours and fixed my RO. Very professional and affordable.", rating: 5, isActive: true, displayOrder: 1 }),
      TestimonialService.create({ customerName: "Priya Sharma", review: "Bought a new RO from Crystal Natural Water. Installation was smooth, water quality is amazing!", rating: 5, isActive: true, displayOrder: 2 }),
      TestimonialService.create({ customerName: "Amit Patel", review: "Annual AMC plan is very cost-effective. No hidden charges, transparent pricing. Will renew again.", rating: 5, isActive: true, displayOrder: 3 }),
    ]);

  if (!(await GalleryService.getAll()).length)
    await Promise.all(
      [aquaMoorBlack, aquaMoorWhite, aquaMoorDark, aqua2090Blue, aqua2090Teal, aqua2090White, aqua2090Black, aquaZuric, olixBlack, olixBrown].map((imageUrl, index) =>
        GalleryService.create({ title: `Crystal Water Gallery ${index + 1}`, imageUrl, category: "Products", isActive: true }),
      ),
    );

  await SettingsService.update("settings", {
    companyName: "Crystal Natural Water",
    contactNumber: "9584024777",
    whatsappNumber: "919584024777",
    email: "crystalnaturalwater@gmail.com",
    address: "India | Established 2019",
    homeHeroTitle: "Pure Water, Healthy Life.",
    homeHeroSubtitle: "Trusted RO Water Purifier Sales, Installation & Service",
    aboutSection: "Crystal Natural Water is a trusted RO water purifier sales and service company established in 2019.",
    missionText: "To make safe drinking water accessible by delivering thoughtfully selected RO systems, expert service, and honest guidance for every customer.",
    footerText: "Trusted RO Water Purifier Sales & Service since 2019. Delivering pure, safe drinking water for homes and businesses.",
    workingHoursMon: "9 AM – 7 PM",
    workingHoursSun: "10 AM – 4 PM",
    yearsExperience: "5+",
    happyCustomers: "500+",
  });
}

/* ─── V2 Migration (new modules: FAQs, Site Services) ─── */
export async function migrateV2() {
  if ((await SiteServiceService.getAll()).length || (await FaqService.getAll()).length) return;

  await Promise.all([
    SiteServiceService.create({ title: "RO Purifier Sales", description: "Wide range of domestic and commercial RO systems from trusted brands at competitive prices.", href: "/ro-sales", cta: "View Products", icon: "ShoppingBag", accent: "blue", isActive: true, displayOrder: 1 }),
    SiteServiceService.create({ title: "AMC Plans", description: "Affordable Annual Maintenance Contract plans to keep your RO running perfectly year-round.", href: "/amc-plans", cta: "See Plans", icon: "Wrench", accent: "indigo", isActive: true, displayOrder: 2 }),
    SiteServiceService.create({ title: "Book a Service", description: "Installation, repair, filter change, or general checkup — our technicians are just a call away.", href: "/service-booking", cta: "Book Now", icon: "Calendar", accent: "cyan", isActive: true, displayOrder: 3 }),
  ]);

  await Promise.all([
    FaqService.create({ question: "What is an AMC plan?", answer: "An Annual Maintenance Contract (AMC) is a yearly service agreement that covers regular servicing, filter changes, and repairs for your RO purifier, saving you from unexpected maintenance costs.", category: "AMC", isActive: true, displayOrder: 1 }),
    FaqService.create({ question: "When does the AMC start?", answer: "The AMC starts from the date of enrollment. You'll receive a service confirmation via call or WhatsApp.", category: "AMC", isActive: true, displayOrder: 2 }),
    FaqService.create({ question: "Are spare parts included?", answer: "Basic AMC does not include spare parts. Standard includes membrane replacement. Premium covers all parts and components.", category: "AMC", isActive: true, displayOrder: 3 }),
    FaqService.create({ question: "How do I book a service under AMC?", answer: "Simply call us at 9584024777 or use our Service Booking form. We'll schedule a visit at your convenience.", category: "AMC", isActive: true, displayOrder: 4 }),
    FaqService.create({ question: "Which RO brands do you service?", answer: "We service all major RO brands including Kent, Aquaguard, Livpure, Pureit, Aqua, OLiX, and more.", category: "General", isActive: true, displayOrder: 5 }),
    FaqService.create({ question: "Do you offer same-day service?", answer: "Yes! We offer same-day service for most requests. Call us at 9584024777 to book an emergency visit.", category: "General", isActive: true, displayOrder: 6 }),
  ]);
}
