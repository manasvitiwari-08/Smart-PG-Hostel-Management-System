import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiUserCheck } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { fetchMyVisitors } from '../../services/visitorService'
import PageHeader from '../../components/ui/PageHeader'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'

export default function TenantVisitors() {
  const [visitors, setVisitors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMyVisitors()
      .then((res) => setVisitors(res.data.visitors))
      .catch(() => toast.error('Failed to load visitor records'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <PageHeader title="My Visitors" subtitle="View all visitor entries for your room" />

      {loading ? <Spinner /> : visitors.length === 0 ? (
        <EmptyState title="No visitor records" subtitle="Visitor entries will appear here once logged by admin" />
      ) : (
        <div className="space-y-3">
          {visitors.map((v, i) => (
            <motion.div key={v._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass-dark rounded-2xl p-5 border border-slate-700/50">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10">
                    <FiUserCheck size={18} className="text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">{v.visitorName}</p>
                    <p className="text-slate-400 text-sm">{v.phone}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{v.purpose}</p>
                  </div>
                </div>
                <div className="text-right text-xs text-slate-400">
                  <p>Entry: {new Date(v.entryTime).toLocaleString()}</p>
                  {v.exitTime
                    ? <p className="text-green-400 mt-1">Exit: {new Date(v.exitTime).toLocaleString()}</p>
                    : <span className="inline-block mt-1 text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">Still Inside</span>
                  }
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
