import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { FiPlus, FiEdit2, FiTrash2, FiHome } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { fetchRooms, createRoom, updateRoom, deleteRoom } from '../../services/roomService'
import PageHeader from '../../components/ui/PageHeader'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import ConfirmModal from '../../components/ui/ConfirmModal'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'

const emptyForm = { roomNumber: '', roomType: 'single', capacity: 1, rent: '', description: '', floor: 1, amenities: '' }

export default function RoomsPage() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [filter, setFilter] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetchRooms(filter ? { status: filter } : {})
      setRooms(res.data.rooms)
    } catch { toast.error('Failed to load rooms') }
    finally { setLoading(false) }
  }, [filter])

  useEffect(() => { load() }, [load])

  const openAdd = () => { setSelected(null); setForm(emptyForm); setModalOpen(true) }
  const openEdit = (r) => {
    setSelected(r)
    setForm({ roomNumber: r.roomNumber, roomType: r.roomType, capacity: r.capacity, rent: r.rent, description: r.description || '', floor: r.floor || 1, amenities: r.amenities?.join(', ') || '' })
    setModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = { ...form, amenities: form.amenities ? form.amenities.split(',').map((a) => a.trim()) : [] }
    try {
      if (selected) { await updateRoom(selected._id, payload); toast.success('Room updated') }
      else { await createRoom(payload); toast.success('Room added') }
      setModalOpen(false); load()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try { await deleteRoom(selected._id); toast.success('Room deleted'); setDeleteModal(false); load() }
    catch (err) { toast.error(err.response?.data?.message || 'Failed to delete') }
    finally { setDeleting(false) }
  }

  const inp = 'w-full bg-slate-800/50 border border-slate-700 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm'

  return (
    <div>
      <PageHeader title="Rooms" subtitle="Manage all rooms and their availability"
        action={<button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"><FiPlus size={16} /> Add Room</button>} />

      {/* Filter */}
      <div className="flex gap-2 mb-5">
        {['', 'available', 'occupied', 'maintenance'].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${filter === s ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
            {s || 'All'}
          </button>
        ))}
      </div>

      {loading ? <Spinner /> : rooms.length === 0 ? <EmptyState title="No rooms found" subtitle="Add your first room to get started" /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {rooms.map((r, i) => (
            <motion.div key={r._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass-dark rounded-2xl p-5 border border-slate-700/50 card-hover">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 rounded-xl bg-indigo-500/10"><FiHome size={18} className="text-indigo-400" /></div>
                <Badge label={r.status} />
              </div>
              <h3 className="text-white font-bold text-lg">Room {r.roomNumber}</h3>
              <p className="text-slate-400 text-xs capitalize mb-3">{r.roomType} • Floor {r.floor}</p>
              <div className="space-y-1.5 text-xs text-slate-400 mb-4">
                <div className="flex justify-between"><span>Capacity</span><span className="text-white">{r.occupiedBeds}/{r.capacity} beds</span></div>
                <div className="flex justify-between"><span>Rent</span><span className="text-green-400 font-medium">₹{r.rent?.toLocaleString()}/mo</span></div>
              </div>
              {/* Occupancy bar */}
              <div className="w-full bg-slate-700 rounded-full h-1.5 mb-4">
                <div className="bg-indigo-500 h-1.5 rounded-full transition-all" style={{ width: `${(r.occupiedBeds / r.capacity) * 100}%` }} />
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(r)} className="flex-1 py-1.5 rounded-lg border border-slate-600 text-slate-400 hover:text-indigo-400 hover:border-indigo-500/50 text-xs transition-colors flex items-center justify-center gap-1"><FiEdit2 size={12} /> Edit</button>
                <button onClick={() => { setSelected(r); setDeleteModal(true) }} className="flex-1 py-1.5 rounded-lg border border-slate-600 text-slate-400 hover:text-rose-400 hover:border-rose-500/50 text-xs transition-colors flex items-center justify-center gap-1"><FiTrash2 size={12} /> Delete</button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={selected ? 'Edit Room' : 'Add Room'} size="md">
        <form onSubmit={handleSave} className="grid grid-cols-2 gap-4">
          <div><label className="text-xs text-slate-400 mb-1 block">Room Number</label><input className={inp} value={form.roomNumber} onChange={(e) => setForm({ ...form, roomNumber: e.target.value })} required /></div>
          <div><label className="text-xs text-slate-400 mb-1 block">Room Type</label>
            <select className={inp} value={form.roomType} onChange={(e) => setForm({ ...form, roomType: e.target.value })}>
              <option value="single">Single</option><option value="double">Double</option><option value="triple">Triple</option>
            </select>
          </div>
          <div><label className="text-xs text-slate-400 mb-1 block">Capacity (beds)</label><input type="number" min={1} className={inp} value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} required /></div>
          <div><label className="text-xs text-slate-400 mb-1 block">Monthly Rent (₹)</label><input type="number" className={inp} value={form.rent} onChange={(e) => setForm({ ...form, rent: e.target.value })} required /></div>
          <div><label className="text-xs text-slate-400 mb-1 block">Floor</label><input type="number" min={1} className={inp} value={form.floor} onChange={(e) => setForm({ ...form, floor: e.target.value })} /></div>
          <div><label className="text-xs text-slate-400 mb-1 block">Amenities (comma separated)</label><input className={inp} value={form.amenities} onChange={(e) => setForm({ ...form, amenities: e.target.value })} placeholder="WiFi, AC, Geyser" /></div>
          <div className="col-span-2"><label className="text-xs text-slate-400 mb-1 block">Description</label><textarea className={inp} rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div className="col-span-2 flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-700 text-sm transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors disabled:opacity-50">{saving ? 'Saving...' : selected ? 'Update' : 'Add Room'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmModal isOpen={deleteModal} onClose={() => setDeleteModal(false)} onConfirm={handleDelete} loading={deleting} message={`Delete Room ${selected?.roomNumber}? This cannot be undone.`} />
    </div>
  )
}
