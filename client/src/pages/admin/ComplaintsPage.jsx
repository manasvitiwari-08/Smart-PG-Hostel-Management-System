import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { FiSearch, FiEdit2, FiTrash2 } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { fetchComplaints, updateComplaint, deleteComplaint } from '../../services/complaintService'
import PageHeader from '../../components/ui/PageHeader'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import ConfirmModal from '../../components/ui/ConfirmModal'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [editModal, setEditModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [selected, setSelected] = useState(null)
  const [editForm, setEditForm] = useState({ status: '', priority: '', adminRemark: '' })
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetchComplaints({ status: statusFilter, priority: priorityFilter })
      setComplaints(res.data.complaints)
    } catch { toast.error('Failed to load complaints') }
    finally { setLoading(false) }
  }, [statusFilter, priorityFilter])

  useEffect(() => { load() }, [load])

  const openEdit = (c) => {
    setSelected(c)
    setEditForm({ status: c.status, priority: c.priority, adminRemark: c.adminRemark || '' })
    setEditModal(true)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateComplaint(selected._id, editForm)
      toast.success('Complaint updated')
      setEditModal(false)
      load()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to update') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteComplaint(selected._id)
      toast.success('Complaint deleted')
      setDeleteModal(false)
      load()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to delete') }
    finally { setDeleting(false) }
  }

  const priorityColor = { low: 'text-slate-400', medium: 'text-amber-400', high: 'text-rose-400' }
  const inp = 'w-full bg-slate-800/50 border border-slate-700 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm'

  return (
    <div>
      <PageHeader title="Complaints" subtitle="Review and resolve tenant complaints" />

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="flex gap-2">
          {['', 'pending', 'in_progress', 'resolved', 'rejected'].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${statusFilter === s ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
              {s.replace('_', ' ') || 'All'}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {['', 'low', 'medium', 'high'].map((p) => (
            <button key={p} onClick={() => setPriorityFilter(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${priorityFilter === p ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
              {p || 'All Priority'}
            </button>
          ))}
        </div>
      </div>

      {loading ? <Spinner /> : complaints.length === 0 ? <EmptyState title="No complaints found" subtitle="All clear! No complaints at the moment." /> : (
        <div className="space-y-3">
          {complaints.map((c, i) => (
            <motion.div key={c._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass-dark rounded-2xl p-5 border border-slate-700/50 hover:border-indigo-500/20 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-white font-semibold">{c.title}</h3>
                    <Badge label={c.status} />
                    <Badge label={c.priority} />
                    <span className="text-xs text-slate-500 capitalize bg-slate-800 px-2 py-0.5 rounded-full">{c.category}</span>
                  </div>
                  <p className="text-slate-400 text-sm mb-2 line-clamp-2">{c.description}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>By: <span className="text-slate-300">{c.tenant?.name}</span></span>
                    <span>Room: <span className="text-slate-300">{c.tenant?.room?.roomNumber || '—'}</span></span>
                    <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                  {c.adminRemark && (
                    <div className="mt-2 p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                      <p className="text-xs text-indigo-300">Admin: {c.adminRemark}</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(c)} className="p-2 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"><FiEdit2 size={15} /></button>
                  <button onClick={() => { setSelected(c); setDeleteModal(true) }} className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"><FiTrash2 size={15} /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <Modal isOpen={editModal} onClose={() => setEditModal(false)} title="Update Complaint" size="md">
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <p className="text-white font-medium text-sm">{selected?.title}</p>
            <p className="text-slate-400 text-xs mt-1">{selected?.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Status</label>
              <select className={inp} value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Priority</label>
              <select className={inp} value={editForm.priority} onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Admin Remark</label>
            <textarea className={inp} rows={3} value={editForm.adminRemark} onChange={(e) => setEditForm({ ...editForm, adminRemark: e.target.value })} placeholder="Add your response or remarks..." />
          </div>
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => setEditModal(false)} className="px-4 py-2 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-700 text-sm transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium disabled:opacity-50">{saving ? 'Saving...' : 'Update'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmModal isOpen={deleteModal} onClose={() => setDeleteModal(false)} onConfirm={handleDelete} loading={deleting} message="Delete this complaint permanently?" />
    </div>
  )
}
