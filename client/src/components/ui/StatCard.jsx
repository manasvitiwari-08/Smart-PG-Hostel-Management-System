import { motion } from 'framer-motion'

export default function StatCard({ title, value, icon: Icon, color, subtitle, delay = 0 }) {
  const colorMap = {
    indigo: 'from-indigo-500/20 to-indigo-600/10 border-indigo-500/20 text-indigo-400',
    purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/20 text-purple-400',
    cyan: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/20 text-cyan-400',
    green: 'from-green-500/20 to-green-600/10 border-green-500/20 text-green-400',
    rose: 'from-rose-500/20 to-rose-600/10 border-rose-500/20 text-rose-400',
    amber: 'from-amber-500/20 to-amber-600/10 border-amber-500/20 text-amber-400',
  }
  const cls = colorMap[color] || colorMap.indigo

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`glass-dark rounded-2xl p-5 bg-gradient-to-br ${cls} border card-hover`}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-slate-400 text-sm font-medium">{title}</p>
        <div className={`p-2 rounded-xl bg-gradient-to-br ${cls}`}>
          <Icon size={20} />
        </div>
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
      {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
    </motion.div>
  )
}
