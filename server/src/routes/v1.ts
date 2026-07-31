import { Router } from "express";
import authRoutes from "./auth.routes";
import productRoutes from "./product.routes";
import amcRoutes from "./amc.routes";

import galleryRoutes from "./gallery.routes";
import faqRoutes from "./faq.routes";
import siteServiceRoutes from "./siteService.routes";
import settingsRoutes from "./settings.routes";
import serviceRequestRoutes from "./serviceRequest.routes";
import inquiryRoutes from "./inquiry.routes";
import dashboardRoutes from "./dashboard.routes";
import uploadRoutes from "./upload.routes";
import usersRoutes from "./users.routes";
import heroSlideRoutes from "./heroSlide.routes";
import roFeatureRoutes from "./roFeature.routes";

const router = Router();

// Version 1 Admin Router Mounts
router.use("/admin/auth", authRoutes);
router.use("/admin/products", productRoutes);
router.use("/admin/users", usersRoutes);
router.use("/admin/dashboard", dashboardRoutes);

// Version 1 Public Router Mounts
router.use("/products", productRoutes);
router.use("/amc-plans", amcRoutes);

router.use("/gallery", galleryRoutes);
router.use("/faqs", faqRoutes);
router.use("/site-services", siteServiceRoutes);
router.use("/settings", settingsRoutes);
router.use("/service-requests", serviceRequestRoutes);
router.use("/inquiries", inquiryRoutes);
router.use("/upload", uploadRoutes);
router.use("/hero-slides", heroSlideRoutes);
router.use("/ro-features", roFeatureRoutes);

export default router;
