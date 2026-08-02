import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { FiPlus, FiSearch, FiCheck, FiTrash2, FiDownload } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { fetchPayments, createPayment, markPaid, deletePayment } from '../../services/paymentService'
import { fetchTenants } from '../../services/tenantService'
import PageHeader from '../../components/ui/PageHeader'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import ConfirmModal from '../../components/ui/ConfirmModal'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'

const emptyForm = { tenantId: '', amount: '', month: '', dueDate: '', notes: '' }

export default function PaymentsPage() {
  const [payments, setPayments] = useState([])
  const [tenants, setTenants] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [markModal, setMarkModal] = useState(false)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [markForm, setMarkForm] = useState({ paymentMethod: 'cash', transactionId: '' })
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [pRes, tRes] = await Promise.all([
        fetchPayments({ status: statusFilter }),
        fetchTenants({ limit: 100 }),
      ])
      setPayments(pRes.data.payments)
      setTenants(tRes.data.tenants)
    } catch { toast.error('Failed to load payments') }
    finally { setLoading(false) }
  }, [statusFilter])

  useEffect(() => { load() }, [load])

  const handleCreate = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await createPayment(form)
      toast.success('Payment record created')
      setModalOpen(false)
      setForm(emptyForm)
      load()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to create') }
    finally { setSaving(false) }
  }

  const handleMarkPaid = async () => {
    setSaving(true)
    try {
      await markPaid(selected._id, markForm)
      toast.success('Marked as paid')
      setMarkModal(false)
      load()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to update') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deletePayment(selected._id)
      toast.success('Payment deleted')
      setDeleteModal(false)
      load()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to delete') }
    finally { setDeleting(false) }
  }

  const filtered = payments.filter((p) =>
    !search || p.tenant?.name?.toLowerCase().includes(search.toLowerCase())
  )

  const inp = 'w-full bg-slate-800/50 border border-slate-700 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm'

  return (
    <div>
      <PageHeader
        title="Payments"
        subtitle="Track and manage all tenant rent payments"
        action={
          <button onClick={() => { setForm(emptyForm); setModalOpen(true) }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors">
            <FiPlus size={16} /> Add Payment
          </button>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tenant..."
            className="bg-slate-800/50 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm w-52" />
        </div>
        <div className="flex gap-2">
          {['', 'paid', 'unpaid', 'overdue'].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors capitalize ${statusFilter === s ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      {loading ? <Spinner /> : filtered.length === 0 ? <EmptyState title="No payments found" /> : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="glass-dark rounded-2xl border border-slate-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/50">
                  {['Tenant', 'Room', 'Month', 'Amount', 'Due Date', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-slate-400 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <motion.tr key={p._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                    className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-white font-medium">{p.tenant?.name}</p>
                      <p className="text-slate-500 text-xs">{p.tenant?.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{p.tenant?.room?.roomNumber || '—'}</td>
                    <td className="px-4 py-3 text-slate-300">{p.month}</td>
                    <td className="px-4 py-3 text-green-400 font-medium">₹{p.amount?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-slate-300">{p.dueDate?.slice(0, 10)}</td>
                    <td className="px-4 py-3"><Badge label={p.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {p.status !== 'paid' && (
                          <button onClick={() => { setSelected(p); setMarkModal(true) }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-green-400 hover:bg-green-500/10 transition-colors" title="Mark Paid">
                            <FiCheck size={15} />
                          </button>
                        )}
                        <button onClick={() => { setSelected(p); setDeleteModal(true) }}
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

      {/* Create Payment Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create Payment Record" size="md">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Tenant</label>
            <select className={inp} value={form.tenantId} onChange={(e) => setForm({ ...form, tenantId: e.target.value })} required>
              <option value="">-- Select Tenant --</option>
              {tenants.map((t) => <option key={t._id} value={t._id}>{t.name} (Room {t.room?.roomNumber || 'N/A'})</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Month (e.g. January 2025)</label>
              <input className={inp} value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })} placeholder="January 2025" required />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Amount (₹)</label>
              <input type="number" className={inp} value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Due Date</label>
            <input type="date" className={inp} value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} required />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Notes</label>
            <input className={inp} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Optional notes" />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-700 text-sm transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium disabled:opacity-50">{saving ? 'Creating...' : 'Create'}</button>
          </div>
        </form>
      </Modal>

      {/* Mark Paid Modal */}
      <Modal isOpen={markModal} onClose={() => setMarkModal(false)} title="Mark as Paid" size="sm">
        <div className="space-y-4">
          <p className="text-slate-400 text-sm">Mark payment for <span className="text-white font-medium">{selected?.tenant?.name}</span> — {selected?.month}</p>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Payment Method</label>
            <select className={inp} value={markForm.paymentMethod} onChange={(e) => setMarkForm({ ...markForm, paymentMethod: e.target.value })}>
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="online">Online</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Transaction ID (optional)</label>
            <input className={inp} value={markForm.transactionId} onChange={(e) => setMarkForm({ ...markForm, transactionId: e.target.value })} placeholder="UTR / Ref number" />
          </div>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setMarkModal(false)} className="px-4 py-2 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-700 text-sm transition-colors">Cancel</button>
            <button onClick={handleMarkPaid} disabled={saving} className="px-6 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-medium disabled:opacity-50">{saving ? 'Saving...' : 'Mark Paid'}</button>
          </div>
        </div>
      </Modal>

      <ConfirmModal isOpen={deleteModal} onClose={() => setDeleteModal(false)} onConfirm={handleDelete} loading={deleting}
        message="Delete this payment record? This cannot be undone." />
    </div>
  )
}
