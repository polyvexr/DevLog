import React, { useEffect } from "react";
import { FiAlertTriangle, FiX } from "react-icons/fi";

export default function Dialog({
  open,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
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
          <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-8 border border-red-500/20">
            <FiAlertTriangle className="text-3xl text-red-500" />
          </div>
          
          <h3 className="text-2xl font-black text-white italic mb-4 tracking-tight">{title}</h3>
          <p className="text-gray-400 text-sm font-medium leading-relaxed mb-10">
            {message}
          </p>

          <div className="w-full space-y-3">
             <button
              onClick={onConfirm}
              className="w-full py-4 bg-red-500 hover:bg-red-400 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-red-500/20 active:scale-95"
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
