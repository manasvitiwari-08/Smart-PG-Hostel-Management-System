import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiPlus, FiEdit2, FiTrash2, FiBell } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { fetchNotices, createNotice, updateNotice, deleteNotice } from '../../services/noticeService'
import PageHeader from '../../components/ui/PageHeader'
import Modal from '../../components/ui/Modal'
import ConfirmModal from '../../components/ui/ConfirmModal'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'

const emptyForm = { title: '', message: '', isImportant: false, expiresAt: '' }

export default function NoticesPage() {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetchNotices()
      setNotices(res.data.notices)
    } catch { toast.error('Failed to load notices') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const openAdd = () => { setSelected(null); setForm(emptyForm); setModalOpen(true) }
  const openEdit = (n) => {
    setSelected(n)
    setForm({ title: n.title, message: n.message, isImportant: n.isImportant, expiresAt: n.expiresAt?.slice(0, 10) || '' })
    setModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (selected) { await updateNotice(selected._id, form); toast.success('Notice updated') }
      else { await createNotice(form); toast.success('Notice posted') }
      setModalOpen(false)
      load()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteNotice(selected._id)
      toast.success('Notice deleted')
      setDeleteModal(false)
      load()
    } catch { toast.error('Failed to delete') }
    finally { setDeleting(false) }
  }

  const inp = 'w-full bg-slate-800/50 border border-slate-700 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm'

  return (
    <div>
      <PageHeader title="Notices & Announcements" subtitle="Post notices visible to all tenants"
        action={
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors">
            <FiPlus size={16} /> Post Notice
          </button>
        }
      />

      {loading ? <Spinner /> : notices.length === 0 ? <EmptyState title="No notices posted" subtitle="Post your first notice for tenants" /> : (
        <div className="space-y-4">
          {notices.map((n, i) => (
            <motion.div key={n._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className={`glass-dark rounded-2xl p-5 border transition-all ${n.isImportant ? 'border-amber-500/30 bg-amber-500/5' : 'border-slate-700/50'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`p-2 rounded-xl flex-shrink-0 ${n.isImportant ? 'bg-amber-500/15' : 'bg-indigo-500/15'}`}>
                    <FiBell size={16} className={n.isImportant ? 'text-amber-400' : 'text-indigo-400'} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-semibold">{n.title}</h3>
                      {n.isImportant && (
                        <span className="text-xs bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full">Important</span>
                      )}
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">{n.message}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                      <span>By: {n.createdBy?.name}</span>
                      <span>{new Date(n.createdAt).toLocaleDateString()}</span>
                      {n.expiresAt && <span>Expires: {new Date(n.expiresAt).toLocaleDateString()}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(n)} className="p-2 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"><FiEdit2 size={15} /></button>
                  <button onClick={() => { setSelected(n); setDeleteModal(true) }} className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"><FiTrash2 size={15} /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={selected ? 'Edit Notice' : 'Post Notice'} size="md">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Title</label>
            <input className={inp} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Message</label>
            <textarea className={inp} rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Expires At (optional)</label>
            <input type="date" className={inp} value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <div className={`w-10 h-5 rounded-full transition-colors ${form.isImportant ? 'bg-amber-500' : 'bg-slate-700'} relative`}
              onClick={() => setForm({ ...form, isImportant: !form.isImportant })}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${form.isImportant ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
            <span className="text-sm text-slate-300">Mark as Important</span>
          </label>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-700 text-sm transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium disabled:opacity-50">{saving ? 'Saving...' : selected ? 'Update' : 'Post'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmModal isOpen={deleteModal} onClose={() => setDeleteModal(false)} onConfirm={handleDelete} loading={deleting} message="Delete this notice?" />
    </div>
  )
}
