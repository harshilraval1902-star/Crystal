import { z } from "zod";

// Product validation schemas
export const productCreateSchema = z.object({
  name: z.string().min(1, "name is required"),
  slug: z.string().min(1, "slug is required"),
  price: z.string().min(1, "price is required"),
  brand: z.string().optional().nullable(),
  model: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  discountPrice: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  features: z.array(z.string()).optional().nullable(),
  specifications: z.string().optional().nullable(),
  warranty: z.string().optional().nullable(),
  stockStatus: z.string().optional().nullable(),
  stock: z.number().int().optional().nullable(),
  featured: z.boolean().optional(),
  mainImageUrl: z.string().optional().nullable(),
  thumbnail: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  images: z.array(z.string()).optional().nullable(),
  variants: z.array(z.string()).optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  badge: z.string().optional().nullable(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
});

export const productUpdateSchema = productCreateSchema.partial();

// Hero Slide validation schemas
export const heroSlideCreateSchema = z.object({
  name: z.string().min(1, "name is required"),
  imgUrl: z.string().min(1, "imgUrl is required"),
  isActive: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
});

export const heroSlideUpdateSchema = heroSlideCreateSchema.partial();

// Gallery validation schemas
export const galleryCreateSchema = z.object({
  title: z.string().min(1, "title is required"),
  imageUrl: z.string().optional().nullable(), // optional because file upload might populate it
  category: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});

export const galleryUpdateSchema = galleryCreateSchema.partial();

// Booking (ServiceRequest) validation schemas
export const bookingCreateSchema = z.object({
  customerName: z.string().min(1, "customerName is required"),
  phone: z.string().min(1, "phone is required"),
  email: z.string().email("Invalid email format").optional().nullable().or(z.literal("")),
  address: z.string().optional().nullable(),
  serviceType: z.string().optional().nullable(),
  message: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
});

export const bookingUpdateSchema = bookingCreateSchema.partial();

// Subscriber validation schemas
export const subscriberCreateSchema = z.object({
  email: z.string().email("Please provide a valid email address."),
});

export const subscriberBulkDeleteSchema = z.object({
  ids: z.array(z.number().int()).min(1, "Subscriber IDs array is required"),
});

// Testimonial validation schemas
export const testimonialCreateSchema = z.object({
  customerName: z.string().min(1, "customerName is required"),
  review: z.string().min(1, "review is required"),
  rating: z.number().int().min(1).max(5).optional(),
  location: z.string().optional().nullable(),
  designation: z.string().optional().nullable(),
  photoUrl: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
});

export const testimonialUpdateSchema = testimonialCreateSchema.partial();

// FAQ validation schemas
export const faqCreateSchema = z.object({
  question: z.string().min(1, "question is required"),
  answer: z.string().min(1, "answer is required"),
  category: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
});

export const faqUpdateSchema = faqCreateSchema.partial();

// AMC Plan validation schemas
export const amcPlanCreateSchema = z.object({
  name: z.string().min(1, "name is required"),
  price: z.string().min(1, "price is required"),
  durationMonths: z.number().int().optional(),
  description: z.string().optional().nullable(),
  serviceVisits: z.number().int().optional(),
  sparePartsCovered: z.boolean().optional(),
  prioritySupport: z.boolean().optional(),
  badge: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
});

export const amcPlanUpdateSchema = amcPlanCreateSchema.partial();

// Site Service validation schemas
export const siteServiceCreateSchema = z.object({
  title: z.string().min(1, "title is required"),
  description: z.string().min(1, "description is required"),
  href: z.string().min(1, "href is required"),
  cta: z.string().min(1, "cta is required"),
  icon: z.string().optional().nullable(),
  accent: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
});

export const siteServiceUpdateSchema = siteServiceCreateSchema.partial();

// Site Settings validation schemas
export const siteSettingsUpdateSchema = z.record(z.any());

// Inquiry/Contact validation schemas
export const inquiryCreateSchema = z.object({
  name: z.string().min(1, "name is required"),
  phone: z.string().min(1, "phone is required"),
  email: z.string().email("Invalid email format").optional().nullable().or(z.literal("")),
  subject: z.string().optional().nullable(),
  message: z.string().optional().nullable(),
});

export const inquiryUpdateSchema = inquiryCreateSchema.partial();
