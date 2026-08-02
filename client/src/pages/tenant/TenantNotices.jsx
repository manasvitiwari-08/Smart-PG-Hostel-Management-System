import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiBell } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { fetchNotices } from '../../services/noticeService'
import PageHeader from '../../components/ui/PageHeader'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'

export default function TenantNotices() {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotices()
      .then((res) => setNotices(res.data.notices))
      .catch(() => toast.error('Failed to load notices'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <PageHeader title="Notices & Announcements" subtitle="Stay updated with the latest notices from management" />

      {loading ? <Spinner /> : notices.length === 0 ? (
        <EmptyState title="No notices" subtitle="No announcements at the moment" />
      ) : (
        <div className="space-y-4">
          {notices.map((n, i) => (
            <motion.div key={n._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className={`glass-dark rounded-2xl p-5 border ${n.isImportant ? 'border-amber-500/30 bg-amber-500/5' : 'border-slate-700/50'}`}>
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl flex-shrink-0 mt-0.5 ${n.isImportant ? 'bg-amber-500/15' : 'bg-indigo-500/15'}`}>
                  <FiBell size={16} className={n.isImportant ? 'text-amber-400' : 'text-indigo-400'} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-white font-semibold">{n.title}</h3>
                    {n.isImportant && (
                      <span className="text-xs bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full">Important</span>
                    )}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">{n.message}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                    <span>Posted by: {n.createdBy?.name}</span>
                    <span>{new Date(n.createdAt).toLocaleDateString()}</span>
                    {n.expiresAt && <span className="text-amber-500">Expires: {new Date(n.expiresAt).toLocaleDateString()}</span>}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
