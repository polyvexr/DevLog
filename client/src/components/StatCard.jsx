import { FiZap } from "react-icons/fi";

export default function StatCard({
  label,
  value,
  icon: Icon = FiZap,
  gradient = "from-blue-500 to-purple-500",
}) {
  const formatValue = (val) => {
    if (typeof val === "number") {
      return val.toLocaleString();
    }
    return String(val);
  };

  return (
    <div className="platform-card p-5 rounded-xl fade-in-scale relative overflow-hidden group">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
      />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[var(--text-secondary)] text-sm">{label}</span>
          {typeof Icon === "function" ? (
            <Icon className="text-2xl opacity-40 group-hover:opacity-70 transition-opacity text-[var(--text-secondary)]" />
          ) : (
            <span className="text-2xl opacity-40 group-hover:opacity-70 transition-opacity">
              {Icon}
            </span>
          )}
        </div>
        <div className="text-3xl font-bold text-[var(--accent-blue)] mt-1">
          {formatValue(value)}
        </div>
      </div>
    </div>
  );
}
