import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { updateProfile, clearError } from '../../store/slices/authSlice'
import { fetchMyProfile } from '../../services/tenantService'
import { FiUser, FiPhone, FiMail, FiHome, FiCalendar, FiSave } from 'react-icons/fi'
import PageHeader from '../../components/ui/PageHeader'
import Badge from '../../components/ui/Badge'
import AvatarCropper from '../../components/ui/AvatarCropper'
import Spinner from '../../components/ui/Spinner'
import toast from 'react-hot-toast'

export default function TenantProfile() {
  const dispatch = useDispatch()
  const { user, loading: authLoading, error } = useSelector((s) => s.auth)
  const [tenant, setTenant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', phone: '', password: '', confirmPassword: '' })

  useEffect(() => {
    fetchMyProfile()
      .then((res) => setTenant(res.data.tenant))
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (user) setForm((f) => ({ ...f, name: user.name || '', phone: user.phone || '' }))
  }, [user])

  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearError()) }
  }, [error, dispatch])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password && form.password !== form.confirmPassword) return toast.error('Passwords do not match')
    const payload = { name: form.name, phone: form.phone }
    if (form.password) payload.password = form.password
    const res = await dispatch(updateProfile(payload))
    if (!res.error) toast.success('Profile updated')
  }

  const handleAvatarSave = async (base64) => {
    const res = await dispatch(updateProfile({ avatar: base64 }))
    if (!res.error) toast.success('Avatar updated!')
  }

  const inp = 'w-full bg-slate-800/50 border border-slate-700 rounded-xl px-3 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm'

  if (loading) return <Spinner />

  return (
    <div>
      <PageHeader title="My Profile" subtitle="View and update your personal information" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tenant Info Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass-dark rounded-2xl p-5 border border-slate-700/50">
          <div className="flex flex-col items-center text-center mb-5 pb-5 border-b border-slate-700/50">
            <AvatarCropper
              currentAvatar={user?.avatar}
              userName={user?.name}
              onSave={handleAvatarSave}
              saving={authLoading}
            />
            <p className="text-white font-semibold mt-2">{user?.name}</p>
            <p className="text-cyan-400 text-sm">Tenant</p>
          </div>
          {tenant && (
            <div className="space-y-3 text-sm">
              {[
                { icon: FiHome, label: 'Room', value: tenant.room?.roomNumber || 'Not assigned' },
                { icon: FiCalendar, label: 'Joined', value: tenant.joiningDate?.slice(0, 10) },
                { icon: FiMail, label: 'Email', value: user?.email },
                { icon: FiPhone, label: 'Phone', value: tenant.phone },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-slate-800"><Icon size={13} className="text-slate-400" /></div>
                  <div>
                    <p className="text-slate-500 text-xs">{label}</p>
                    <p className="text-white text-xs">{value}</p>
                  </div>
                </div>
              ))}
              <div className="pt-2">
                <p className="text-slate-500 text-xs mb-1">Payment Status</p>
                <Badge label={tenant.paymentStatus} />
              </div>
            </div>
          )}
        </motion.div>

        {/* Edit Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="lg:col-span-2 glass-dark rounded-2xl p-5 border border-slate-700/50">
          <h3 className="text-white font-semibold mb-5">Edit Account</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Full Name</label>
              <input className={inp} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Email (cannot change)</label>
              <input className={`${inp} opacity-50 cursor-not-allowed`} value={user?.email || ''} disabled />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Phone</label>
              <input className={inp} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="pt-3 border-t border-slate-700/50">
              <p className="text-slate-400 text-sm mb-3">Change Password</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">New Password</label>
                  <input type="password" className={inp} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Min 6 chars" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Confirm Password</label>
                  <input type="password" className={inp} value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
                </div>
              </div>
            </div>
            <button type="submit" disabled={authLoading}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700 text-white font-medium transition-all disabled:opacity-50">
              <FiSave size={16} />
              {authLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
