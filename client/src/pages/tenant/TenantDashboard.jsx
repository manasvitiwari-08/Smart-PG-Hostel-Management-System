import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiHome, FiCreditCard, FiAlertCircle, FiCalendar } from 'react-icons/fi'
import { fetchTenantStats } from '../../services/dashboardService'
import StatCard from '../../components/ui/StatCard'
import Badge from '../../components/ui/Badge'
import Spinner from '../../components/ui/Spinner'
import toast from 'react-hot-toast'

export default function TenantDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTenantStats()
      .then((res) => setData(res.data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner size="lg" />

  const { tenant, recentPayments, pendingPayment, activeComplaints } = data || {}

  return (
    <div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">My Dashboard</h1>
          <p className="text-slate-400 text-sm mt-0.5">Welcome back, {tenant?.name}!</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="My Room" value={tenant?.room?.roomNumber || 'N/A'} icon={FiHome} color="cyan" subtitle={tenant?.room?.roomType} delay={0} />
          <StatCard title="Monthly Rent" value={`₹${tenant?.rentAmount?.toLocaleString() || 0}`} icon={FiCreditCard} color="indigo" delay={0.1} />
          <StatCard title="Payment Status" value={tenant?.paymentStatus || 'N/A'} icon={FiCalendar} color={tenant?.paymentStatus === 'paid' ? 'green' : 'rose'} delay={0.2} />
          <StatCard title="Active Complaints" value={activeComplaints || 0} icon={FiAlertCircle} color="amber" delay={0.3} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Room Details */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="glass-dark rounded-2xl p-5 border border-slate-700/50">
            <h3 className="text-white font-semibold mb-4">Room Details</h3>
            {tenant?.room ? (
              <div className="space-y-3">
                {[
                  ['Room Number', tenant.room.roomNumber],
                  ['Room Type', tenant.room.roomType],
                  ['Floor', tenant.room.floor],
                  ['Monthly Rent', `₹${tenant.room.rent?.toLocaleString()}`],
                  ['Status', tenant.room.status],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-2 border-b border-slate-800 text-sm">
                    <span className="text-slate-400">{k}</span>
                    <span className="text-white capitalize">{v}</span>
                  </div>
                ))}
                {tenant.room.amenities?.length > 0 && (
                  <div className="pt-2">
                    <p className="text-slate-400 text-xs mb-2">Amenities</p>
                    <div className="flex flex-wrap gap-2">
                      {tenant.room.amenities.map((a) => (
                        <span key={a} className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full">{a}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-slate-500 text-sm">No room assigned yet.</p>
            )}
          </motion.div>

          {/* Pending Payment */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="glass-dark rounded-2xl p-5 border border-slate-700/50">
            <h3 className="text-white font-semibold mb-4">Upcoming Payment</h3>
            {pendingPayment ? (
              <div className="space-y-3">
                <div className={`p-4 rounded-xl border ${pendingPayment.status === 'overdue' ? 'bg-rose-500/10 border-rose-500/30' : 'bg-amber-500/10 border-amber-500/30'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-white font-semibold">{pendingPayment.month}</p>
                      <p className="text-slate-400 text-xs">Due: {pendingPayment.dueDate?.slice(0, 10)}</p>
                    </div>
                    <Badge label={pendingPayment.status} />
                  </div>
                  <p className="text-2xl font-bold text-white">₹{pendingPayment.amount?.toLocaleString()}</p>
                </div>
                <a href="/tenant/payments" className="block w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium text-center transition-colors">
                  Pay Now
                </a>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="p-3 rounded-full bg-green-500/10 mb-3">
                  <FiCreditCard size={24} className="text-green-400" />
                </div>
                <p className="text-green-400 font-medium">All payments up to date!</p>
                <p className="text-slate-500 text-xs mt-1">No pending dues</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Recent Payments */}
        {recentPayments?.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="mt-6 glass-dark rounded-2xl p-5 border border-slate-700/50">
            <h3 className="text-white font-semibold mb-4">Recent Payments</h3>
            <div className="space-y-2">
              {recentPayments.map((p) => (
                <div key={p._id} className="flex items-center justify-between py-2.5 border-b border-slate-800 text-sm">
                  <div>
                    <p className="text-white">{p.month}</p>
                    <p className="text-slate-500 text-xs">{p.paidAt ? `Paid on ${new Date(p.paidAt).toLocaleDateString()}` : `Due: ${p.dueDate?.slice(0, 10)}`}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-white font-medium">₹{p.amount?.toLocaleString()}</span>
                    <Badge label={p.status} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
