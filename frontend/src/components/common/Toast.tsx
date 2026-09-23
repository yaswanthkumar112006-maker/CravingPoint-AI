import React, { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

export function showToast(message: string, type: "success" | "error" | "info" = "success") {
  window.dispatchEvent(
    new CustomEvent("cp-toast", {
      detail: { id: Math.random().toString(36).substring(2, 9), message, type },
    })
  );
}

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleToast = (e: Event) => {
      const customEvent = e as CustomEvent<ToastMessage>;
      if (customEvent.detail) {
        const newToast = customEvent.detail;
        setToasts((prev) => [...prev, newToast]);

        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
        }, 3500);
      }
    };

    window.addEventListener("cp-toast", handleToast);
    return () => window.removeEventListener("cp-toast", handleToast);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-24 right-6 z-[120] flex flex-col space-y-2 pointer-events-none max-w-sm w-full select-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between p-4 rounded-2xl shadow-xl border backdrop-blur-md transition-all duration-300 animate-fade-in ${
            toast.type === "success"
              ? "bg-white/95 border-emerald-200 text-emerald-950"
              : toast.type === "error"
              ? "bg-white/95 border-red-200 text-red-950"
              : "bg-white/95 border-gray-200 text-gray-900"
          }`}
        >
          <div className="flex items-center space-x-3">
            {toast.type === "success" && (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            )}
            {toast.type === "error" && (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            {toast.type === "info" && (
              <Info className="w-5 h-5 text-blue-600 shrink-0" />
            )}
            <p className="text-xs font-bold leading-snug">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-gray-400 hover:text-gray-600 ml-3 p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
