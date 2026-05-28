"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { clsx } from "clsx";
import type { ToastMessage } from "@/types";

interface ToastContextType {
  toast: (message: Omit<ToastMessage, "id">) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast muss innerhalb von ToastProvider verwendet werden");
  return ctx;
}

const TOAST_ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const TOAST_COLORS = {
  success: "border-success text-success",
  error: "border-error text-error",
  warning: "border-warning text-warning",
  info: "border-accent-orange text-accent-orange",
};

function ToastItem({
  toast,
  onRemove,
}: {
  toast: ToastMessage;
  onRemove: (id: string) => void;
}) {
  const Icon = TOAST_ICONS[toast.type];

  return (
    <div
      className={clsx(
        "toast animate-slide-up flex items-start gap-3",
        TOAST_COLORS[toast.type],
        "shadow-pixel"
      )}
      role="alert"
      aria-live="polite"
    >
      <Icon size={18} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
      <div className="flex-1 min-w-0">
        <p className="font-pixel text-text-primary" style={{ fontSize: "0.5rem", lineHeight: "1.6" }}>
          {toast.title}
        </p>
        {toast.message && (
          <p className="font-sans text-xs text-text-secondary mt-1">{toast.message}</p>
        )}
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="flex-shrink-0 text-text-secondary hover:text-text-primary transition-colors p-1"
        aria-label="Benachrichtigung schließen"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message: Omit<ToastMessage, "id">) => {
    const id = crypto.randomUUID();
    const toast: ToastMessage = { ...message, id };
    setToasts((prev) => [...prev.slice(-4), toast]); // Max. 5 Toasts

    const duration = message.duration ?? 4000;
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
  }, [removeToast]);

  const toast = useCallback((message: Omit<ToastMessage, "id">) => addToast(message), [addToast]);
  const success = useCallback((title: string, message?: string) => addToast({ type: "success", title, message }), [addToast]);
  const error   = useCallback((title: string, message?: string) => addToast({ type: "error", title, message }), [addToast]);
  const warning = useCallback((title: string, message?: string) => addToast({ type: "warning", title, message }), [addToast]);
  const info    = useCallback((title: string, message?: string) => addToast({ type: "info", title, message }), [addToast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info }}>
      {children}

      {/* Toast-Container */}
      {toasts.length > 0 && (
        <div
          className="fixed bottom-4 right-4 z-[100] flex flex-col gap-3 w-full max-w-sm"
          aria-label="Benachrichtigungen"
          aria-live="polite"
          aria-atomic="false"
        >
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onRemove={removeToast} />
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}
