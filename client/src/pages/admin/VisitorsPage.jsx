import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { FiPlus, FiSearch, FiLogOut, FiTrash2 } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { fetchVisitors, addVisitor, markExit, deleteVisitor } from '../../services/visitorService'
import { fetchTenants } from '../../services/tenantService'
import PageHeader from '../../components/ui/PageHeader'
import Modal from '../../components/ui/Modal'
import ConfirmModal from '../../components/ui/ConfirmModal'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'

const emptyForm = { visitorName: '', phone: '', tenantId: '', purpose: 'Personal Visit', idProof: '' }

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState([])
  const [tenants, setTenants] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [vRes, tRes] = await Promise.all([fetchVisitors({ search }), fetchTenants({ limit: 100 })])
      setVisitors(vRes.data.visitors)
      setTenants(tRes.data.tenants)
    } catch { toast.error('Failed to load visitors') }
    finally { setLoading(false) }
  }, [search])

  useEffect(() => { load() }, [load])

  const handleAdd = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await addVisitor(form)
      toast.success('Visitor entry added')
      setModalOpen(false)
      setForm(emptyForm)
      load()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to add') }
    finally { setSaving(false) }
  }

  const handleExit = async (id) => {
    try {
      await markExit(id)
      toast.success('Exit time recorded')
      load()
    } catch { toast.error('Failed to update') }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteVisitor(selected._id)
      toast.success('Visitor record deleted')
      setDeleteModal(false)
      load()
    } catch { toast.error('Failed to delete') }
    finally { setDeleting(false) }
  }

  const inp = 'w-full bg-slate-800/50 border border-slate-700 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm'

  return (
    <div>
      <PageHeader title="Visitor Log" subtitle="Track all visitor entries and exits"
        action={
          <button onClick={() => { setForm(emptyForm); setModalOpen(true) }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors">
            <FiPlus size={16} /> Add Visitor
          </button>
        }
      />

      <div className="relative mb-5 max-w-sm">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search visitors..."
          className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm" />
      </div>

      {loading ? <Spinner /> : visitors.length === 0 ? <EmptyState title="No visitor records" subtitle="Add a visitor entry to get started" /> : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="glass-dark rounded-2xl border border-slate-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/50">
                  {['Visitor', 'Phone', 'Visiting', 'Purpose', 'Entry', 'Exit', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-slate-400 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visitors.map((v, i) => (
                  <motion.tr key={v._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                    className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 text-white font-medium">{v.visitorName}</td>
                    <td className="px-4 py-3 text-slate-300">{v.phone}</td>
                    <td className="px-4 py-3">
                      <p className="text-slate-300">{v.tenant?.name}</p>
                      <p className="text-slate-500 text-xs">Room {v.tenant?.room?.roomNumber || '—'}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{v.purpose}</td>
                    <td className="px-4 py-3 text-slate-300 text-xs">{new Date(v.entryTime).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      {v.exitTime
                        ? <span className="text-xs text-slate-300">{new Date(v.exitTime).toLocaleString()}</span>
                        : <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">Inside</span>
                      }
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {!v.exitTime && (
                          <button onClick={() => handleExit(v._id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors" title="Mark Exit">
                            <FiLogOut size={15} />
                          </button>
                        )}
                        <button onClick={() => { setSelected(v); setDeleteModal(true) }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors">
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Visitor Entry" size="md">
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Visitor Name</label>
              <input className={inp} value={form.visitorName} onChange={(e) => setForm({ ...form, visitorName: e.target.value })} required />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Phone</label>
              <input className={inp} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Visiting Tenant</label>
            <select className={inp} value={form.tenantId} onChange={(e) => setForm({ ...form, tenantId: e.target.value })} required>
              <option value="">-- Select Tenant --</option>
              {tenants.map((t) => <option key={t._id} value={t._id}>{t.name} (Room {t.room?.roomNumber || 'N/A'})</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Purpose</label>
            <input className={inp} value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">ID Proof (optional)</label>
            <input className={inp} value={form.idProof} onChange={(e) => setForm({ ...form, idProof: e.target.value })} placeholder="Aadhar / DL number" />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-700 text-sm transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium disabled:opacity-50">{saving ? 'Adding...' : 'Add Entry'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmModal isOpen={deleteModal} onClose={() => setDeleteModal(false)} onConfirm={handleDelete} loading={deleting} message="Delete this visitor record?" />
    </div>
  )
}
