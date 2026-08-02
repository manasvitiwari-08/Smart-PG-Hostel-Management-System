import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { updateProfile, clearError } from '../../store/slices/authSlice'
import { FiUser, FiMail, FiPhone, FiLock, FiSave } from 'react-icons/fi'
import PageHeader from '../../components/ui/PageHeader'
import AvatarCropper from '../../components/ui/AvatarCropper'
import toast from 'react-hot-toast'

export default function AdminProfile() {
  const dispatch = useDispatch()
  const { user, loading, error } = useSelector((s) => s.auth)
  const [form, setForm] = useState({ name: '', phone: '', password: '', confirmPassword: '' })

  useEffect(() => {
    if (user) setForm((f) => ({ ...f, name: user.name || '', phone: user.phone || '' }))
  }, [user])

  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearError()) }
  }, [error, dispatch])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password && form.password !== form.confirmPassword) {
      return toast.error('Passwords do not match')
    }
    const payload = { name: form.name, phone: form.phone }
    if (form.password) payload.password = form.password
    const res = await dispatch(updateProfile(payload))
    if (!res.error) toast.success('Profile updated successfully')
  }

  const handleAvatarSave = async (base64) => {
    const res = await dispatch(updateProfile({ avatar: base64 }))
    if (!res.error) toast.success('Avatar updated!')
  }

  const inp = 'w-full bg-slate-800/50 border border-slate-700 rounded-xl px-3 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm'

  return (
    <div>
      <PageHeader title="Profile Settings" subtitle="Update your account information" />
      <div className="max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass-dark rounded-2xl border border-slate-700/50 p-6">
          {/* Avatar */}
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-700/50">
            <AvatarCropper
              currentAvatar={user?.avatar}
              userName={user?.name}
              onSave={handleAvatarSave}
              saving={loading}
            />
            <div>
              <p className="text-white font-semibold text-lg">{user?.name}</p>
              <p className="text-indigo-400 text-sm capitalize">{user?.role}</p>
              <p className="text-slate-500 text-xs">{user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm text-slate-400 mb-1.5 block flex items-center gap-2"><FiUser size={14} /> Full Name</label>
              <input className={inp} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1.5 block flex items-center gap-2"><FiMail size={14} /> Email</label>
              <input className={inp} value={user?.email || ''} disabled className={`${inp} opacity-50 cursor-not-allowed`} />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1.5 block flex items-center gap-2"><FiPhone size={14} /> Phone</label>
              <input className={inp} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>

            <div className="pt-4 border-t border-slate-700/50">
              <p className="text-slate-400 text-sm mb-4">Change Password (leave blank to keep current)</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">New Password</label>
                  <input type="password" className={inp} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Min 6 characters" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Confirm Password</label>
                  <input type="password" className={inp} value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} placeholder="Repeat password" />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium transition-all disabled:opacity-50">
              <FiSave size={16} />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
