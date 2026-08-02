import { motion } from 'framer-motion'
import { FiInbox } from 'react-icons/fi'

export default function EmptyState({ title = 'No data found', subtitle = '', action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="p-4 rounded-full bg-slate-800 mb-4">
        <FiInbox size={32} className="text-slate-500" />
      </div>
      <h3 className="text-slate-300 font-medium text-lg">{title}</h3>
      {subtitle && <p className="text-slate-500 text-sm mt-1">{subtitle}</p>}
      {action && <div className="mt-4">{action}</div>}
    </motion.div>
  )
}
