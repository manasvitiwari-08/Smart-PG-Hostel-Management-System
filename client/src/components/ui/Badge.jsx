export default function Badge({ label, color }) {
  const map = {
    paid: 'bg-green-500/15 text-green-400 border-green-500/30',
    unpaid: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    overdue: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    pending: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    in_progress: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    resolved: 'bg-green-500/15 text-green-400 border-green-500/30',
    rejected: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    available: 'bg-green-500/15 text-green-400 border-green-500/30',
    occupied: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    maintenance: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    low: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
    medium: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    high: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    admin: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
    tenant: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  }
  const cls = map[label?.toLowerCase()] || map[color] || 'bg-slate-500/15 text-slate-400 border-slate-500/30'
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cls}`}>
      {label}
    </span>
  )
}
