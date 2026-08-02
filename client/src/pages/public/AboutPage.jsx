import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MdOutlineApartment } from 'react-icons/md'
import { FiArrowLeft } from 'react-icons/fi'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-3xl mx-auto pt-16">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
          <FiArrowLeft /> Back to Home
        </Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6">
            <MdOutlineApartment size={28} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">About Smart PG</h1>
          <p className="text-slate-400 text-lg leading-relaxed mb-6">
            Smart PG is a modern, full-stack hostel and PG management platform built to solve the real-world challenges faced by PG owners near colleges and universities.
          </p>
          <p className="text-slate-400 leading-relaxed mb-6">
            From managing tenants and rooms to collecting rent online and tracking complaints — Smart PG brings everything under one roof with a beautiful, intuitive interface.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            {[
              { label: 'Tenants Managed', value: '500+' },
              { label: 'PG Owners', value: '50+' },
              { label: 'Payments Processed', value: '₹10L+' },
            ].map((s) => (
              <div key={s.label} className="glass-dark rounded-2xl p-5 border border-slate-700/50 text-center">
                <p className="text-3xl font-bold gradient-text">{s.value}</p>
                <p className="text-slate-400 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
