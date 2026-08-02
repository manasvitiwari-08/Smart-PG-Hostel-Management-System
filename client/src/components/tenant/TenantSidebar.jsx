import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { toggleSidebar } from '../../store/slices/uiSlice'
import { FiGrid, FiUser, FiCreditCard, FiAlertCircle, FiBell, FiUserCheck, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { MdOutlineApartment } from 'react-icons/md'

const navItems = [
  { to: '/tenant', icon: FiGrid, label: 'Dashboard', end: true },
  { to: '/tenant/profile', icon: FiUser, label: 'My Profile' },
  { to: '/tenant/payments', icon: FiCreditCard, label: 'Rent & Payments' },
  { to: '/tenant/complaints', icon: FiAlertCircle, label: 'Complaints' },
  { to: '/tenant/notices', icon: FiBell, label: 'Notices' },
  { to: '/tenant/visitors', icon: FiUserCheck, label: 'Visitors' },
]

export default function TenantSidebar() {
  const dispatch = useDispatch()
  const { sidebarOpen } = useSelector((s) => s.ui)

  return (
    <motion.aside
      animate={{ width: sidebarOpen ? 256 : 64 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-full glass-dark border-r border-slate-700/50 z-40 flex flex-col overflow-hidden"
    >
      <div className="flex items-center gap-3 p-4 border-b border-slate-700/50 min-h-[64px]">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
          <MdOutlineApartment size={20} className="text-white" />
        </div>
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="font-bold text-white text-sm">Smart PG</p>
              <p className="text-xs text-cyan-400">Tenant Portal</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
              }`
            }
          >
            <Icon size={18} className="flex-shrink-0" />
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm font-medium whitespace-nowrap">
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </nav>

      <button
        onClick={() => dispatch(toggleSidebar())}
        className="m-3 p-2 rounded-xl border border-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors flex items-center justify-center"
      >
        {sidebarOpen ? <FiChevronLeft size={16} /> : <FiChevronRight size={16} />}
      </button>
    </motion.aside>
  )
}
