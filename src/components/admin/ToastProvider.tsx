import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, XCircle, AlertTriangle } from "lucide-react";

type ToastVariant = "success" | "info" | "warning" | "error";

interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
}

interface ToastContextValue {
  notify: (options: Omit<ToastItem, "id">) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const notify = useCallback((options: Omit<ToastItem, "id">) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setToasts((current) => [...current, { id, ...options }]);
  }, []);

  useEffect(() => {
    if (!toasts.length) return;
    const timers = toasts.map((toast) =>
      window.setTimeout(() => {
        setToasts((current) => current.filter((item) => item.id !== toast.id));
      }, 5000),
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [toasts]);

  const value = useMemo(() => ({ notify }), [notify]);

  const getVariantStyles = (variant: ToastVariant = 'info') => {
    switch (variant) {
      case 'success':
        return { border: 'border-l-accent-500', icon: <CheckCircle2 className="h-5 w-5 text-accent-500" /> };
      case 'error':
        return { border: 'border-l-danger-500', icon: <XCircle className="h-5 w-5 text-danger-500" /> };
      case 'warning':
        return { border: 'border-l-warning-500', icon: <AlertTriangle className="h-5 w-5 text-warning-500" /> };
      case 'info':
      default:
        return { border: 'border-l-primary-500', icon: <Info className="h-5 w-5 text-primary-500" /> };
    }
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-50 flex w-[400px] flex-col gap-3">
        <AnimatePresence>
          {toasts.map((toast) => {
            const { border, icon } = getVariantStyles(toast.variant);
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`pointer-events-auto overflow-hidden rounded-xl bg-white shadow-md ${border} border-l-[3px] border-y border-r border-y-gray-100 border-r-gray-100 relative`}
              >
                <div className="flex items-start gap-3 p-4">
                  <span className="mt-0.5 shrink-0">{icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900">{toast.title}</p>
                    {toast.description && <p className="mt-1 text-sm text-gray-500">{toast.description}</p>}
                  </div>
                </div>
                {/* Progress bar animation */}
                <motion.div 
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 5, ease: "linear" }}
                  className="absolute bottom-0 left-0 h-[2px] bg-gray-200"
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
