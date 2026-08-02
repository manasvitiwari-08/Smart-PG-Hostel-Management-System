import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiCreditCard, FiDownload } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { fetchMyPayments, createOrder, verifyPayment } from '../../services/paymentService'
import PageHeader from '../../components/ui/PageHeader'
import Badge from '../../components/ui/Badge'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'

export default function TenantPayments() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetchMyPayments()
      setPayments(res.data.payments)
    } catch { toast.error('Failed to load payments') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handlePayOnline = async (payment) => {
    setPaying(payment._id)
    try {
      // Create Razorpay order
      const orderRes = await createOrder({ paymentId: payment._id })
      const { orderId, amount, currency, keyId } = orderRes.data

      // Load Razorpay script dynamically
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      document.body.appendChild(script)
      script.onload = () => {
        const options = {
          key: keyId,
          amount,
          currency,
          name: 'Smart PG Management',
          description: `Rent for ${payment.month}`,
          order_id: orderId,
          handler: async (response) => {
            try {
              await verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                paymentId: payment._id,
              })
              toast.success('Payment successful!')
              load()
            } catch { toast.error('Payment verification failed') }
          },
          theme: { color: '#6366f1' },
        }
        const rzp = new window.Razorpay(options)
        rzp.open()
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to initiate payment')
    } finally {
      setPaying(null)
    }
  }

  if (loading) return <Spinner />

  const pending = payments.filter((p) => p.status !== 'paid')
  const paid = payments.filter((p) => p.status === 'paid')

  return (
    <div>
      <PageHeader title="Rent & Payments" subtitle="View your payment history and pay rent online" />

      {payments.length === 0 ? <EmptyState title="No payment records" subtitle="Your payment history will appear here" /> : (
        <div className="space-y-6">
          {/* Pending Payments */}
          {pending.length > 0 && (
            <div>
              <h3 className="text-slate-400 text-sm font-medium mb-3">Pending / Due</h3>
              <div className="space-y-3">
                {pending.map((p, i) => (
                  <motion.div key={p._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className={`glass-dark rounded-2xl p-5 border ${p.status === 'overdue' ? 'border-rose-500/30' : 'border-amber-500/30'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-white font-semibold">{p.month}</p>
                          <Badge label={p.status} />
                        </div>
                        <p className="text-slate-400 text-sm">Due: {p.dueDate?.slice(0, 10)}</p>
                        {p.notes && <p className="text-slate-500 text-xs mt-1">{p.notes}</p>}
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-white mb-2">₹{p.amount?.toLocaleString()}</p>
                        <button
                          onClick={() => handlePayOnline(p)}
                          disabled={paying === p._id}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors disabled:opacity-50"
                        >
                          <FiCreditCard size={14} />
                          {paying === p._id ? 'Processing...' : 'Pay Online'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Payment History */}
          {paid.length > 0 && (
            <div>
              <h3 className="text-slate-400 text-sm font-medium mb-3">Payment History</h3>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="glass-dark rounded-2xl border border-slate-700/50 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700/50">
                      {['Month', 'Amount', 'Method', 'Paid On', 'Status'].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-slate-400 font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paid.map((p, i) => (
                      <motion.tr key={p._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                        className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                        <td className="px-4 py-3 text-white">{p.month}</td>
                        <td className="px-4 py-3 text-green-400 font-medium">₹{p.amount?.toLocaleString()}</td>
                        <td className="px-4 py-3 text-slate-300 capitalize">{p.paymentMethod?.replace('_', ' ')}</td>
                        <td className="px-4 py-3 text-slate-300">{p.paidAt ? new Date(p.paidAt).toLocaleDateString() : '—'}</td>
                        <td className="px-4 py-3"><Badge label={p.status} /></td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
