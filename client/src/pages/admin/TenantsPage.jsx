import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { fetchTenants, createTenant, updateTenant, deleteTenant } from '../../services/tenantService'
import { fetchRooms } from '../../services/roomService'
import PageHeader from '../../components/ui/PageHeader'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import ConfirmModal from '../../components/ui/ConfirmModal'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'

const emptyForm = { name: '', phone: '', email: '', gender: 'male', college: '', profession: '', idProofType: 'Aadhar', idProofNumber: '', roomId: '', joiningDate: '', rentAmount: '', emergencyContact: '', address: '', password: '' }

export default function TenantsPage() {
  const [tenants, setTenants] = useState([])
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [viewModal, setViewModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [tRes, rRes] = await Promise.all([fetchTenants({ search }), fetchRooms()])
      setTenants(tRes.data.tenants)
      setRooms(rRes.data.rooms)
    } catch { toast.error('Failed to load tenants') }
    finally { setLoading(false) }
  }, [search])

  useEffect(() => { load() }, [load])

  const openAdd = () => { setSelected(null); setForm(emptyForm); setModalOpen(true) }
  const openEdit = (t) => {
    setSelected(t)
    setForm({ name: t.name, phone: t.phone, email: t.email, gender: t.gender, college: t.college || '', profession: t.profession || '', idProofType: t.idProofType || 'Aadhar', idProofNumber: t.idProofNumber || '', roomId: t.room?._id || '', joiningDate: t.joiningDate?.slice(0, 10) || '', rentAmount: t.rentAmount, emergencyContact: t.emergencyContact || '', address: t.address || '', password: '' })
    setModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (selected) {
        await updateTenant(selected._id, form)
        toast.success('Tenant updated')
      } else {
        await createTenant(form)
        toast.success('Tenant added')
      }
      setModalOpen(false)
      load()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteTenant(selected._id)
      toast.success('Tenant removed')
      setDeleteModal(false)
      load()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to delete') }
    finally { setDeleting(false) }
  }

  const inp = 'w-full bg-slate-800/50 border border-slate-700 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm'

  return (
    <div>
      <PageHeader title="Tenants" subtitle="Manage all tenants and their room assignments"
        action={<button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"><FiPlus size={16} /> Add Tenant</button>} />

      {/* Search */}
      <div className="relative mb-5 max-w-sm">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tenants..." className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm" />
      </div>

      {loading ? <Spinner /> : tenants.length === 0 ? <EmptyState title="No tenants found" subtitle="Add your first tenant to get started" /> : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-dark rounded-2xl border border-slate-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/50">
                  {['Name', 'Room', 'Phone', 'Rent', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-slate-400 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tenants.map((t, i) => (
                  <motion.tr key={t._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                    className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-white font-medium">{t.name}</p>
                        <p className="text-slate-500 text-xs">{t.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{t.room?.roomNumber || '—'}</td>
                    <td className="px-4 py-3 text-slate-300">{t.phone}</td>
                    <td className="px-4 py-3 text-slate-300">₹{t.rentAmount?.toLocaleString()}</td>
                    <td className="px-4 py-3"><Badge label={t.paymentStatus} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setSelected(t); setViewModal(true) }} className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"><FiEye size={15} /></button>
                        <button onClick={() => openEdit(t)} className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"><FiEdit2 size={15} /></button>
                        <button onClick={() => { setSelected(t); setDeleteModal(true) }} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"><FiTrash2 size={15} /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={selected ? 'Edit Tenant' : 'Add Tenant'} size="lg">
        <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="text-xs text-slate-400 mb-1 block">Full Name</label><input className={inp} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
          <div><label className="text-xs text-slate-400 mb-1 block">Phone</label><input className={inp} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required /></div>
          <div><label className="text-xs text-slate-400 mb-1 block">Email</label><input type="email" className={inp} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
          <div><label className="text-xs text-slate-400 mb-1 block">Gender</label>
            <select className={inp} value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
              <option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
            </select>
          </div>
          <div><label className="text-xs text-slate-400 mb-1 block">College / Profession</label><input className={inp} value={form.college} onChange={(e) => setForm({ ...form, college: e.target.value })} /></div>
          <div><label className="text-xs text-slate-400 mb-1 block">Assign Room</label>
            <select className={inp} value={form.roomId} onChange={(e) => setForm({ ...form, roomId: e.target.value })}>
              <option value="">-- Select Room --</option>
              {rooms.filter((r) => r.status !== 'occupied' || r._id === selected?.room?._id).map((r) => (
                <option key={r._id} value={r._id}>Room {r.roomNumber} ({r.roomType}) - ₹{r.rent}</option>
              ))}
            </select>
          </div>
          <div><label className="text-xs text-slate-400 mb-1 block">Joining Date</label><input type="date" className={inp} value={form.joiningDate} onChange={(e) => setForm({ ...form, joiningDate: e.target.value })} /></div>
          <div><label className="text-xs text-slate-400 mb-1 block">Rent Amount (₹)</label><input type="number" className={inp} value={form.rentAmount} onChange={(e) => setForm({ ...form, rentAmount: e.target.value })} required /></div>
          <div><label className="text-xs text-slate-400 mb-1 block">ID Proof Type</label>
            <select className={inp} value={form.idProofType} onChange={(e) => setForm({ ...form, idProofType: e.target.value })}>
              {['Aadhar', 'PAN', 'Passport', 'Driving License', 'Voter ID'].map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div><label className="text-xs text-slate-400 mb-1 block">ID Proof Number</label><input className={inp} value={form.idProofNumber} onChange={(e) => setForm({ ...form, idProofNumber: e.target.value })} /></div>
          <div><label className="text-xs text-slate-400 mb-1 block">Emergency Contact</label><input className={inp} value={form.emergencyContact} onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })} /></div>
          {!selected && <div><label className="text-xs text-slate-400 mb-1 block">Login Password</label><input type="password" className={inp} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Default: tenant123" /></div>}
          <div className="sm:col-span-2"><label className="text-xs text-slate-400 mb-1 block">Address</label><textarea className={inp} rows={2} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
          <div className="sm:col-span-2 flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-700 text-sm transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors disabled:opacity-50">{saving ? 'Saving...' : selected ? 'Update' : 'Add Tenant'}</button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={viewModal} onClose={() => setViewModal(false)} title="Tenant Details" size="md">
        {selected && (
          <div className="space-y-3 text-sm">
            {[
              ['Name', selected.name], ['Email', selected.email], ['Phone', selected.phone],
              ['Gender', selected.gender], ['College', selected.college || '—'],
              ['Room', selected.room?.roomNumber || '—'], ['Rent', `₹${selected.rentAmount?.toLocaleString()}`],
              ['Payment Status', selected.paymentStatus], ['Joining Date', selected.joiningDate?.slice(0, 10)],
              ['ID Proof', `${selected.idProofType}: ${selected.idProofNumber || '—'}`],
              ['Emergency Contact', selected.emergencyContact || '—'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">{k}</span>
                <span className="text-white font-medium capitalize">{v}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>

      <ConfirmModal isOpen={deleteModal} onClose={() => setDeleteModal(false)} onConfirm={handleDelete} loading={deleting}
        message={`Remove ${selected?.name} from the system? This cannot be undone.`} />
    </div>
  )
}
