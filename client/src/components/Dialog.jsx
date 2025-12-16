import React from "react";

export default function Dialog({
  open,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-gradient-to-br from-slate-900/95 to-slate-800/95 border border-blue-500/20 rounded-2xl shadow-xl w-full max-w-md p-6 neon-border">
        <h3 className="text-xl font-bold neon-text mb-2">{title}</h3>
        <div className="text-sm text-gray-300 mb-6 whitespace-pre-wrap">
          {message}
        </div>

        <div className="flex justify-end gap-3">
          {cancelText ? (
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-md bg-white/5 text-gray-300 hover:bg-white/6"
            >
              {cancelText}
            </button>
          ) : null}
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold hover:shadow-lg"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
