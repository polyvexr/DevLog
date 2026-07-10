import React from "react";

export default function Visibility({
  platformMeta,
  formData,
  handlePublicVisibilityToggle
}) {
  return (
    <section className="bg-[#121214] border border-[#222225] p-6 rounded-xl space-y-6">
      <h3 className="text-[9px] font-mono font-semibold uppercase tracking-wider text-slate-500">Public Visibility</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {platformMeta.map(p => {
          const Icon = p.icon;
          const isVisible = formData.publicProfile[p.toggle];
          return (
            <button
              type="button"
              key={p.id}
              onClick={() => handlePublicVisibilityToggle(p.toggle)}
              className={`p-4 rounded border flex flex-col items-center gap-3 transition-colors cursor-pointer ${
                isVisible
                  ? "bg-[#0c0c0c] border-[#e23e2d] text-white"
                  : "bg-[#0c0c0c] border-[#222225] text-slate-500 opacity-45 grayscale"
              }`}
            >
              {p.id === "atcoder" ? <Icon /> : <Icon className="text-xl" />}
              <div className="text-[9px] font-mono uppercase tracking-wider text-slate-200">{p.label}</div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
