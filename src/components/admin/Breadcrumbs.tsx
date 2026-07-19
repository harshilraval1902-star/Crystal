// src/components/admin/Breadcrumbs.tsx
import React from "react";
import { Link } from "wouter";

interface BreadcrumbItem {
  label: string;
  href?: string; // If omitted, renders as plain text (current page)
}

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="text-sm text-gray-600" aria-label="breadcrumb">
      <ol className="flex items-center space-x-1">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center">
            {item.href ? (
              <Link href={item.href} className="hover:underline">
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-gray-900">{item.label}</span>
            )}
            {idx < items.length - 1 && (
              <svg
                className="w-3 h-3 mx-2 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M7.05 4.05a.75.75 0 011.06 0L13 8.94l-4.89 4.89a.75.75 0 11-1.06-1.06L10.88 9.5 7.05 5.67a.75.75 0 010-1.06z" />
              </svg>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
