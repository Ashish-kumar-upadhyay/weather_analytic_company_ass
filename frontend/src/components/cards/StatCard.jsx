const StatCard = ({ icon, label, value, sub, className = '' }) => (
  <div className={`card flex items-center gap-4 ${className}`}>
    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg shrink-0">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-surface-400 text-xs uppercase tracking-wider">{label}</p>
      <p className="text-lg font-semibold font-display truncate">{value}</p>
      {sub && <p className="text-surface-500 text-xs">{sub}</p>}
    </div>
  </div>
);

export default StatCard;
