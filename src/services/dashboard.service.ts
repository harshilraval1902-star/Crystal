import { AmcService } from "./amc.service";
import { FaqService } from "./content.service";
import { GalleryService } from "./gallery.service";
import { InquiryService } from "./inquiry.service";
import { ProductService } from "./product.service";
import { ReviewService } from "./review.service";
import { BookingService } from "./booking.service";
import { SiteServiceService } from "./content.service";
import { TestimonialService } from "./testimonial.service";

export const DashboardService = {
  async getAll() {
    const [products, amcPlans, serviceRequests, inquiries, testimonials, reviews, faqs, gallery, siteServices] =
      await Promise.all([
        ProductService.getAll(),
        AmcService.getAll(),
        BookingService.getAll(),
        InquiryService.getAll(),
        TestimonialService.getAll(),
        ReviewService.getAll(),
        FaqService.getAll(),
        GalleryService.getAll(),
        SiteServiceService.getAll(),
      ]);
    return { products, amcPlans, serviceRequests, inquiries, testimonials, reviews, faqs, gallery, siteServices };
  },
  async getById() { return null; },
  async create() { throw new Error("Dashboard records cannot be created."); },
  async update() { throw new Error("Dashboard records cannot be updated."); },
  async delete() { throw new Error("Dashboard records cannot be deleted."); },
};
