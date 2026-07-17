import { ReactNode } from "react";
import { motion } from "framer-motion";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
}

export default function PageHeader({ title, subtitle, breadcrumbs = [], actions }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="rounded-[2rem] border border-slate-200 bg-white px-6 py-6 shadow-sm"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          {breadcrumbs.length > 0 && (
            <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
              <ol className="flex flex-wrap items-center gap-2">
                {breadcrumbs.map((item, index) => (
                  <li key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
                    {item.href ? (
                      <a href={item.href} className="text-slate-500 transition hover:text-slate-900">
                        {item.label}
                      </a>
                    ) : (
                      <span>{item.label}</span>
                    )}
                    {index < breadcrumbs.length - 1 && <span className="text-slate-300">/</span>}
                  </li>
                ))}
              </ol>
            </nav>
          )}
          <div>
            <h1 className="text-3xl font-semibold text-slate-950 sm:text-4xl">{title}</h1>
            {subtitle && <p className="mt-2 max-w-2xl text-sm text-slate-600">{subtitle}</p>}
          </div>
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </motion.div>
  );
}
