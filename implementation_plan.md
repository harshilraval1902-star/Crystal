# Crystal Water Admin Panel Redesign

## Goal Description
Redesign the frontend of the Crystal Water admin panel to achieve a premium, enterprise‑grade SaaS experience while preserving all existing backend APIs, database schema, authentication, and business logic. The redesign will focus on layout, navigation, visual design, component library, responsiveness, accessibility, and performance.

## User Review Required
> [!IMPORTANT] 
> Review the overall design direction and confirm any brand‑specific visual constraints (e.g., brand colors, logo placement, preferred dark‑mode support). The plan introduces a new component library and modifies routing for certain pages; ensure this aligns with your deployment strategy.

## Open Questions
> [!WARNING] 
> - **Brand Color Palette**: Do you have a specific primary/secondary color palette you want to use, or should we generate a harmonious palette based on existing branding?
> - **Typography**: Preferred Google Font family (e.g., Inter, Roboto, Outfit) for headings and body text?
> - **Dark Mode**: Should the admin panel support a toggleable dark mode or a light‑only theme?
> - **Global Search**: Confirm that a global search bar in the top navigation is acceptable and what scope it should cover (products, customers, etc.).
> - **Analytics Data**: Placeholder charts are acceptable initially, but will you provide real analytics endpoints later?
> - **Icon Set**: Any preference for icon library (e.g., lucide, heroicons) or custom SVGs?

## Proposed Changes
---
### Layout & Theming
- Create a new **design system** with CSS variables for colors, spacing, border‑radius (18–20px), shadows, and typography.
- Implement a **glassmorphism top navbar** with backdrop blur and subtle translucency.
- Redesign the **sidebar** with grouped navigation, modern icons, hover/active animations, collapsible behavior, and a smooth slide‑in/out transition.
- Introduce **responsive containers** with max‑width limits and consistent padding.

### Component Library (src/components)
- `PageHeader` – title, breadcrumbs, action buttons.
- `SectionCard` – reusable container with rounded corners, shadow, padding.
- `StatCard` – icon, label, value, optional trend indicator.
- `DataTable` – sticky headers, sortable columns, pagination, bulk actions, responsive layout.
- `SearchBar`, `FilterBar` – debounced search, filter dropdowns.
- `ConfirmDialog`, `ToastProvider` – toast notifications, modal dialogs.
- `SkeletonLoader`, `EmptyState` – loading placeholders and illustrated empty states.
- `ImageUploader`, `MediaPicker` – drag‑and‑drop upload with preview.
- `StatusBadge` – badge variants for status colors.

### Pages
- **Dashboard** (`/admin/dashboard`): Stat cards, quick actions, recent activity sections, analytics charts (Chart.js or Recharts).
- **Products** (`/admin/products`): New product list with card view, action menu, pagination; separate **Add Product** page (`/admin/products/new`) and **Edit Product** page (`/admin/products/:id/edit`).
- **Gallery** (`/admin/gallery`): Grid with large thumbnails, bulk actions, drawer editor.
- **Reviews**, **Testimonials**, **AMC Plans**, **Service Requests**, **Inquiries** – each with modern table layout, filters, status badges, and dedicated detail/edit pages.
- **Settings** – retain existing routes but apply new UI wrappers.

### Routing Adjustments
- Add new routes for `/admin/products/new` and `/admin/products/:id/edit` while preserving existing API calls.
- Ensure legacy URLs redirect to the new routes where applicable (e.g., `/admin/products` remains entry point).

### State Management & Data Fetching
- Use **React Query** (or `@tanstack/react-query`) for data fetching/caching to minimize API calls.
- Introduce context providers for **toast notifications** and **global loading state**.

### Animations
- Integrate **Framer Motion** for page transitions, card hover lifts, sidebar slide, drawer fade‑in/out, and button press effects.
- Keep animation duration ≤ 300ms for performance.

### Accessibility
- Keyboard navigation for all interactive elements, ARIA labels for icons, focus outlines, and sufficient color contrast.

### Performance Optimizations
- Lazy‑load page bundles with `React.lazy` and `Suspense`.
- Lazy‑load images using `loading="lazy"` and placeholder skeletons.
- Memoize heavy components via `React.memo` and `useMemo`.

### Build & Tooling
- Update `vite.config.ts` to include alias `@/components/*`.
- Add **postcss** plugins for nesting and autoprefixing if needed.
- Ensure linting (`eslint`, `prettier`) passes with new UI code.

## Verification Plan
### Automated Tests
- Run existing Jest/React Testing Library suites to ensure no regression on API consumption.
- Add visual regression tests for key pages using Playwright screenshots.

### Manual Verification
- Spin up the dev server (`npm run dev`) and manually inspect each redesigned page.
- Verify CRUD operations (create, edit, delete) still function via the existing backend.
- Test responsive behavior across desktop, tablet, and mobile breakpoints.
- Check toast notifications and loading states appear correctly.
- Validate accessibility with axe-core.

---
*Please review the above plan, answer the open questions, and approve to proceed.*
