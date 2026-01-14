import React, { useEffect } from "react";
import { FiAlertTriangle, FiX, FiCheckCircle, FiInfo, FiAlertCircle } from "react-icons/fi";

const typeConfig = {
  success: {
    icon: FiCheckCircle,
    colorClass: "text-green-500",
    bgClass: "bg-green-500",
    borderClass: "border-green-500/20",
    bgLightClass: "bg-green-500/10",
    shadowClass: "shadow-green-500/20"
  },
  error: {
    icon: FiAlertTriangle,
    colorClass: "text-red-500",
    bgClass: "bg-red-500",
    borderClass: "border-red-500/20",
    bgLightClass: "bg-red-500/10",
    shadowClass: "shadow-red-500/20"
  },
  warning: {
    icon: FiAlertCircle,
    colorClass: "text-yellow-500",
    bgClass: "bg-yellow-500",
    borderClass: "border-yellow-500/20",
    bgLightClass: "bg-yellow-500/10",
    shadowClass: "shadow-yellow-500/20"
  },
  info: {
    icon: FiInfo,
    colorClass: "text-blue-500",
    bgClass: "bg-blue-500",
    borderClass: "border-blue-500/20",
    bgLightClass: "bg-blue-500/10",
    shadowClass: "shadow-blue-500/20"
  }
};

export default function Dialog({
  open,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "info",
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [open]);

  if (!open) return null;

  const config = typeConfig[type] || typeConfig.info;
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md animate-fade-in"
        onClick={onCancel}
      />
      
      <div className="relative glass-card-premium p-10 max-w-sm w-full border-none ring-1 ring-white/10 shadow-[0_32px_128px_rgba(0,0,0,0.5)] animate-fade-in-scale">
        <button 
          onClick={onCancel}
          className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
        >
          <FiX size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className={`w-16 h-16 ${config.bgLightClass} rounded-2xl flex items-center justify-center mb-8 border ${config.borderClass}`}>
            <Icon className={`text-3xl ${config.colorClass}`} />
          </div>
          
          <h3 className="text-2xl font-black text-white italic mb-4 tracking-tight">{title}</h3>
          <p className="text-gray-400 text-sm font-medium leading-relaxed mb-10">
            {message}
          </p>

          <div className="w-full space-y-3">
             <button
              onClick={onConfirm}
              className={`w-full py-4 ${config.bgClass} hover:opacity-90 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl ${config.shadowClass} active:scale-95`}
            >
              {confirmText}
            </button>
            {cancelText && (
              <button
                onClick={onCancel}
                className="w-full py-4 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl border border-white/5 transition-all"
              >
                {cancelText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
