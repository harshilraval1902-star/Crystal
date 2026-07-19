import React from "react";
import { LucideIcon, Search } from "lucide-react";
import { Button } from "./Button";
import { useLocation } from "wouter";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionUrl?: string;
  onAction?: () => void;
}

export function EmptyState({ icon: Icon = Search, title, description, actionLabel, actionUrl, onAction }: EmptyStateProps) {
  const [, setLocation] = useLocation();

  const handleAction = () => {
    if (onAction) onAction();
    else if (actionUrl) setLocation(actionUrl);
  };

  return (
    <div className="flex flex-col items-center justify-center p-12 sm:p-16 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-50 text-primary-500 mb-6 relative">
        <div className="absolute inset-0 rounded-full bg-primary-100 animate-ping opacity-20"></div>
        <Icon className="h-10 w-10 relative z-10" strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-2">{title}</h3>
      <p className="text-sm text-gray-500 max-w-sm mx-auto mb-8 leading-relaxed">
        {description}
      </p>
      {actionLabel && (
        <Button variant="primary" onClick={handleAction} className="shadow-sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
