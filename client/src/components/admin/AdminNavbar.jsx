import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logoutUser } from '../../store/slices/authSlice'
import { FiMenu, FiLogOut, FiUser } from 'react-icons/fi'
import { toggleSidebar } from '../../store/slices/uiSlice'
import toast from 'react-hot-toast'

export default function AdminNavbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((s) => s.auth)

  const handleLogout = async () => {
    await dispatch(logoutUser())
    toast.success('Logged out successfully')
    navigate('/login')
  }

  return (
    <header className="h-16 glass-dark border-b border-slate-700/50 flex items-center justify-between px-6 flex-shrink-0">
      <button
        onClick={() => dispatch(toggleSidebar())}
        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
      >
        <FiMenu size={20} />
      </button>

      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-white">{user?.name}</p>
          <p className="text-xs text-indigo-400 capitalize">{user?.role}</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center overflow-hidden">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            <FiUser size={16} className="text-white" />
          )}
        </div>
        <button
          onClick={handleLogout}
          className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          title="Logout"
        >
          <FiLogOut size={18} />
        </button>
      </div>
    </header>
  )
}
