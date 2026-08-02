import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiPlus, FiAlertCircle } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { fetchMyComplaints, createComplaint } from '../../services/complaintService'
import PageHeader from '../../components/ui/PageHeader'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'

const emptyForm = { title: '', description: '', category: 'other', priority: 'medium' }

export default function TenantComplaints() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetchMyComplaints()
      setComplaints(res.data.complaints)
    } catch { toast.error('Failed to load complaints') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await createComplaint(form)
      toast.success('Complaint submitted successfully')
      setModalOpen(false)
      setForm(emptyForm)
      load()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to submit') }
    finally { setSaving(false) }
  }

  const statusColor = { pending: 'border-amber-500/30', in_progress: 'border-blue-500/30', resolved: 'border-green-500/30', rejected: 'border-rose-500/30' }
  const inp = 'w-full bg-slate-800/50 border border-slate-700 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm'

  return (
    <div>
      <PageHeader title="My Complaints" subtitle="Submit and track your complaints"
        action={
          <button onClick={() => { setForm(emptyForm); setModalOpen(true) }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium transition-colors">
            <FiPlus size={16} /> New Complaint
          </button>
        }
      />

      {loading ? <Spinner /> : complaints.length === 0 ? (
        <EmptyState title="No complaints" subtitle="Submit a complaint if you face any issues"
          action={
            <button onClick={() => setModalOpen(true)} className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium transition-colors">
              Submit Complaint
            </button>
          }
        />
      ) : (
        <div className="space-y-4">
          {complaints.map((c, i) => (
            <motion.div key={c._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className={`glass-dark rounded-2xl p-5 border ${statusColor[c.status] || 'border-slate-700/50'}`}>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-white font-semibold">{c.title}</h3>
                  <Badge label={c.status} />
                  <Badge label={c.priority} />
                </div>
                <span className="text-xs text-slate-500 flex-shrink-0">{new Date(c.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-slate-400 text-sm mb-3">{c.description}</p>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="capitalize bg-slate-800 px-2 py-0.5 rounded-full">{c.category}</span>
                {c.resolvedAt && <span>Resolved: {new Date(c.resolvedAt).toLocaleDateString()}</span>}
              </div>
              {c.adminRemark && (
                <div className="mt-3 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                  <p className="text-xs text-slate-400 mb-1">Admin Response:</p>
                  <p className="text-sm text-indigo-300">{c.adminRemark}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Submit Complaint" size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Title</label>
            <input className={inp} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Brief title of the issue" required />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Description</label>
            <textarea className={inp} rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the issue in detail..." required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Category</label>
              <select className={inp} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {['maintenance', 'cleanliness', 'noise', 'security', 'food', 'other'].map((c) => (
                  <option key={c} value={c} className="capitalize">{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Priority</label>
              <select className={inp} value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-700 text-sm transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="px-6 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium disabled:opacity-50">{saving ? 'Submitting...' : 'Submit'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
