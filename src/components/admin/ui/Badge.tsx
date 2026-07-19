import React, { HTMLAttributes } from 'react';
import { cn } from './Button';

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'active' | 'draft' | 'pending' | 'urgent' | 'archived';
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    
    const variants = {
      default: "bg-gray-100 text-gray-800",
      active: "bg-accent-50 text-accent-600",
      draft: "bg-gray-100 text-gray-600",
      pending: "bg-warning-50 text-warning-600",
      urgent: "bg-danger-50 text-danger-600",
      archived: "bg-gray-100 text-gray-400",
    };

    const dotColors = {
      default: "bg-gray-500",
      active: "bg-accent-500",
      draft: "bg-gray-400",
      pending: "bg-warning-500",
      urgent: "bg-danger-500",
      archived: "bg-gray-300",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
          variants[variant],
          className
        )}
        {...props}
      >
        <span className={cn("mr-1.5 h-1.5 w-1.5 rounded-full", dotColors[variant])} aria-hidden="true"></span>
        {children}
      </div>
    );
  }
);

Badge.displayName = "Badge";
