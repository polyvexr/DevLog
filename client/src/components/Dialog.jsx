import React, { useEffect } from "react";
import { FiAlertTriangle, FiX, FiCheckCircle, FiInfo, FiAlertCircle } from "react-icons/fi";

const typeConfig = {
  success: {
    icon: FiCheckCircle,
    colorClass: "text-[#e23e2d]",
    bgClass: "bg-[#e23e2d] hover:bg-[#cf2e2e]",
    borderClass: "border-[#e23e2d]/20",
    bgLightClass: "bg-[#e23e2d]/10",
  },
  error: {
    icon: FiAlertTriangle,
    colorClass: "text-red-500",
    bgClass: "bg-red-950/20 hover:bg-red-950/40 border border-red-500/20 text-red-200",
    borderClass: "border-red-500/20",
    bgLightClass: "bg-red-500/10",
  },
  warning: {
    icon: FiAlertCircle,
    colorClass: "text-[#e23e2d]",
    bgClass: "bg-[#e23e2d] hover:bg-[#cf2e2e]",
    borderClass: "border-[#e23e2d]/20",
    bgLightClass: "bg-[#e23e2d]/10",
  },
  info: {
    icon: FiInfo,
    colorClass: "text-slate-200",
    bgClass: "bg-[#e23e2d] hover:bg-[#cf2e2e]",
    borderClass: "border-[#222225]",
    bgLightClass: "bg-[#0c0c0c]",
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 select-none">
      <div
        className="absolute inset-0 bg-[#0c0c0c]/80 backdrop-blur-md transition-opacity"
        onClick={onCancel}
      />
      
      <div className="relative bg-[#121214] border border-[#222225] p-10 max-w-sm w-full rounded-xl shadow-[0_32px_128px_rgba(0,0,0,0.8)] z-10 space-y-6">
        <button 
          onClick={onCancel}
          className="absolute top-6 right-6 text-slate-500 hover:text-slate-200 transition-colors cursor-pointer"
        >
          <FiX size={18} />
        </button>

        <div className="flex flex-col items-center text-center space-y-5">
          <div className={`w-12 h-12 ${config.bgLightClass} rounded-full flex items-center justify-center border ${config.borderClass}`}>
            <Icon className={`text-xl ${config.colorClass}`} />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-[Cormorant_Garamond] font-semibold italic text-white leading-tight">
              {title}
            </h3>
            <p className="text-slate-400 text-xs font-mono max-w-xs mx-auto leading-relaxed">
              {message}
            </p>
          </div>

          <div className="w-full space-y-2.5 pt-2">
            <button
              onClick={onConfirm}
              className={`w-full py-2.5 ${config.bgClass} text-white font-mono text-xs font-semibold uppercase tracking-wider rounded transition-colors cursor-pointer flex items-center justify-center`}
            >
              {confirmText}
            </button>
            {cancelText && onCancel && (
              <button
                onClick={onCancel}
                className="w-full py-2.5 bg-[#121214] border border-[#222225] hover:bg-[#1c1c1f] text-slate-400 hover:text-slate-200 font-mono text-xs font-semibold uppercase tracking-wider rounded transition-colors cursor-pointer flex items-center justify-center"
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
