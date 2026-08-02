import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowRight, FiUsers, FiHome, FiCreditCard, FiAlertCircle, FiShield, FiBarChart2 } from 'react-icons/fi'
import { MdOutlineApartment } from 'react-icons/md'

const features = [
  { icon: FiUsers, title: 'Tenant Management', desc: 'Add, edit, and track all tenants with complete profiles and room assignments.' },
  { icon: FiHome, title: 'Room Management', desc: 'Manage room availability, types, capacity, and rent in real time.' },
  { icon: FiCreditCard, title: 'Online Rent Payments', desc: 'Collect rent online via Razorpay. Auto-track payment history and receipts.' },
  { icon: FiAlertCircle, title: 'Complaint Tracking', desc: 'Tenants raise complaints, admins resolve them with priority and remarks.' },
  { icon: FiShield, title: 'Visitor Logs', desc: 'Track every visitor entry and exit with purpose and contact details.' },
  { icon: FiBarChart2, title: 'Analytics Dashboard', desc: 'Visual charts for occupancy, rent collection, and complaint trends.' },
]

const testimonials = [
  { name: 'Rahul Sharma', role: 'PG Owner, Pune', text: 'Smart PG transformed how I manage my 3 properties. Rent collection is now fully automated!' },
  { name: 'Priya Mehta', role: 'Tenant, Bangalore', text: 'I can pay rent, raise complaints, and check notices all from one place. Super convenient.' },
  { name: 'Amit Verma', role: 'Hostel Manager, Delhi', text: 'The visitor log feature alone saved us from so many security issues. Highly recommended.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass-dark border-b border-slate-700/30">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <MdOutlineApartment size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg gradient-text">Smart PG</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/about" className="text-slate-400 hover:text-white text-sm transition-colors hidden sm:block">About</Link>
            <Link to="/contact" className="text-slate-400 hover:text-white text-sm transition-colors hidden sm:block">Contact</Link>
            <Link to="/login" className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors">Login</Link>
            <Link to="/register" className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-sm font-medium transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-transparent to-purple-900/20 pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              Modern PG Management Platform
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold leading-tight mb-6">
              Manage Your PG{' '}
              <span className="gradient-text">Smarter,</span>
              <br />Not Harder
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10">
              The all-in-one digital platform for PG and hostel owners to manage tenants, rooms, rent, complaints, and visitors from one beautiful dashboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 font-semibold transition-all shadow-lg shadow-indigo-500/25">
                Start Free Today <FiArrowRight />
              </Link>
              <Link to="/login" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-slate-600 hover:border-indigo-500 text-slate-300 hover:text-white font-medium transition-all">
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3">Everything You Need</h2>
            <p className="text-slate-400">Powerful features built for modern PG management</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-dark rounded-2xl p-6 border border-slate-700/50 hover:border-indigo-500/30 transition-all card-hover"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center mb-4">
                  <f.icon size={20} className="text-indigo-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-bold mb-12">How It Works</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                { step: '01', title: 'Register as Admin', desc: 'Create your PG owner account and set up your property.' },
                { step: '02', title: 'Add Rooms & Tenants', desc: 'Configure rooms and onboard tenants with their details.' },
                { step: '03', title: 'Manage Everything', desc: 'Track rent, complaints, visitors, and more from your dashboard.' },
              ].map((item, i) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl font-bold mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-slate-900/30">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-bold">Trusted by PG Owners</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-dark rounded-2xl p-6 border border-slate-700/50"
              >
                <p className="text-slate-300 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-white text-sm">{t.name}</p>
                  <p className="text-indigo-400 text-xs">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center glass-dark rounded-3xl p-12 border border-indigo-500/20"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Go Digital?</h2>
          <p className="text-slate-400 mb-8">Join hundreds of PG owners who have simplified their management with Smart PG.</p>
          <Link to="/register" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 font-semibold transition-all shadow-lg shadow-indigo-500/25">
            Get Started Free <FiArrowRight />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-6 text-center text-slate-500 text-sm">
        <p>2025 Smart PG Management System. Built with love for PG owners.</p>
      </footer>
    </div>
  )
}
