import { FiZap } from "react-icons/fi";

export default function StatCard(props) {
  const { label, value, icon: StatIcon = FiZap, color = "blue" } = props;
  const colorMap = {
    blue: "from-blue-500 to-indigo-600",
    purple: "from-purple-500 to-violet-600",
    green: "from-emerald-500 to-teal-600",
    orange: "from-orange-500 to-amber-600",
    pink: "from-pink-500 to-rose-600",
    cyan: "from-cyan-500 to-blue-600",
  };
  const gradient = colorMap[color] || colorMap.blue;

  return (
    <div className="glass-card-premium p-8 group hover:-translate-y-2 relative overflow-hidden transition-all duration-300">
      <div className={`absolute -bottom-10 -right-10 w-24 h-24 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500`}></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg shadow-blue-500/10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
             <StatIcon size={20} className="text-white" />
          </div>
          <FiZap size={14} className="text-slate-300 group-hover:text-blue-500/50 transition-colors animate-pulse" />
        </div>
        <div className="space-y-1">
          <div className="text-3xl font-black text-slate-900 italic group-hover:scale-105 transition-transform origin-left">
             {typeof value === "number" ? value.toLocaleString() : value}
          </div>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-slate-500 transition-colors">
            {label}
          </div>
        </div>
      </div>
    </div>
  );
}
