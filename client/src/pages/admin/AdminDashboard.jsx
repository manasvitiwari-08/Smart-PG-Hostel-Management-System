import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiUsers, FiHome, FiCreditCard, FiAlertCircle, FiUserCheck, FiTrendingUp } from 'react-icons/fi'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { fetchAdminStats } from '../../services/dashboardService'
import StatCard from '../../components/ui/StatCard'
import Spinner from '../../components/ui/Spinner'
import toast from 'react-hot-toast'

const COLORS = ['#6366f1', '#f43f5e', '#f59e0b']

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdminStats()
      .then((res) => setData(res.data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner size="lg" />

  const { stats, monthlyData, roomStats } = data || {}

  const pieData = [
    { name: 'Occupied', value: stats?.occupiedRooms || 0 },
    { name: 'Available', value: stats?.availableRooms || 0 },
    { name: 'Maintenance', value: (stats?.totalRooms || 0) - (stats?.occupiedRooms || 0) - (stats?.availableRooms || 0) },
  ].filter((d) => d.value > 0)

  return (
    <div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-slate-400 text-sm mt-0.5">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Tenants" value={stats?.totalTenants || 0} icon={FiUsers} color="indigo" delay={0} />
          <StatCard title="Occupied Rooms" value={stats?.occupiedRooms || 0} icon={FiHome} color="purple" subtitle={`of ${stats?.totalRooms || 0} total`} delay={0.1} />
          <StatCard title="Rent Collected" value={`₹${(stats?.totalCollected || 0).toLocaleString()}`} icon={FiCreditCard} color="green" delay={0.2} />
          <StatCard title="Pending Rent" value={`₹${(stats?.totalPending || 0).toLocaleString()}`} icon={FiTrendingUp} color="rose" delay={0.3} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard title="Pending Complaints" value={stats?.pendingComplaints || 0} icon={FiAlertCircle} color="amber" delay={0.4} />
          <StatCard title="Visitors Today" value={stats?.visitorsToday || 0} icon={FiUserCheck} color="cyan" delay={0.5} />
          <StatCard title="Available Rooms" value={stats?.availableRooms || 0} icon={FiHome} color="green" delay={0.6} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Rent Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="lg:col-span-2 glass-dark rounded-2xl p-5 border border-slate-700/50">
            <h3 className="text-white font-semibold mb-4">Monthly Rent Collection</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlyData || []}>
                <defs>
                  <linearGradient id="rentGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#f1f5f9' }} />
                <Area type="monotone" dataKey="amount" stroke="#6366f1" fill="url(#rentGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Room Occupancy Pie */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="glass-dark rounded-2xl p-5 border border-slate-700/50">
            <h3 className="text-white font-semibold mb-4">Room Occupancy</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#f1f5f9' }} />
                <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Payment Summary */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="mt-6 glass-dark rounded-2xl p-5 border border-slate-700/50">
          <h3 className="text-white font-semibold mb-4">Payment Summary</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Paid', value: stats?.paidCount || 0, color: 'text-green-400' },
              { label: 'Unpaid', value: stats?.unpaidCount || 0, color: 'text-rose-400' },
              { label: 'Overdue', value: stats?.overdueCount || 0, color: 'text-amber-400' },
            ].map((item) => (
              <div key={item.label} className="text-center p-4 rounded-xl bg-slate-800/50">
                <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
                <p className="text-slate-400 text-sm mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
