export default function StatCard({ label, value, icon = "⚡", gradient = "from-blue-500 to-purple-500" }) {
  const formatValue = (val) => {
    if (typeof val === "number") {
      return val.toLocaleString();
    }
    return String(val);
  };

  return (
    <div className="glass-card-hover p-5 rounded-xl neon-border fade-in-scale relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300" 
           style={{ backgroundImage: `linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2))` }} />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="stat-label">{label}</span>
          <span className="text-2xl opacity-40 group-hover:opacity-70 transition-opacity">{icon}</span>
        </div>
        <div className="stat-value text-3xl mt-1">{formatValue(value)}</div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r opacity-50 shimmer" 
           style={{ backgroundImage: `linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.6), transparent)` }} />
    </div>
  );
}
